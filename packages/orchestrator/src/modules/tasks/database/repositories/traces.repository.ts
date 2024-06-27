import { Bucket, Storage } from '@google-cloud/storage'

import { useEnv } from '@configs/env'
import { TracesRepositoryPort } from './traces.repository.port'
import { existsSync, readdirSync, rmSync } from 'fs'
import { Logger } from '@nestjs/common'

const LOCAL_TRACES_FOLDER = '/data/traces'

export class TracesRepository implements TracesRepositoryPort {
    private readonly storage: Storage | null
    private readonly bucket: Bucket | null

    constructor() {
        const keyFilePath = useEnv('GCLOUD_KEYFILE_PATH'),
            projectId = useEnv('GCLOUD_PROJECT_ID'),
            bucketName = useEnv('GCLOUD_BUCKET')
        if (keyFilePath && projectId && bucketName) {
            this.storage = new Storage({
                projectId,
                keyFilename: keyFilePath,
            })
            this.bucket = this.storage.bucket(bucketName)
        } else {
            this.storage = null
            this.bucket = null
        }
    }

    async uploadAll(): Promise<void> {
        if (!this.bucket) {
            return
        }

        // Basically, we upload all local traces to the cloud
        const files = await this.bucket.getFiles()
        const existingFiles = files[0].map((file) => file.name)

        const localFiles = existsSync(LOCAL_TRACES_FOLDER)
            ? readdirSync(LOCAL_TRACES_FOLDER)
            : []

        await Promise.all(
            localFiles.map(async (file) => {
                if (existingFiles.includes(file)) {
                    return
                }

                await this.uploadTrace(file.replace('.zip', ''))
            })
        )
    }

    async getTraceByTaskId(taskId: string): Promise<string | null> {
        // We first check if the trace is stored in the cloud
        if (this.bucket) {
            const file = this.bucket.file(`${taskId}.zip`)
            const exists = await file.exists()
            if (exists[0]) {
                // It exists, return the public URL
                return file.publicUrl()
            }
        }

        // If it's not in the cloud, we check if it's in the local filesystem
        if (existsSync(`${LOCAL_TRACES_FOLDER}/${taskId}.zip`)) {
            return `/api/local/traces/${taskId}.zip`
        }

        return null
    }

    async deleteTrace(taskId: string): Promise<void> {
        if (this.bucket) {
            const file = this.bucket.file(`${taskId}.zip`)
            const exists = await file.exists()
            if (exists[0]) {
                await file.delete()
            }
        }

        if (existsSync(`${LOCAL_TRACES_FOLDER}/${taskId}.zip`)) {
            // Delete the local file
            rmSync(`${LOCAL_TRACES_FOLDER}/${taskId}.zip`)
        }
    }

    async uploadTrace(taskId: string): Promise<void> {
        if (
            !this.bucket ||
            !existsSync(`${LOCAL_TRACES_FOLDER}/${taskId}.zip`)
        ) {
            return
        }

        Logger.debug(
            `Uploading trace ${taskId} to the cloud`,
            'TracesRepository'
        )

        await this.bucket.upload(`${LOCAL_TRACES_FOLDER}/${taskId}.zip`, {
            destination: `${taskId}.zip`,
        })

        rmSync(`${LOCAL_TRACES_FOLDER}/${taskId}.zip`)
    }
}

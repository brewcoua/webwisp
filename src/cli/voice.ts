import ora from 'ora'
import AudioRecorder from 'node-audiorecorder'
import fs from 'node:fs'
import chalk from 'chalk'
import { confirm } from '@inquirer/prompts'
import OpenAI from 'openai'

const RECORD_PATH = './dist/voice.wav'

async function recordVoice() {
    const recorder = new AudioRecorder(
        {
            program: 'sox',
            type: 'wav',
        },
        console
    )

    const spinner = ora({
        text: 'Recording...',
        spinner: 'dots',
        color: 'cyan',
    })

    const waitForEnd = new Promise<void>((resolve, reject) => {
        recorder.on('end', () => {
            spinner.stop()
            console.log(
                chalk.green.bold('Success!'),
                chalk.white('Voice recording complete')
            )
            resolve()
        })
    })

    recorder.on('error', (error: any) => {
        console.log(chalk.redBright.bold('Error!'), chalk.white(error.message))
    })

    const fileStream = fs.createWriteStream(RECORD_PATH, { encoding: 'binary' })

    recorder.start().stream().pipe(fileStream)

    spinner.start()

    // Set promise with a timeout of 5s and the waitForEnd
    // Wait for the first to be resolved
    await Promise.race([
        waitForEnd,
        new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                spinner.stop()
                console.log(
                    chalk.yellow.bold('Warning!'),
                    chalk.white(
                        'Voice recording timed out, may not have been successful'
                    )
                )
                resolve()
            }, 10000)
        }),
    ])
}

async function transcriptVoice() {
    // Use whisper to transcribe the voice
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY environment variable')
    }

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORG,
        project: process.env.OPENAI_PROJECT,
    })

    const spinner = ora({
        text: 'Transcribing voice input',
        spinner: 'dots',
        color: 'cyan',
    })

    spinner.start()
    const transcription = await client.audio.transcriptions.create({
        file: fs.createReadStream(RECORD_PATH),
        model: 'whisper-1',
        language: 'en',
        prompt: 'Transcribe the voice input into a valid task to do on a website. Make sure to ignore any filler words or sounds.',
    })
    spinner.stop()
    return transcription.text
}

export async function promptVoice(title: string) {
    let isDone = false
    let result = ''

    while (!isDone) {
        await recordVoice()
        result = await transcriptVoice()

        console.log('🎤', chalk.white(result))
        isDone = await confirm({
            message: 'Is this correct?',
        })
    }

    return result
}

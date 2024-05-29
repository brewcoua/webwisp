import ora from 'ora'
import AudioRecorder from 'node-audiorecorder'
import fs from 'node:fs'
import chalk from 'chalk'
import { OpenAIService } from '../services/OpenAI.service'

const RECORD_PATH = './dist/voice.mp3'

async function recordVoice() {
    const recorder = new AudioRecorder({
        program: 'sox',
        type: 'mp3',
        silence: 0,
    }, console)

    const spinner = ora({
        text: 'Recording voice input',
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

    recorder.on('error', (error) => {
        console.log(
            chalk.redBright.bold('Error!'),
            chalk.white(error)
        )
    })

    const fileStream = fs.createWriteStream(RECORD_PATH, { encoding: 'binary'})

    recorder
        .start()
        .stream()
        .pipe(fileStream)

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
                    chalk.white('Voice recording timed out, may not have been successful')
                )
                resolve()
            }, 5000)
        })
    ])
}

async function transcriptVoice() {
    // Use whisper to transcribe the voice

    const client = OpenAIService.makeClient()
    
    const spinner = ora({
        text: 'Transcribing voice input',
        spinner: 'dots',
        color: 'cyan',
    })

    spinner.start()
    const transcription = await client.audio.transcriptions.create({
        file: fs.createReadStream(RECORD_PATH),
        model: 'whisper-1'
    })
    spinner.stop()
    return transcription.text
}

export async function promptVoice() {
    await recordVoice()
    const transcription = await transcriptVoice()
    console.log(transcription)
}
import type { BunPlugin } from 'bun'
import { exec } from 'child_process'
import chalk from 'chalk'

const InlineScriptPlugin: BunPlugin = {
    name: 'inline-script-as-string',
    setup(build) { // Inline js and css
        build.onLoad({ filter: /\.inline\.(js|css)$/ }, async (args) => {
            return {
                contents: await Bun.file(args.path).text(),
                loader: 'text',
            }
        })
    },
}

async function main() {
    const result = await Bun.build({
        entrypoints: ['./src/main.ts'],
        compile: true,
        minify: true,
        target: 'bun',
        outdir: './dist',
        plugins: [InlineScriptPlugin],
        external: ['playwright', 'openai'],
    })
    result.logs.forEach(console.log)
    if (!result.success) {
        console.error(chalk.red('Build failed'))
        process.exit(1)
    }

    // Then we want to compile everything

    // Set color env
    process.env.FORCE_COLOR = '1'

    exec(`bun build ./dist/main.js --compile --target=bun --outfile ./dist/webwisp -e playwright -e openai`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(stdout)
    })
}

main().catch(console.error)
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/webwisp.js',
        format: 'cjs',
    },
    plugins: [
        typescript(),
        resolve({
            preferBuiltins: true,
        }),
        commonjs(),
        json(),
        terser(),
    ],
    external: [
        'playwright',
        'openai',
        '@inquirer/core',
        '@inquirer/prompts',
        'ora',
        'node-audiorecorder',
        'commander',
        'dotenv',
        'chalk',
    ],
}

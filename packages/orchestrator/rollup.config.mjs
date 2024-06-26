import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import terser from '@rollup/plugin-terser'

import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default [
    {
        input: 'src/main.ts',
        output: [
            {
                file: 'dist/main.js',
                format: 'cjs',
            },
        ],
        plugins: [
            typescript({
                outputToFilesystem: true,
                noEmitOnError: true,
                tsconfig: 'tsconfig.json',
            }),
            resolve({
                exportConditions: ['node'],
                preferBuiltins: true,
            }),
            commonjs(),
            terser({
                mangle: false,
            }),
        ],
        external: Object.keys(pkg.dependencies || {}),
    },
]

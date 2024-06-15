import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'

import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const internals = ['nanoid']

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
            copy({
                targets: [
                    {
                        src: 'assets/**/*',
                        dest: 'dist/assets',
                    },
                ],
            }),
        ],
        external: Object.keys(pkg.dependencies || {}).filter(
            (key) => !internals.some((i) => key.startsWith(i))
        ),
    },
]

import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
            },
        ],
        plugins: [
            typescript({
                outputToFilesystem: true,
                noEmitOnError: true,
            }),
            resolve({
                exportConditions: ['node'],
                preferBuiltins: true,
            }),
            commonjs(),
            json(),
            terser(),
        ],
        external: ['playwright', 'openai', 'winston'],
    },
]

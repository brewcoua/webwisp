import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/webwisp.js',
        format: 'es',
    },
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
}

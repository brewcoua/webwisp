import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const internals = [];

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
			}),
			resolve({
				exportConditions: ['node'],
				preferBuiltins: true,
			}),
			commonjs(),
			json(),
			terser({
				mangle: false,
			}),
		],
		external: Object.keys(pkg.dependencies || {})
		.filter((key) => !internals.some((i) => key.startsWith(i)))
	},
];

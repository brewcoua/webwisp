import { defineConfig } from 'vite'
import { ViteToml } from 'vite-plugin-toml'
import raw from 'vite-raw-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        ViteToml(),
        raw({
            fileRegex: /\.js$/,
        }),
    ],
    build: {
        ssr: './src/main.ts',
        outDir: 'dist',
        minify: 'terser',
    },
    ssr: {
        external: ['playwright', 'openai'],
    },
})

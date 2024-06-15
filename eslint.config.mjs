import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import globals from 'globals'

export default tsEslint.config({
    name: 'webwisp',
    ignores: ['dist', 'node_modules', '.rollup.cache'],
    languageOptions: {
        globals: {
            ...globals.nodeBuiltin,
        },
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    extends: [
        eslint.configs.recommended,
        ...tsEslint.configs.recommendedTypeChecked,
    ],
})

import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,  // Сохраните существующие глобальные переменные
        Handlebars: 'readonly',  // Добавьте Handlebars как только для чтения
      },
    },

    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'semi': ['warn', 'always'],
    },
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    ignores: [
      'node_modules/**',
    ],
  },
  pluginJs.configs.recommended,
];

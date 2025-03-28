const react = require('eslint-plugin-react');
const unusedImports = require('eslint-plugin-unused-imports');
const globals = require('globals');
const js = require('@eslint/js');
const playwright = require('eslint-plugin-playwright');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: [
      '**/*.config.js',
      'app/javascript/channels/*.js',
      'app/javascript/packs/*.js',
      'app/javascript/packs/*.jsx',
      'config/webpack/*.js',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier'
  ),
  {
    plugins: {
      react,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        _: false,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      'react/prop-types': 'off',
      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['playwright/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
    },
  },
];

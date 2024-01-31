/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  root: true,
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.js'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true
      },
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript/base',
        'prettier',
        'plugin:prettier/recommended'
      ],
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'unused-imports/no-unused-imports-ts': 'error',
        'unused-imports/no-unused-vars-ts': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_'
          }
        ],
        'max-classes-per-file': 'off',
        'class-methods-use-this': 'off',
        radix: 'off',
        'no-console': 'warn',
        'import/no-deprecated': 'off',
        '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-expect-error': 'allow-with-description' }]
      }
    },
    {
      files: ['**/*.json',"!**/node_modules/**"],
      extends: ['plugin:json/recommended']
    }
  ]
};

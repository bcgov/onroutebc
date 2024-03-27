module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',    
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript : true,
      node: true
    }
    //   // use <root>/tsconfig.json
    //   typescript: {
    //     alwaysTryTypes: true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
    //   },
    //   node: {
    //     extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts']
    //   }
    // }
 },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.cjs'],
  rules: {
    'n/no-missing-import': 'off', // Disable the rule causing the issue
    //'n/no-extraneous-import':'off',
    'import/no-unresolved': ['error', { commonjs: true, amd: false }], // Enable this rule to ensure imports are resolved
    // '@typescript-eslint/interface-name-prefix': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/explicit-module-boundary-types': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
  },
};
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": "./tsconfig.json"
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.cjs'],
  rules: {
    "react/react-in-jsx-scope": "off" // Starting from the release 17 of React, JSX is automatically transformed without using React.createElement
  },
  settings: {
    "react": {
      "version": "detect"
    }
  }
}

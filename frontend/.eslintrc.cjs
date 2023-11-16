module.exports = {
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": "./tsconfig.json"
  },
  "plugins": [
      "react",
      "@typescript-eslint"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off" // Starting from the release 17 of React, JSX is automatically transformed without using React.createElement
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}

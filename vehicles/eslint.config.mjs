import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
    rules: {
      // Disable the prefer-nullish-coalescing rule temporarily. To be enabled when strictNullChecks enabled and resolved.
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-base-to-string": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["src/*", "src/**","test/*", "test/**"],
              message: "Use relative imports instead of alias imports from src.",
            },
          ],
        },
      ],
    },
 },
  { files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
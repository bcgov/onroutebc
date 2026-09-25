import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";
import importAliasPluginPackage from '@dword-design/eslint-plugin-import-alias';

const importAliasPlugin = importAliasPluginPackage.configs.recommended.plugins['@dword-design/import-alias'];

export default tseslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
    plugins: {
      '@dword-design/import-alias': importAliasPlugin,
    },
    rules: {
      // Disable the prefer-nullish-coalescing rule temporarily. To be enabled when strictNullChecks enabled and resolved.
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-base-to-string": "off",
      "@dword-design/import-alias/prefer-alias": ["error", {
        shouldReadTsConfig: true,
      }],
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
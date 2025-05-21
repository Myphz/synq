import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  eslintPluginUnicorn.configs["flat/recommended"],
  {
    rules: {
      "unicorn/no-empty-file": "off",
      "unicorn/prefer-query-selector": "off",
      "unicorn/no-null": "off",
      "unicorn/expiring-todo-comments": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/prefer-code-point": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/explicit-length-check": "off",
      "unicorn/catch-error-name": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-magic-array-flat-depth": "off"
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    plugins: {
      "unused-imports": unusedImports
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/"]
  }
];

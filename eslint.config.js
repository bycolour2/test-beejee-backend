import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["./src/**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      "unused-imports": unusedImports,
      import: importPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "import/order": ["error", { "newlines-between": "always" }],
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
      "no-undef": "off",
      "prefer-const": "error",
      "no-console": "warn",
      "no-debugger": "warn",
      "prettier/prettier": "error",
    },
  },
  prettier,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];

import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  {
    ignores: ["**/dist/"],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      // rule overrides
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          caughtErrors: "all",
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
      "react/prop-types": "off",
    },
  },
];

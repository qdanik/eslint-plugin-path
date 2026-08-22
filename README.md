# eslint-plugin-path
[![Biome](https://img.shields.io/badge/linting-biome-60a5fa?style=flat-square)](https://biomejs.dev)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa?style=flat-square)](https://biomejs.dev)

An ESLint plugin for enforcing consistent import paths across a project. It rewrites relative imports to absolute ones (or the reverse), based on the `paths` and `baseUrl` in your `tsconfig.json` / `jsconfig.json`.

## Installation

```sh
# npm
npm install eslint-plugin-path --save-dev

# yarn
yarn add eslint-plugin-path --dev
```

## ESLint 10+

This plugin requires ESLint 10 or later and Node.js `^20.19.0 || ^22.13.0 || >=24` — the same range ESLint 10 supports.

It uses the flat config format (`eslint.config.js`). The legacy `.eslintrc` format was removed in ESLint 10 and is not supported.

### Basic usage

```js
import eslintPluginPath from 'eslint-plugin-path';

export default [
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      path: eslintPluginPath,
    },
    rules: {
      'path/no-relative-imports': [
        'error',
        {
          maxDepth: 2,
          suggested: false,
        },
      ],
    },
  },
];
```

### Using `defineConfig()`

```js
import { defineConfig } from 'eslint/config';
import eslintPluginPath from 'eslint-plugin-path';

export default defineConfig([
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      path: eslintPluginPath,
    },
    rules: {
      'path/no-relative-imports': [
        'error',
        {
          maxDepth: 2,
          suggested: false,
        },
      ],
    },
  },
]);
```

### Using presets

```js
import eslintPluginPath from 'eslint-plugin-path';

export default [
  ...eslintPluginPath.configs.recommended,
];
```

## Custom tsconfig/jsconfig paths
If you are using custom paths in your `tsconfig.json` or `jsconfig.json` file, you can specify the path to the configuration file in your ESLint settings:

```js
import eslintPluginPath from 'eslint-plugin-path';

export default [
  {
    plugins: { path: eslintPluginPath },
    settings: {
      path: {
        config: 'tsconfig.json', // or 'jsconfig.json'
      },
    },
    rules: {
      'path/no-relative-imports': 'error',
    },
  },
];
```

## Configuration

Enable the rules in your ESLint flat configuration:

```js
import eslintPluginPath from 'eslint-plugin-path';

export default [
  {
    plugins: { path: eslintPluginPath },
    rules: {
      'path/no-relative-imports': 'error',
    },
  },
];
```

Or use the `recommended` preset:

```js
import eslintPluginPath from 'eslint-plugin-path';

export default [
  ...eslintPluginPath.configs.recommended,
];
```

## What is checked

All three rules inspect the specifier of these forms:

```js
import x from '../../components/button';   // static import
import('../../components/button');         // dynamic import
require('../../components/button');        // CommonJS require
```

Re-export declarations are **not** checked:

```js
export * from '../../components/button';        // not reported
export { Button } from '../../components/button'; // not reported
```

Bare specifiers that resolve inside `node_modules` (e.g. `react`) are always skipped.

## Rules

✔ included in the "recommended" preset

🔧 fixable using the `--fix` command line option

💡 provides editor suggestions

|     |     |     | Name                                                                                                                      | Description                                                                |
| --- | --- | --- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ✔   | 🔧  | 💡  | [no-relative-imports](https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-relative-imports.md) | disallow relative imports of files where absolute is preferred |
|    | 🔧  | 💡  | [no-absolute-imports](https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-absolute-imports.md) | disallow absolute imports of files where relative is preferred |
|    | 🔧  | 💡  | [only-absolute-imports](https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/only-absolute-imports.md) |disallow relative imports of files through the whole project |

## Presets

- `recommended` — enables `no-relative-imports` with `{ maxDepth: 1, suggested: true }`. Note this is stricter than the rule's own defaults (`{ maxDepth: 2, suggested: false }`).

`recommended` is the only preset. The three rules express mutually exclusive policies, so no single config can enable them together — pick the one rule that matches your project and configure it explicitly.

> **Removed in 3.0.0:** the `all` preset. It never enabled all rules — it enabled only `no-relative-imports`, with weaker settings than `recommended`. See the [CHANGELOG](./CHANGELOG.md).

# License

[MIT](https://github.com/qDanik/eslint-plugin-path/blob/main/LICENSE)

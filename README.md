# eslint-plugin-path
[![Biome](https://img.shields.io/badge/linting-biome-60a5fa?style=flat-square)](https://biomejs.dev)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa?style=flat-square)](https://biomejs.dev)

An ESLint plugin for enforcing consistent imports across project. In other words, it helps to replace all relatives import with absolutes dependinng on settings.

## Installation

```sh
# npm
npm install eslint-plugin-path --save-dev

# yarn
yarn add eslint-plugin-path --dev
```

## ESLint 10+

This plugin requires ESLint 10 or later and Node.js >= 20.19.0. It uses the flat config format (`eslint.config.js`).

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

## Rules

✔ included in the "recommended" preset

🔧 fixable using the `--fix` command line option

|     |     | Name                                                                                                                      | Description                                                                |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ✔   | 🔧  | [no-relative-imports](https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-relative-imports.md) | disallow relative imports of files where absolute is preferred |
|    | 🔧  | [no-absolute-imports](https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-absolute-imports.md) | disallow absolute imports of files where relative is preferred |
|    | 🔧  | [only-absolute-imports](https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/only-absolute-imports.md) |disallow relative imports of files through the whole project |

## Presets

- `recommended` enables rules recommended for all users
- `all` enables all rules

# License

[MIT](https://github.com/qDanik/eslint-plugin-path/blob/main/LICENSE)

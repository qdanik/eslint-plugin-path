# eslint-plugin-path [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An ESLint plugin for enforcing consistent imports across project. In other words, it helps to replace all relatives import with absolutes dependinng on settings.

## Installation

```sh
# npm
npm install eslint-plugin-path --save-dev

# yarn
yarn add eslint-plugin-path --dev
```

## ESlint 9+

If you are using ESLint 9 or later, you can use the plugin without any additional configuration. Just install it and add it to your ESLint configuration.
```js
import eslintPluginPath from 'eslint-plugin-path';

export default [
  {
    files: ['*.{js,ts,jsx,tsx}'],
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

## ESlint 8 and below

If you are using ESLint 8 or below, you need to add the plugin to your ESLint configuration file. You can do this by adding the following lines to your `.eslintrc` file:

```json
{
  "plugins": ["path"],
  "extends": ["plugin:path/recommended"] // optional
  "rules": {
    "path/no-relative-imports": [
      "error",
      {
        "maxDepth": 2,
        "suggested": false
      }
    ]
  }
}
```
Or if you are using a JavaScript configuration file, you can add the following lines to your `.eslintrc.js` file:

```js
module.exports = {
  plugins: ['path'],
  extends: ['plugin:path/recommended'], // optional
  rules: {
    'path/no-relative-imports': [
      'error',
      {
        maxDepth: 2,
        suggested: false,
      },
    ],
  },
};
```

## Custom tsconfig/jsconfig paths
If you are using custom paths in your `tsconfig.json` or `jsconfig.json` file, you can specify the path to the configuration file in the ESLint configuration file. You can do this by adding the following lines to your config file:

```json
{
  "settings": {
    "path": {
      "config": "tsconfig.json" // or "./jsconfig.json"
    }
  }
}
```

## Configuration

Enable the rules in your ESLint configuration file:

```json
{
  "plugins": ["path"],
  "rules": {
    "path/no-relative-imports": "error",
  },
}
```

Or add the "recommended" preset:

```json
{
  "extends": ["plugin:path/recommended"]
}
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

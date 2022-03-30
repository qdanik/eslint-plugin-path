# eslint-plugin-path [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An ESLint plugin for enforcing consistent imports across project.

## Installation

```sh
# npm
npm install eslint-plugin-path --save-dev

# yarn
yarn add eslint-plugin-path --dev
```

## Configuration

Enable the rules in your ESLint configuration file:

```json
{
  "plugins": ["path"],
  "rules": {
    "path/no-relative-imports": "error",
  }
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

## Presets

- `recommended` enables rules recommended for all users
- `all` enables all rules

# License

[MIT](https://github.com/qDanik/eslint-plugin-path/blob/main/LICENSE)

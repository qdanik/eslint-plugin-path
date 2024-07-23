import { ESLint } from 'eslint';
import { rules } from './rules';
import packageJson from '../package.json';


const eslintPluginPath: ESLint.Plugin = {
  meta: {
    name: 'eslint-plugin-path',
    version: packageJson.version,
  },
  rules: {
    'no-relative-imports': rules.noRelativeImports,
    'no-absolute-imports': rules.noAbsoluteImports,
    'only-absolute-imports': rules.onlyAbsoluteImports,
  },
  configs: {
    recommended: {
      plugins: ['path'],
      rules: {
        'path/no-relative-imports': ['error', { maxDepth: 1, suggested: true }],
      },
    },
    all: {
      plugins: ['path'],
      rules: {
        'path/no-relative-imports': ['error', { maxDepth: 2, suggested: false }],
      },
    },
  }
};

export = eslintPluginPath;
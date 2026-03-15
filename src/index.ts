import type { TSESLint } from '@typescript-eslint/utils';
import packageJson from '../package.json';
import { rules } from './rules';

const eslintPluginPath: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: 'eslint-plugin-path',
    version: packageJson.version,
    namespace: 'path',
  },
  rules: {
    'no-relative-imports': rules.noRelativeImports,
    'no-absolute-imports': rules.noAbsoluteImports,
    'only-absolute-imports': rules.onlyAbsoluteImports,
  },
};

const plugins = {
  path: eslintPluginPath,
};

const flatConfigPlugin: TSESLint.FlatConfig.Plugin = {
  ...eslintPluginPath,
  configs: {
    recommended: [
      {
        plugins,
        rules: {
          'path/no-relative-imports': ['error', { maxDepth: 1, suggested: true }],
        },
      },
    ],
    all: [
      {
        plugins,
        rules: {
          'path/no-relative-imports': ['error', { maxDepth: 2, suggested: false }],
        },
      },
    ],
  },
};

export = flatConfigPlugin;

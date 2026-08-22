import type { ESLint } from 'eslint';
import packageJson from '../package.json';
import { rules } from './rules';

const eslintPluginPath: ESLint.Plugin = {
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

// `recommended` is the only preset: the three rules express mutually exclusive
// policies, so no single config can meaningfully enable them together.
const flatConfigPlugin: ESLint.Plugin = {
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
  },
};

export = flatConfigPlugin;

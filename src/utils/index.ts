import { dirname, join, normalize } from 'node:path';
import type { Rule } from 'eslint';
import type * as ESTree from 'estree';
import type { AliasItem } from './config';
import { getConfigSettings } from './config';
import { isExistingPath } from './import-types';
import { getPackagePath } from './package';
import type { ConfigSettings, ConfigureSource, NodeParentExtension } from './types';

/**
 * ImportHandlerParams type definition
 */
interface ImportHandlerParams {
  node: any;
  value: string;
  path: string;
  start: number;
  end: number;
  packagePath: string;
  configSettings: AliasItem[];
  filename: string;
}

/**
 * Resolves an import specifier against tsconfig/jsconfig alias and baseUrl entries.
 * Tries alias patterns first (wildcard and exact), then baseUrl entries.
 */
function resolveFromConfig(value: string, config: AliasItem[]): string {
  for (const item of config) {
    if (item.alias === null) {
      // baseUrl entry — join directly
      const resolved = join(item.path, value);
      if (isExistingPath(resolved)) return resolved;
      continue;
    }

    if (item.isWildcard) {
      if (!value.startsWith(item.alias)) continue;
      const remainder = value.slice(item.alias.length);
      const resolved = join(item.path, remainder);
      if (isExistingPath(resolved)) return resolved;
    } else {
      if (value !== item.alias) continue;
      if (isExistingPath(item.path)) return item.path;
    }
  }

  return '';
}

function configureParams<T>(
  filename: string,
  node: T,
  source: ConfigureSource,
  packagePath: string,
  configSettings: AliasItem[],
): ImportHandlerParams {
  const value = source.value?.toString() ?? '';
  let path = normalize(join(dirname(filename), value));

  if (!isExistingPath(path)) {
    path = resolveFromConfig(value, configSettings);
  }

  const [start, end] = source.range || [0, 0];

  return {
    node,
    value,
    path,
    start,
    end,
    packagePath,
    configSettings,
    filename,
  };
}

/**
 * ESLint rule handler
 * @param context - The ESLint rule context
 * @param callback - The callback function to call
 */
export function getImport(
  context: Rule.RuleContext,
  callback: (params: ImportHandlerParams) => void,
): any {
  const filename = context.filename;
  const settings = (context.settings?.path ?? {}) as ConfigSettings;

  if (!filename) {
    return {};
  }
  const packagePath = getPackagePath(filename);
  const configSettings = getConfigSettings(packagePath, settings);

  return {
    ImportDeclaration: (node: ESTree.ImportDeclaration & NodeParentExtension) => {
      callback(configureParams(filename, node, node.source, packagePath, configSettings));
    },
    CallExpression: (node: ESTree.CallExpression & NodeParentExtension) => {
      if (
        node.arguments.length > 0 &&
        node?.arguments?.[0]?.type === 'Literal' &&
        (node?.callee?.type === 'ImportExpression' ||
          (node?.callee?.type === 'Identifier' && node?.callee?.name === 'require'))
      ) {
        callback(configureParams(filename, node, node.arguments[0], packagePath, configSettings));
      }
    },
    ImportExpression: (node: ESTree.ImportExpression & NodeParentExtension) => {
      if (node.source.type === 'Literal') {
        callback(configureParams(filename, node, node.source, packagePath, configSettings));
      }
    },
  };
}

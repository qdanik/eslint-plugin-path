import { dirname, join, normalize } from "path";
import * as ESTree from "estree";
import { Rule } from "eslint";
import { getPackagePath } from "./package";
import { getConfigSettings, AliasItem } from "./config";
import { isExistingPath } from "./import-types";
import { ConfigSettings, ConfigureSource, NodeParentExtension } from './types';

/**
 * ImportHandlerParams type definition
 */
interface ImportHandlerParams {
  node: any; // Consider specifying a more specific type
  value: string;
  path: string;
  start: number;
  end: number;
  packagePath: string;
  configSettings: AliasItem[];
  filename: string;
}

/**
 * Params configurator
 * @param value - path to file
 * @param config - settings from tsconfig.json/jsconfig.json
 * @returns Returns array of paths
 */
const getConfigPaths = (value: string, config: AliasItem[]): string[] =>
  config.map(({ path }) => join(path, value));

/**
 * Params configurator
 * @param filename - The name of the file
 * @param node - The node in the AST
 * @param source - The source object containing value and range
 * @param packagePath - The path to package.json
 * @param configSettings - Settings from tsconfig.json/jsconfig.json
 * @returns The configured ImportHandlerParams
 */
function configureParams<T>(
  filename: string,
  node: T, // Consider specifying a more specific type
  source: ConfigureSource,
  packagePath: string,
  configSettings: AliasItem[]
): ImportHandlerParams {
  const value = source.value?.toString() ?? "";
  let path = normalize(join(dirname(filename), value));

  if (!isExistingPath(path)) {
    path = getConfigPaths(value, configSettings).find(isExistingPath) || "";
  }
  const [start, end] = source.range || [0, 0]; // Default to [0, 0] if range is undefined

  return {
    node,
    value: value,
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
export function getImport(context: Rule.RuleContext, callback: (params: ImportHandlerParams) => void): any {
  const filename = context.filename;
  const settings = (context.settings?.path ?? {}) as ConfigSettings;

  if (!filename) {
    return {};
  }
  const packagePath = getPackagePath(filename);
  const configSettings = getConfigSettings(packagePath, settings);

  return {
    ImportDeclaration: (node: ESTree.ImportDeclaration & NodeParentExtension) => {
      callback(
        configureParams(
          filename,
          node,
          node.source,
          packagePath,
          configSettings
        )
      );
    },
    CallExpression: (node: ESTree.CallExpression & NodeParentExtension) => {
      if (
        node.arguments.length > 0 &&
        node?.arguments?.[0]?.type === "Literal" &&
        (node?.callee?.type === "ImportExpression" ||
          (node?.callee?.type === "Identifier" && node?.callee?.name === "require"))
      ) {
        callback(
          configureParams(
            filename,
            node,
            node.arguments[0],
            packagePath,
            configSettings
          )
        );
      }
    },
    ImportExpression: (node: ESTree.ImportExpression & NodeParentExtension) => {
      if (node.source.type === "Literal") {
        callback(
          configureParams(
            filename,
            node,
            node.source,
            packagePath,
            configSettings
          )
        );
      }
    },
  };
}

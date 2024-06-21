"use strict";

const { dirname, join, normalize } = require("path");
const { getPackagePath } = require("./package");
const { getConfigSettings } = require("./config");
const { isExistingPath } = require("./import-types");

/**
 * @typedef {Object} ImportHandlerParams
 * @property {any} node - context node from eslint
 * @property {string} value - import value
 * @property {string} path - path to import value
 * @property {number} start - star of line where import is declared
 * @property {number} end - end of line where import is declared
 * @property {string} packagePath - path to package.json
 * @property {Array<import('./config').AliasItem>} configSettings - settings tsconfig.json/jsconfig.json
 * @property {string} filename - path to file
 */
/**
 * Params configurator
 * @param {string} value - path to file
 * @param {Array<import('./config').AliasItem>} config - settings tsconfig.json/jsconfig.json
 * @returns {Array<string>} - returns array of paths
 */
const getConfigPaths = (value, config) =>
  config.map(({ path }) => join(path, value));

/**
 * Params configurator
 * @param {string} filename
 * @param {any} node
 * @param {{value: string; range: [number, number]}} source
 * @param {string} packagePath - path to package.json
 * @param {Array<import('./config').AliasItem>} configSettings - settings from tsconfig.json/jsconfig.json
 * @returns {ImportHandlerParams}
 */
function configureParams(
  filename,
  node,
  { value, range },
  packagePath,
  configSettings
) {
  let path = normalize(join(dirname(filename), value));

  if (!isExistingPath(path)) {
    path = getConfigPaths(value, configSettings).find(isExistingPath) || "";
  }
  const [start, end] = range || [];

  return {
    node,
    value,
    path: path ?? "",
    start,
    end,
    packagePath,
    configSettings,
    filename,
  };
}

/**
 * ESLint rule handler
 * @param {import('eslint').Rule.RuleContext} context
 * @param {(params: ImportHandlerParams) => void} callback
 * @returns {any} eslint rule handler
 */
function getImport(context, callback) {
  const filename = context.getFilename();

  if (!filename) {
    return {};
  }
  const packagePath = getPackagePath(filename);
  const configSettings = getConfigSettings(packagePath);

  return {
    ImportDeclaration: (node) => {
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
    CallExpression: (node) => {
      if (
        node.arguments.length > 0 &&
        node.arguments[0].type === "Literal" &&
        (node.callee.type === "Import" ||
          (node.callee.type === "Identifier" && node.callee.name === "require"))
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
    ImportExpression: (node) => {
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

module.exports = {
  getImport,
};

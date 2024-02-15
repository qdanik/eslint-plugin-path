"use strict";

const { join, isAbsolute } = require("path");
const { FILES } = require("./constants");
const { loadConfigFile, isFileExists, isPathExists } = require("./helpers");

/**
 * Helps to clear matchers' key or value
 * @param {string} value
 * @returns {string} - cleared tsconfig path matcher value
 */
function clearMatcher(value) {
  return value.replace("*", "");
}

/**
 * Helps to create alias item creator based on package dir
 * @param {string} packageDir
 * @returns {function(string, ?string=): AliasItem} - returns alias item creator
 */
function getAliasItemCreator(packageDir) {
  return function createAliasItem(path, alias = null) {
    return {
      path: isAbsolute(path)
        ? clearMatcher(path)
        : join(packageDir, clearMatcher(path)),
      alias: alias ? clearMatcher(alias) : null,
    };
  };
}

/**
 * Creates alias items that were described in tsconfig.json
 *
 * @typedef {Object} AliasItem
 * @property {string} path
 * @property {string|null} alias
 *
 * @param {string} packagePath
 * @returns {Array<AliasItem>} - Returns array of alias items
 */
function getConfigSettings(packagePath) {
  let fileName = null;

  if (isFileExists(packagePath, FILES.tsconfig)) {
    fileName = FILES.tsconfig;
  }

  if (isFileExists(packagePath, FILES.jsconfig)) {
    fileName = FILES.jsconfig;
  }

  if (fileName === null) {
    return [];
  }

  const urls = [];
  const config = loadConfigFile(packagePath, fileName);
  const createAliasItem = getAliasItemCreator(packagePath);

  if (isPathExists(config, "data.compilerOptions.paths")) {
    Object.entries(config.data.compilerOptions.paths).forEach(([key, paths]) =>
      paths.forEach((path) => urls.push(createAliasItem(path, key)))
    );
  }

  if (isPathExists(config, "data.include")) {
    config.data.include.forEach((path) => urls.push(createAliasItem(path)));
  }

  if (isPathExists(config, "data.compilerOptions.baseUrl")) {
    urls.push(createAliasItem(config.data.compilerOptions.baseUrl));
  }

  return urls;
}

function getConfigBasePath(packagePath) {
  let fileName = null;

  if (isFileExists(packagePath, FILES.tsconfig)) {
    fileName = FILES.tsconfig;
  }

  if (isFileExists(packagePath, FILES.jsconfig)) {
    fileName = FILES.jsconfig;
  }

  if (fileName === null) {
    return packagePath;
  }

  const config = loadConfigFile(packagePath, fileName);

  if (isPathExists(config, "data.compilerOptions.baseUrl")) {
    return join(packagePath, config.data.compilerOptions.baseUrl);
  }

  return packagePath;
}

module.exports = {
  getConfigSettings,
  getConfigBasePath,
};

"use strict";

const { join } = require("path");
const { getPackagePath } = require("./package");
const { FILES } = require("./constants");
const { loadJSONFile, isFileExists, isPathExists } = require("./helpers");

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
      path: join(packageDir, clearMatcher(path)),
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
 * @returns {Array<AliasItem>} - Returns array of alias items
 */
function getConfigSettings() {
  const packageDir = getPackagePath();
  let fileName = null;

  if (isFileExists(packageDir, FILES.tsconfig)) {
    fileName = FILES.tsconfig;
  }

  if (isFileExists(packageDir, FILES.jsconfig)) {
    fileName = FILES.jsconfig;
  }

  if (fileName === null) {
    return [];
  }

  const urls = [];
  const config = loadJSONFile(packageDir, fileName);
  const createAliasItem = getAliasItemCreator(packageDir);

  if (isPathExists(config, "compilerOptions.paths")) {
    Object.entries(config.compilerOptions.paths).forEach(([key, paths]) =>
      paths.forEach((path) => urls.push(createAliasItem(path, key)))
    );
  }

  if (isPathExists(config, "include")) {
    config.include.forEach((path) => urls.push(createAliasItem(path)));
  }

  if (isPathExists(config, "compilerOptions.baseUrl")) {
    urls.push(createAliasItem(config.compilerOptions.baseUrl));
  }

  return urls;
}

module.exports = {
  getConfigSettings,
};

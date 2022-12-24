"use strict";

const { resolve } = require("path");
const { existsSync } = require("fs");

/**
 * Check is relative path
 * @param {string} path
 * @returns {boolean} - returns true if path is relative
 */
function isRelativeToParent(path) {
  return /^\.\.$|^\.\.[\\/]/.test(path);
}

/**
 * Check is external path
 * @param {string} path
 * @param {string} packagePath
 * @returns {boolean} - returns true if path is external
 */
function isExternalPath(path, packagePath) {
  if (!path) {
    return false;
  }

  const modulesFolder = "node_modules";
  const modulePath = resolve(packagePath, modulesFolder, path);

  return existsSync(modulePath);
}

module.exports = {
  isExternalPath,
  isRelativeToParent,
};

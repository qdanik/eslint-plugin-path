"use strict";

const { resolve, relative } = require("path");
const { existsSync } = require("fs");
const { getPackagePath } = require("./package");

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
 * @returns {boolean} - returns true if path is external
 */
function isExternalPath(path) {
  if (!path) {
    return false;
  }

  const packagePath = getPackagePath();

  if (relative(packagePath, path).startsWith("..")) {
    return true;
  }

  const modulesFolder = "node_modules";
  const modulePath = resolve(packagePath, modulesFolder, path);

  return existsSync(modulePath);
}

module.exports = {
  isExternalPath,
  isRelativeToParent,
};

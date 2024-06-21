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
 * Check if path exists
 * @param {string} path - path to check
 * @returns {boolean} - true if path exists
 */
function isExistingPath(path) {
  return (
    existsSync(path) ||
    existsSync(`${path}.js`) ||
    existsSync(`${path}.ts`) ||
    existsSync(`${path}.jsx`) ||
    existsSync(`${path}.tsx`) ||
    existsSync(`${path}/index.js`) ||
    existsSync(`${path}/index.ts`) ||
    existsSync(`${path}/index.jsx`) ||
    existsSync(`${path}/index.tsx`)
  );
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

  return isExistingPath(modulePath);
}

module.exports = {
  isExternalPath,
  isExistingPath,
  isRelativeToParent,
};

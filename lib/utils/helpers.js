"use strict";

const { join } = require("path");
const { loadTsConfig } = require("load-tsconfig");
const { existsSync } = require("fs");

/**
 * Helps to detect if a path exists or not
 * @param {object} map
 * @param {string} path
 * @returns {boolean} - returns true if path is exists
 */
function isPathExists(map, path) {
  let pathToTarget = map;
  for (let step of path.split(".")) {
    pathToTarget = pathToTarget[step];
    if (pathToTarget === undefined) {
      return false;
    }
  }
  return true;
}

/**
 * Loads and parse json files
 * @param {string} dir
 * @param {string} filename
 * @returns {*}
 */
function loadConfigFile(dir, filename) {
  try {
    const path = join(dir, filename);
    const file = loadTsConfig(path);

    return file;
  } catch (error) {
    throw new Error(`'${filename}' is invalid. Please, validate JSON file.`);
  }
}

/**
 * Helps to check if file exists
 * @param {string} dir
 * @param {string} filename
 * @returns {boolean} - returns true if file is exists
 */
function isFileExists(dir, filename) {
  return existsSync(join(dir, filename));
}

module.exports = {
  isPathExists,
  loadConfigFile,
  isFileExists,
};

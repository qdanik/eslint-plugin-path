"use strict";

const { dirname, join, resolve } = require("path");
const { existsSync } = require("fs");
const { FILES } = require("./constants");

/**
 * Package.json directory finder
 * @returns {string} - path to directory where packages.json is located
 */
function getPackagePath() {
  let dir = resolve(FILES.package);

  do {
    dir = dirname(dir);
  } while (!existsSync(join(dir, FILES.package)) && dir !== "/");

  if (!existsSync(join(dir, FILES.package))) {
    return process?.cwd() || "";
  }

  return dir;
}

module.exports = {
  getPackagePath,
};

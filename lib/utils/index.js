"use strict";

const { dirname, join, normalize } = require("path");

/**
 * @typedef {Object} ImportHandlerParams
 * @property {any} node - context node from eslint
 * @property {string} value - import value
 * @property {string} path - path to import value
 * @property {number} start - star of line where import is declared
 * @property {number} end - end of line where import is declared
 */

/**
 * Params configurator
 * @param {string} filename
 * @param {any} node
 * @param {{value: string; range: [number, number]}} source
 * @returns {ImportHandlerParams}
 */
function configureParams(filename, node, { value, range }) {
  const path = normalize(join(dirname(filename), value));
  const [start, end] = range || [];

  return { node, value, path, start, end };
}

/**
 * ESLint rule handler
 * @param {string} filename
 * @param {(params: ImportHandlerParams) => void} callback
 * @returns {any} eslint rule handler
 */
function getImport(filename, callback) {
  return {
    ImportDeclaration: (node) => {
      callback(configureParams(filename, node, node.source));
    },
    CallExpression: (node) => {
      if (
        node.arguments.length > 0 &&
        node.arguments[0].type === "Literal" &&
        (node.callee.type === "Import" ||
          (node.callee.type === "Identifier" && node.callee.name === "require"))
      ) {
        callback(configureParams(filename, node, node.arguments[0]));
      }
    },
    ImportExpression: (node) => {
      if (node.source.type === "Literal") {
        callback(configureParams(filename, node, node.source));
      }
    },
  };
}

module.exports = {
  getImport,
};

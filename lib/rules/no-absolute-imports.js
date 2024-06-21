"use strict";

const { getImport } = require("../utils");
const { relative, dirname } = require("path");
/**
 * @typedef {import("../utils/config").AliasItem} AliasItem
 */

/**
 * Replace all backslashes (\) with forward slashes (/)
 * @param {string} path
 * @returns {string} - path with forward slashes
 */
function replaceBackSlashesWithForward(path) {
  if (!path) {
    return "";
  }
  return path.replace(/\\/g, "/");
}

/**
 * @typedef {Object} RuleSettings
 */
/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @returns
 */
function noAbsoluteImportCreate(context) {
  return getImport(
    context,
    ({ node, start, value: current, end, path, filename }) => {
      if (current[0] != "/") return;

      let expected = replaceBackSlashesWithForward(
        relative(dirname(filename), path)
      );

      if (!expected.startsWith("../")) {
        expected = "./" + expected;
      }

      const data = {
        current,
        expected,
      };

      /**
       * @param {import('eslint').Rule.RuleFixer} fixer
       * @returns {import('eslint').Rule.Fix}
       */
      const fix = (fixer) =>
        fixer.replaceTextRange([start + 1, end - 1], expected);

      context.report({
        node,
        messageId: "noAbsoluteImports",
        data,
        fix,
        suggest: [
          {
            messageId: "replaceAbsoluteImport",
            data,
            fix,
          },
        ],
      });
    }
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow absolute imports of files where absolute is preferred",
      url: "https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-absolute-imports.md",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [{}],
    messages: {
      noAbsoluteImports:
        "Absolute import path '{{current}}' should be replaced with '{{expected}}'",
      replaceAbsoluteImport:
        "Replace absolute import path '{{current}}' with absolute '{{expected}}'",
    },
  },
  create: noAbsoluteImportCreate,
};

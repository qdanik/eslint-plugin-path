"use strict";

const { getImport } = require("../utils");
const { isRelativeToParent, isExternalPath } = require("../utils/import-types");
const { relative } = require("path");
/**
 * @typedef {import("../utils/config").AliasItem} AliasItem
 */

/**
 * Creates an absolute path to target using an array of alias items
 * @param {string} target
 * @param {Array<AliasItem>} aliases
 * @returns {string} - absolute path import
 */
function getAbsolutePathToTarget(target, aliases = []) {
  if (!target || !aliases) {
    return "";
  }
  const absolutePath = aliases
    .map(({ path, alias }) => `${alias || ""}${relative(path, target)}`)
    .filter((path) => !isRelativeToParent(path) && path.indexOf("..") === -1);

  return (absolutePath && absolutePath[0]) || "";
}

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
function onlyAbsoluteImportsCreate(context) {
  return getImport(
    context,
    ({
      node,
      start,
      value: current,
      end,
      path,
      packagePath,
      configSettings,
    }) => {
      if (isExternalPath(current, packagePath) || !path) {
        return;
      }

      const expected = replaceBackSlashesWithForward(
        getAbsolutePathToTarget(path, configSettings)
      );

      if (current === expected || !expected) {
        return;
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
        messageId: "noRelativeImports",
        data,
        fix,
        suggest: [
          {
            messageId: "replaceRelativeImport",
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
        "disallow relative imports of files where absolute is preferred",
      url: "https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/only-absolute-imports.md",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      noRelativeImports:
        "Relative import path '{{current}}' should be replaced with '{{expected}}'",
      replaceRelativeImport:
        "Replace relative import path '{{current}}' with absolute '{{expected}}'",
    },
  },
  create: onlyAbsoluteImportsCreate,
};

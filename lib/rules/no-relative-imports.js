"use strict";

const { getImport } = require("../utils");
const { isRelativeToParent, isExternalPath } = require("../utils/import-types");
const { relative } = require("path");
/**
 * @typedef {import("../utils/config").AliasItem} AliasItem
 */
const { getConfigSettings } = require("../utils/config");
const { getPackagePath } = require("../utils/package");

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
 * Calculate slash counts
 * @param {string} path
 * @returns {number} - number of slashes
 */
function getSlashCounts(path) {
  if (!path) {
    return 0;
  }

  return (path.split("/").length || 1) - 1;
}

/**
 * Replace all backslashes (\) with forward slashes (/)  
 * @param {string} path
 * @returns {string}
 */
function replaceInvertedSplash(path) {
  if (!path) {
    return "";
  }
  return path.replace(/\\/g, "/");
}

/**
 * Checks if the max path depth has been exceeded
 * @param {string} current
 * @param {RuleSettings} settings
 * @returns
 */
function isMaxDepthExceeded(current, settings) {
  if (!current) {
    return false;
  }
  const result = current.match(/\.\.[\\/]/g) || [];

  return settings.maxDepth < result.length;
}

/**
 * @typedef {Object} RuleSettings
 * @property {number} maxDepth
 * @property {boolean} suggested
 */
/**
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @returns
 */
function noRelativeImportCreate(context) {
  const filename = context.getFilename();
  const { maxDepth = 2, suggested = false } = context.options[0] || {};
  /** @type {RuleSettings} */
  const settings = { maxDepth, suggested };

  const packagePath = getPackagePath(filename);
  const tsconfigSettings = getConfigSettings(packagePath);

  return getImport(filename, ({ node, start, value: current, end, path }) => {
    if (
      !isMaxDepthExceeded(current, settings) ||
      isExternalPath(current, packagePath)
    ) {
      return;
    }

    const expected = replaceInvertedSplash(getAbsolutePathToTarget(path, tsconfigSettings));

    if (
      (settings.suggested &&
        getSlashCounts(current) < getSlashCounts(expected)) ||
      expected === ""
    ) {
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
  });
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow relative imports of files where absolute is preferred",
      url: "https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-relative-imports.md",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        properties: {
          maxDepth: {
            type: "number",
          },
          suggested: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noRelativeImports:
        "Relative import path '{{current}}' should be replaced with '{{expected}}'",
      replaceRelativeImport:
        "Replace relative import path '{{current}}' with absolute '{{expected}}'",
    },
  },
  create: noRelativeImportCreate,
};

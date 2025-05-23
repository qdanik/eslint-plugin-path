import { ReportDescriptor, ReportFixFunction, RuleContext, RuleListener, RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { relative } from "path";

import { getImport } from "../utils";
import { AliasItem } from '../utils/config';
import { isRelativeToParent, isExternalPath } from "../utils/import-types";
import { RuleSettings } from './types';

export type MessageIds = "noRelativeImports" | "replaceRelativeImport";

export type Options = [RuleSettings];

export type Context = Readonly<RuleContext<MessageIds, Options>>;

/**
 * Creates an absolute path to target using an array of alias items
 * @param {string} target
 * @param {AliasItem[]} aliases
 * @returns {string} - absolute path to target
 */
function getAbsolutePathToTarget(target: string, aliases: AliasItem[] = []): string {
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
 * @returns {number} - slash counts
 */
function getSlashCounts(path: string): number {
  if (!path) {
    return 0;
  }

  return (path.split(/[\\/]/).length || 1) - 1;
}

/**
 * Replace all backslashes (\) with forward slashes (/)
 * @param {string} path
 * @returns {string} - path with forward slashes
 */
function replaceBackSlashesWithForward(path: string): string {
  if (!path) {
    return "";
  }
  return path.replace(/\\/g, "/");
}

/**
 * Checks if the max path depth has been exceeded
 * @param {string} current
 * @param {RuleSettings} settings
 * @returns {boolean} - true if max depth exceeded
 */
function isMaxDepthExceeded(current: string, settings: RuleSettings): boolean {
  if (!current) {
    return false;
  }
  const result = current.match(/\.\.[\\/]/g) || [];

  return settings.maxDepth < result.length;
}

/**
 * Rule to disallow relative imports of files where absolute is preferred
 * @param {Context} context
 * @returns
 */
function noRelativeImportCreate(context: Context): RuleListener {
  const { maxDepth = 2, suggested = false } = context.options[0] || {};
  const settings: RuleSettings = { maxDepth, suggested };

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
      if (
        !isMaxDepthExceeded(current, settings) ||
        isExternalPath(current, packagePath)
      ) {
        return;
      }

      const expected = replaceBackSlashesWithForward(
        getAbsolutePathToTarget(path, configSettings)
      );

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

      const fix: ReportFixFunction = (fixer) =>
        fixer.replaceTextRange([start + 1, end - 1], expected);

      const descriptor: ReportDescriptor<MessageIds> = {
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
      };

      context.report(descriptor);
    },
  );
}

const noRelativeImports: RuleModule<MessageIds, Options> = {
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
  defaultOptions: [
    {
      maxDepth: 2,
      suggested: false,
    },
  ],
  create: noRelativeImportCreate,
};

export default noRelativeImports;

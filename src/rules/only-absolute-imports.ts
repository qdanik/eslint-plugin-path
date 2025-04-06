import { Rule } from 'eslint';
import { getImport } from "../utils";
import { isRelativeToParent, isExternalPath } from "../utils/import-types";
import { relative } from "path";
import { AliasItem } from "../utils/config";

/**
 * Creates an absolute path to target using an array of alias items
 * @param target - The target path to convert to absolute
 * @param aliases - An array of alias items for path resolution
 * @returns The absolute path import
 */
function getAbsolutePathToTarget(target: string, aliases: AliasItem[] = []): string {
  if (!target || !aliases.length) {
    return "";
  }
  const absolutePath = aliases
    .map(({ path, alias }) => `${alias || ""}${relative(path, target)}`)
    .filter(path => !isRelativeToParent(path) && !path.includes(".."));

  return absolutePath[0] || "";
}

/**
 * Replace all backslashes (\) with forward slashes (/)
 * @param path - The path to normalize
 * @returns The normalized path with forward slashes
 */
function replaceBackSlashesWithForward(path: string): string {
  if (!path) {
    return "";
  }
  return path.replace(/\\/g, "/");
}

/**
 * ESLint rule for enforcing absolute imports
 * @param context - The rule context
 * @returns Rule listener object
 */
function onlyAbsoluteImportsCreate(context: Rule.RuleContext): Rule.RuleListener {
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
        getAbsolutePathToTarget(path, configSettings[0]?.aliases || [])
      );

      if (current === expected || !expected) {
        return;
      }

      const data = {
        current,
        expected,
      };

      const fix = (fixer: Rule.RuleFixer): Rule.Fix =>
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

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "disallow relative imports of files where absolute is preferred",
      url: "https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/only-absolute-imports.md",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      noRelativeImports: "Relative import path '{{current}}' should be replaced with '{{expected}}'",
      replaceRelativeImport: "Replace relative import path '{{current}}' with absolute '{{expected}}'",
    },
  },
  create: onlyAbsoluteImportsCreate,
};

export default rule;
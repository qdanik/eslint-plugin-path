import { ReportDescriptor, ReportFixFunction, RuleContext, RuleListener, RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { relative } from "path";

import { getImport } from "../utils";
import { isRelativeToParent, isExternalPath } from "../utils/import-types";
import { AliasItem } from "../utils/config";

type MessageIds = "onlyAbsoluteImports" | "replaceOnlyAbsoluteImports";

type Options = [];

type Context = Readonly<RuleContext<MessageIds, Options>>;

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
function onlyAbsoluteImportsCreate(context: Context): RuleListener {
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

      const fix: ReportFixFunction = (fixer) =>
        fixer.replaceTextRange([start + 1, end - 1], expected);

      const descriptor: ReportDescriptor<MessageIds> = {
        node,
        messageId: "onlyAbsoluteImports",
        data,
        fix,
        suggest: [
          {
            messageId: "replaceOnlyAbsoluteImports",
            data,
            fix,
          },
        ],
      };

      context.report(descriptor);
    }
  );
}

const onlyAbsoluteImportRule: RuleModule<MessageIds> = {
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
      onlyAbsoluteImports: "Relative import path '{{current}}' should be replaced with '{{expected}}'",
      replaceOnlyAbsoluteImports: "Replace relative import path '{{current}}' with absolute '{{expected}}'",
    },
  },
  defaultOptions: [],
  create: onlyAbsoluteImportsCreate,
};

export default onlyAbsoluteImportRule;
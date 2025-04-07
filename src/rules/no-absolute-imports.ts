import { ReportDescriptor, ReportFixFunction, RuleContext, RuleListener, RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { relative, dirname } from "path";

import { getImport } from "../utils";

type MessageIds = "noAbsoluteImports" | "replaceAbsoluteImport";

type Options = [];

type Context = Readonly<RuleContext<MessageIds, Options>>;

export const replaceBackSlashesWithForward = (path: string): string => !path ? "" : path.replace(/\\/g, "/");

function noAbsoluteImportCreate(context: Context): RuleListener {
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

      const fix: ReportFixFunction = (fixer) =>
        fixer.replaceTextRange([start + 1, end - 1], expected);

      const descriptor: ReportDescriptor<MessageIds> = {
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
      };

      context.report(descriptor);
    },
  );
}

const noAbsoluteImportsRule: RuleModule<MessageIds> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow absolute imports of files where absolute is preferred",
      url: "https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-absolute-imports.md",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      noAbsoluteImports:
        "Absolute import path '{{current}}' should be replaced with '{{expected}}'",
      replaceAbsoluteImport:
        "Replace absolute import path '{{current}}' with absolute '{{expected}}'",
    },
  },
  defaultOptions: [],
  create: noAbsoluteImportCreate,
};

export default noAbsoluteImportsRule;
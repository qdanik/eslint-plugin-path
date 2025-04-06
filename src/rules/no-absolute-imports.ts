import { Rule } from 'eslint';
import { getImport } from "../utils";
import { relative, dirname } from "path";

export const replaceBackSlashesWithForward = (path: string): string => !path ? "" : path.replace(/\\/g, "/");

function noAbsoluteImportCreate(context: Rule.RuleContext): Rule.RuleListener {
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
  
      const fix = (fixer: Rule.RuleFixer): Rule.Fix =>
        fixer.replaceTextRange([start + 1, end - 1], expected);
  
      const descriptor = {
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
      }
  
      context.report(descriptor);
    },
  );
}

const rule: Rule.RuleModule = {
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

export default rule;
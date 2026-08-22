const { RuleTester } = require('eslint');
const { setupMocks, FILES } = require('./setup');

setupMocks();

const rule = require('../lib/rules/only-absolute-imports').default;

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

const s = (output) => ({ messageId: 'replaceRelativeImport', output });

ruleTester.run('only-absolute-imports', rule, {
  valid: [
    // External package — skipped
    { code: 'import React from "react";', filename: FILES.root },
    // Already absolute (alias)
    { code: 'import x from "@components/button";', filename: FILES.alias },
    // Relative but can't resolve to absolute (no alias match gives "")
    { code: 'import x from "./local";', filename: FILES.root },
    // Already matches the absolute form
    { code: 'import x from "components/button";', filename: FILES.root },
    // Non-existent path — empty configSettings gives empty expected
    { code: 'import x from "../../../nonexistent/module";', filename: FILES.root },
    // No config project — configSettings is empty []; exercises !aliases.length and replaceBackSlashesWithForward("")
    { code: 'import x from "../target";', filename: FILES.noconfig },
    // Re-exports are not inspected — see docs/rules/only-absolute-imports.md "Not checked".
    // The identical specifier IS reported as an import in the invalid cases below, so these
    // pass only because export declarations are never visited.
    { code: 'export * from "../../../components/button";', filename: FILES.root },
    { code: 'export { Button } from "../../../components/button";', filename: FILES.root },
    { code: 'export * as Button from "../../../components/button";', filename: FILES.root },
  ],
  invalid: [
    // Relative import that can be made absolute via baseUrl
    {
      code: 'import x from "../../../components/button";',
      filename: FILES.root,
      output: 'import x from "components/button";',
      errors: [
        { messageId: 'noRelativeImports', suggestions: [s('import x from "components/button";')] },
      ],
    },
    // require() call
    {
      code: 'const x = require("../../../components/button");',
      filename: FILES.root,
      output: 'const x = require("components/button");',
      errors: [
        {
          messageId: 'noRelativeImports',
          suggestions: [s('const x = require("components/button");')],
        },
      ],
    },
    // Dynamic import()
    {
      code: 'const x = import("../../../components/button");',
      filename: FILES.root,
      output: 'const x = import("components/button");',
      errors: [
        {
          messageId: 'noRelativeImports',
          suggestions: [s('const x = import("components/button");')],
        },
      ],
    },
  ],
});

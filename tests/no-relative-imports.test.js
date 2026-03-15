const { RuleTester } = require('eslint');
const { setupMocks, FILES } = require('./setup');

setupMocks();

const rule = require('../lib/rules/no-relative-imports').default;

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

const s = (output) => ({ messageId: 'replaceRelativeImport', output });

ruleTester.run('no-relative-imports', rule, {
  valid: [
    // Shallow relative — within default maxDepth (2)
    { code: 'import x from "../components/button";', filename: FILES.root },
    // Absolute import — not relative, skipped
    { code: 'import x from "@components/button";', filename: FILES.alias },
    // External package
    { code: 'import React from "react";', filename: FILES.root },
    // maxDepth: 3 — exactly 3 levels is within limit (3 < 3 = false)
    {
      code: 'import x from "../../../components/button";',
      filename: FILES.root,
      options: [{ maxDepth: 3 }],
    },
    // suggested: true — skip when absolute path is LONGER than relative
    // ../buttons -> pages/users/buttons (1 slash < 2 slashes)
    {
      code: 'import x from "../buttons";',
      filename: FILES.root,
      options: [{ maxDepth: 0, suggested: true }],
    },
    // Deep relative to non-existent module — path doesn't resolve → expected=''
    {
      code: 'import x from "../../../nonexistent/module";',
      filename: FILES.root,
    },
    // Same with suggested:true (exercises getSlashCounts with empty expected)
    {
      code: 'import x from "../../../missing/thing";',
      filename: FILES.root,
      options: [{ maxDepth: 2, suggested: true }],
    },
    // Empty import string — isMaxDepthExceeded(!current) branch
    { code: 'const x = require("");', filename: FILES.root },
  ],
  invalid: [
    // Default maxDepth (2) — 3 levels of ../ exceeds
    {
      code: 'import x from "../../../components/button";',
      filename: FILES.root,
      output: 'import x from "components/button";',
      errors: [{ messageId: 'noRelativeImports', suggestions: [s('import x from "components/button";')] }],
    },
    // maxDepth: 1 — 3 levels of ../ exceeds
    {
      code: 'import x from "../../../components/button";',
      filename: FILES.root,
      options: [{ maxDepth: 1 }],
      output: 'import x from "components/button";',
      errors: [{ messageId: 'noRelativeImports', suggestions: [s('import x from "components/button";')] }],
    },
    // suggested: true but absolute is shorter — still reports
    {
      code: 'import x from "../../../components/button";',
      filename: FILES.root,
      options: [{ maxDepth: 2, suggested: true }],
      output: 'import x from "components/button";',
      errors: [{ messageId: 'noRelativeImports', suggestions: [s('import x from "components/button";')] }],
    },
    // require() call
    {
      code: 'const x = require("../../../components/button");',
      filename: FILES.root,
      output: 'const x = require("components/button");',
      errors: [{ messageId: 'noRelativeImports', suggestions: [s('const x = require("components/button");')] }],
    },
    // Dynamic import()
    {
      code: 'const x = import("../../../components/button");',
      filename: FILES.root,
      output: 'const x = import("components/button");',
      errors: [{ messageId: 'noRelativeImports', suggestions: [s('const x = import("components/button");')] }],
    },
  ],
});

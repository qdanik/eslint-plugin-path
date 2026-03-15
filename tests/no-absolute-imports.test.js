const { RuleTester } = require('eslint');
const { setupMocks, FILES } = require('./setup');

setupMocks();

const rule = require('../lib/rules/no-absolute-imports').default;

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

const s = (output) => ({ messageId: 'replaceAbsoluteImport', output });

ruleTester.run('no-absolute-imports', rule, {
  valid: [
    // Relative — never flagged
    { code: 'import x from "../../../components/button";', filename: FILES.root },
    // External package — not resolved
    { code: 'import React from "react";', filename: FILES.alias },
    // Scoped external package
    { code: 'import pkg from "@scope/pkg";', filename: FILES.alias },
    // Alias match but file missing — not resolved
    { code: 'import x from "@components/metal/shiny/missing";', filename: FILES.alias },
    // No config project — no tsconfig/jsconfig
    { code: 'import x from "some-import";', filename: FILES.noconfig },
  ],
  invalid: [
    // Rooted import (baseUrl project)
    {
      code: 'import x from "/components/button";',
      filename: FILES.root,
      output: 'import x from "../../../components/button";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "../../../components/button";')] }],
    },
    // Wildcard alias
    {
      code: 'import x from "@components/metal/shiny/shiny-components";',
      filename: FILES.alias,
      output: 'import x from "../../../components/metal/shiny/shiny-components";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "../../../components/metal/shiny/shiny-components";')] }],
    },
    // Exact alias
    {
      code: 'import x from "@exact";',
      filename: FILES.alias,
      output: 'import x from "../../../exact";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "../../../exact";')] }],
    },
    // Multi-target alias (first missing, second found)
    {
      code: 'import x from "@multi/button";',
      filename: FILES.alias,
      output: 'import x from "../../../components/button";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "../../../components/button";')] }],
    },
    // Single-segment alias
    {
      code: 'import x from "@components/button";',
      filename: FILES.alias,
      output: 'import x from "../../../components/button";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "../../../components/button";')] }],
    },
    // BaseUrl import
    {
      code: 'import x from "presentation/presenters/auth";',
      filename: FILES.baseurl,
      output: 'import x from "../../../presentation/presenters/auth";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "../../../presentation/presenters/auth";')] }],
    },
    // require() call
    {
      code: 'const x = require("@components/button");',
      filename: FILES.alias,
      output: 'const x = require("../../../components/button");',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('const x = require("../../../components/button");')] }],
    },
    // Dynamic import()
    {
      code: 'const x = import("@components/button");',
      filename: FILES.alias,
      output: 'const x = import("../../../components/button");',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('const x = import("../../../components/button");')] }],
    },
    // Self-directory import via baseUrl (relative returns '' → ./)
    {
      code: 'import x from "pages/users/details";',
      filename: FILES.root,
      output: 'import x from "./";',
      errors: [{ messageId: 'noAbsoluteImports', suggestions: [s('import x from "./";')] }],
    },
  ],
});

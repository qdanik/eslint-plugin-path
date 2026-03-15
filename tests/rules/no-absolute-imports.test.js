const { RuleTester } = require("eslint");

// ---------------------------------------------------------------------------
// Filesystem mock — no fixtures needed on disk
// ---------------------------------------------------------------------------

jest.mock("fs", () => {
  const actual = jest.requireActual("fs");

  const existing = new Set([
    // Root project (jsconfig + baseUrl)
    "/project/root/package.json",
    "/project/root/jsconfig.json",
    "/project/root/src/components/button.js",
    "/project/root/src/components/index.js",
    // Alias project (tsconfig + paths)
    "/project/alias/package.json",
    "/project/alias/tsconfig.json",
    "/project/alias/src/app/components/metal/shiny/shiny-components.js",
    "/project/alias/src/app/components/button.js",
    "/project/alias/src/app/exact/index.js",
    // BaseUrl-only project (tsconfig with baseUrl, no paths)
    "/project/baseurl/package.json",
    "/project/baseurl/tsconfig.json",
    "/project/baseurl/presentation/presenters/auth.ts",
    "/project/baseurl/presentation/presenters/auth/index.ts",
  ]);

  return {
    ...actual,
    existsSync: jest.fn((p) => {
      if (p.startsWith("/project/")) return existing.has(p);
      return actual.existsSync(p);
    }),
    readFileSync: jest.fn((...args) => {
      if (args[0] === "/project/root/jsconfig.json") {
        return JSON.stringify({ compilerOptions: { baseUrl: "./src" } });
      }
      return actual.readFileSync(...args);
    }),
  };
});

jest.mock("load-tsconfig", () => ({
  loadTsConfig: jest.fn((dir) => {
    if (dir === "/project/baseurl") {
      return {
        data: {
          compilerOptions: {
            baseUrl: ".",
          },
        },
      };
    }
    if (dir === "/project/alias") {
      return {
        data: {
          compilerOptions: {
            paths: {
              "@components/*": ["src/app/components/*"],
              "@exact": ["src/app/exact"],
              "@multi/*": ["src/missing/*", "src/app/components/*"],
            },
          },
        },
      };
    }
    return null;
  }),
}));

// Import rule AFTER mocks are set up
const noAbsoluteImports = require("../../lib/rules/no-absolute-imports").default;

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.afterAll = afterAll;

const rootFile = "/project/root/src/pages/users/details/index.js";
const aliasFile = "/project/alias/src/app/pages/feature/deep/use-alias.js";
const baseurlFile = "/project/baseurl/src/pages/feature/index.ts";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

const suggestion = (output) => ({
  messageId: "replaceAbsoluteImport",
  output,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

ruleTester.run("no-absolute-imports", noAbsoluteImports, {
  valid: [
    // Relative imports — never flagged
    {
      code: 'import button from "../../../components/button";',
      filename: rootFile,
    },
    // External package — not resolved, skipped
    {
      code: 'import pkg from "@scope/pkg";',
      filename: aliasFile,
    },
    // Alias match but file doesn't exist — not resolved, skipped
    {
      code: 'import missing from "@components/metal/shiny/missing";',
      filename: aliasFile,
    },
  ],
  invalid: [
    // Rooted import
    {
      code: 'import button from "/components/button";',
      filename: rootFile,
      output: 'import button from "../../../components/button";',
      errors: [{
        messageId: "noAbsoluteImports",
        suggestions: [suggestion('import button from "../../../components/button";')],
      }],
    },
    // Wildcard alias import
    {
      code: 'import shiny from "@components/metal/shiny/shiny-components";',
      filename: aliasFile,
      output: 'import shiny from "../../../components/metal/shiny/shiny-components";',
      errors: [{
        messageId: "noAbsoluteImports",
        suggestions: [suggestion('import shiny from "../../../components/metal/shiny/shiny-components";')],
      }],
    },
    // Exact alias import
    {
      code: 'import exact from "@exact";',
      filename: aliasFile,
      output: 'import exact from "../../../exact";',
      errors: [{
        messageId: "noAbsoluteImports",
        suggestions: [suggestion('import exact from "../../../exact";')],
      }],
    },
    // Multi-target alias — first target missing, second found
    {
      code: 'import button from "@multi/button";',
      filename: aliasFile,
      output: 'import button from "../../../components/button";',
      errors: [{
        messageId: "noAbsoluteImports",
        suggestions: [suggestion('import button from "../../../components/button";')],
      }],
    },
    // Single-segment alias import
    {
      code: 'import button from "@components/button";',
      filename: aliasFile,
      output: 'import button from "../../../components/button";',
      errors: [{
        messageId: "noAbsoluteImports",
        suggestions: [suggestion('import button from "../../../components/button";')],
      }],
    },
    // BaseUrl import
    {
      code: 'import auth from "presentation/presenters/auth";',
      filename: baseurlFile,
      output: 'import auth from "../../../presentation/presenters/auth";',
      errors: [{
        messageId: "noAbsoluteImports",
        suggestions: [suggestion('import auth from "../../../presentation/presenters/auth";')],
      }],
    },
  ],
});
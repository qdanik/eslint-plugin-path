"use strict";

const noRelativeImports = require("./rules/no-relative-imports");
const noAbsoluteImports = require("./rules/no-absolute-imports");
const onlyAbsoluteImports = require("./rules/only-absolute-imports");

module.exports = {
  rules: {
    "no-relative-imports": noRelativeImports,
    "no-absolute-imports": noAbsoluteImports,
    "only-absolute-imports": onlyAbsoluteImports,
  },
  configs: {
    recommended: {
      plugins: ["path"],
      rules: {
        "path/no-relative-imports": ["error", { maxDepth: 1, suggested: true }],
      },
    },
    all: {
      plugins: ["path"],
      rules: {
        "path/no-relative-imports": [
          "error",
          { maxDepth: 2, suggested: false },
        ],
      },
    },
  },
};

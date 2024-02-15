"use strict";

const noRelativeImport = require("./rules/no-relative-imports");
const noAbsoluteImport = require("./rules/no-absolute-imports");

module.exports = {
  rules: {
    "no-relative-imports": noRelativeImport,
    "no-absolute-imports": noAbsoluteImport,
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

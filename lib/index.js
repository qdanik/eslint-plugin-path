"use strict";

const { noRelativeImport } = require("./rules");

module.exports = {
  rules: {
    "no-relative-imports": noRelativeImport,
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

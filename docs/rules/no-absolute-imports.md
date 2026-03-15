# path/no-absolute-imports

Disallows absolute file imports and replaces them with relative paths.

Any import that resolves to a local file but is not a relative path (`./` or `../`) will be flagged. This includes:

- Rooted imports (`/components/button`)
- tsconfig/jsconfig `paths` aliases (`@components/button`)
- `baseUrl`-resolved imports (`presentation/presenters/auth`)

External packages (e.g. `react`, `lodash`) are not affected since they don't resolve to local files.

**Fixable:** This rule is automatically fixable using the `--fix` command line option.

**Conflicts with eslint-plugin-import/no-absolute-path:**
```
"import/no-absolute-path": "off"
```

## Example

These examples have the following project structure:

```
project
└─── package.json
└─── tsconfig.json
└─── src
    └─── components/
    └─── presentation/
        └─── presenters/
```

`project/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"]
    }
  }
}
```

## Fail

```js
// Rooted import
import foo from "/components/button";

// Alias import
import foo from "@components/button";

// baseUrl import
import foo from "presentation/presenters/auth";
```

## Pass

```js
// Relative import
import foo from "../../components/button";

// External package — not a local file
import React from "react";
```

## Configuration

```json
{
  "rules": {
    "path/no-absolute-imports": "error"
  }
}
```

# path/no-absolute-imports

Disallows the use of absolute file imports. This rule only affects paths included in tsconfig or jsconfig.

**Fixable:** This rule is automatically fixable using the `--fix` command line option.

## Example

These examples have the following project structure:

```
project
└─── package.json
└─── src
    └─── components
    └─── pages
```

`project/jsconfig.json` or `project/tsconfig.json`

```
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

if `compilerOptions.baseUrl` is unset, it will use `project/` = the dirname of `package.json`

## Fail

```js
// inside "project/src/pages/users/details/index.js"
import foo from "/components/button";
```

## Pass

```js
// inside "project/src/components/common/input/index.js"
import foo from "../../components/button";
```

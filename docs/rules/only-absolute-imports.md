# path/only-absolute-imports

This rule requires that all imports must be absolute rather than relative. It only applies to paths specified in tsconfig or jsconfig.

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

The rule resolves absolute forms from `compilerOptions.paths` and `compilerOptions.baseUrl`. If neither is configured — or no `tsconfig.json` / `jsconfig.json` is found next to `package.json` — the rule reports nothing, since there is no absolute form to suggest.


## Fail
  
  ```js
  // inside "project/src/components/button/button.tsx"
  import styles from "./styles";
  ```

  ```js
  // inside "project/src/pages/dashboard/index.ts"
  import { Button } from "../../components";
  ```

## Pass
  
  ```js
  // inside "project/src/components/button/button.tsx"
  import styles from "components/button/styles";
  ```

  ```js
  // inside "project/src/pages/dashboard/index.ts"
  import { Button } from "components";
  ```

## Not checked

Re-export declarations are not inspected by this rule, so these are never reported regardless of configuration:

```js
// inside "project/src/components/button/index.ts"
export * from "./button";
export { Button } from "../../components/button";
```

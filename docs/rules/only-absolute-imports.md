# path/only-absolute-imports

This rule enforces that all imports are absolute and not relative. This rule only affects paths included in tsconfig or jsconfig.

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
  // inside "project/src/components/button/button.tsx"
  import styles from "./styles";
  ```

  ```js
  // inside "project/src/pages/dashboard/index.ts"
  import { Button } from "../../components";
  ```

  ```js
  // inside "project/src/components/button/index.ts"
  export * from "./button";
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

  ```js
  // inside "project/src/components/button/index.ts"
  export * from "./button";
  ```

# path/no-relative-imports

Prohibits the use of relative file imports when absolute imports are preferred. This rule only applies to paths specified in tsconfig or jsconfig.

**Fixable:** This rule is automatically fixable using the `--fix` command line option.

## Example

These examples have the following project structure:

```
project
└─── src
    └─── components
    └─── pages
```

```
project/(jsconfig|tsconfig).json
└─── compilerOptions
    └─── baseUrl = "./src"
or
└─── includes = ["./src"]
```
## Fail

```js
// inside "project/src/pages/users/details/index.js"
import foo from "../../../components/button";

// inside "project/src/components/common/form/select/index.js"
import foo from "../../../components/button";
```

## Pass

```js
// inside "project/src/pages/users/index.js"
import foo from "components/button";

// inside "project/src/components/common/input/index.js"
import foo from "components/button";

// inside "project/src/components/common/input/index.js"
import foo from "../../components/button"; // when maxDepth set to 2
```

## Options

This rule supports the following options:

### `maxDepth: number`:

* default: `2`

Helps manage the maximum depth of relative imports and throws an error if the depth limit is exceeded.

## Fail

```js
// inside "project/src/pages/users/details/index.js"
import foo from "../../../components/button";

// inside "project/src/components/common/form/select/index.js"
import foo from "../../../components/button";
```

## Pass

```js
// inside "project/src/pages/users/index.js"
import foo from "../../components/button";

// inside "project/src/components/common/input/index.js"
import foo from "../../components/button";
```

### `suggested: boolean`:

* default: `false`

Propose a more optimal import path based on the number of slashes ('/'). 
For instance, if your current path is "../../components/button" (with 3 slashes) and the recommended path is "components/button" (with 1 slash), the latter will replace the former as it has fewer slashes and is thus shorter.  

## Fail

```js
// suggested: true
// inside "project/src/pages/users/details/index.js"
import foo from "../../../components/button";

// inside "project/src/components/common/form/select/index.js"
import foo from "../../../components/button";
```

## Pass

```js
// suggested: true & maxDepth: 2
// inside "project/src/pages/users/index.js"
import foo from "components/button";

// inside "project/src/components/common/input/index.js"
import foo from "components/button";
```
# path/no-relative-imports

Disallows the use of relative file imports where absolute is preferred. This rule only affects paths included in tsconfig.

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
project/tsconfig.json
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

Helps handle the max depth of relative import and throw an error if depth is exceeded.

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

Suggest more preferable path for import based on slash count. Slash is '/'.
For example, if you use "../../components/button" (number of slashes 3) and the suggested one is "components/button" (number of slashes 1), it will be replaced by the suggested because 3 > 1 and the last one is shortest.   

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
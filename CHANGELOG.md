# Changelog

All notable changes to this project are documented here.

Versions and dates match the npm publish history. Entries for v1.0.0, v2.0.0, v2.0.2, v2.0.3, v2.1.0 and v2.1.1 come from their [GitHub releases]; the rest were reconstructed from the commit history, as those versions shipped without release notes. Pre-releases (`-rc`, `-beta`) are omitted.

## [Unreleased]

## [3.0.0] - 2026-08-22

### Removed

- **BREAKING:** the `all` preset. It never enabled all rules — it enabled only `no-relative-imports`, with weaker settings than `recommended`. The three rules express mutually exclusive policies, so no single config can enable them together. `recommended` is now the only preset; configure the other rules explicitly.
- **BREAKING:** `@typescript-eslint/utils` and `@typescript-eslint/types` are no longer runtime dependencies. The plugin is typed with ESLint's own `ESLint.Plugin`, leaving `load-tsconfig` as the only runtime dependency. If you referenced `TSESLint.FlatConfig.Plugin` from this package's types, use `ESLint.Plugin` from `eslint` instead.

### Changed

- **BREAKING:** requires ESLint >= 10. The legacy `.eslintrc` format was removed in ESLint 10; use flat config (`eslint.config.js`).
- **BREAKING:** requires Node.js `^20.19.0 || ^22.13.0 || >=24`, matching ESLint 10's own supported range. The previous `>=20.19.0` wrongly advertised support for Node 21, 22.0–22.12 and 23, where ESLint 10 cannot be installed.
- **BREAKING:** added an `exports` field. Deep imports such as `require('eslint-plugin-path/lib/rules/no-relative-imports')` are no longer resolvable; only the package root and `./package.json` are exposed.
- `src/` is now published, so the shipped `.d.ts.map` files resolve and "Go to definition" works for consumers.

### Fixed

- `npm run test:coverage` failed the 100% line/statement threshold. An unreachable guard in `isMaxDepthExceeded` — dead since the `isRelativePath` short-circuit was introduced in 2.1.1 — has been removed, restoring the gate.
- `typeRoots` in `tsconfig.json` listed a `.d.ts` file where TypeScript expects directories.
- Added the `types` field to `package.json`, so type resolution no longer relies on the "declaration adjacent to `main`" fallback.

### Documentation

- The `all` preset was documented as "enables all rules", which it never did.
- `only-absolute-imports` listed `export * from "./button"` under both Fail and Pass. Re-export declarations are not inspected by any rule; every rule doc now says so under "Not checked", the README gained a "What is checked" section, and the behaviour is locked down by regression tests.
- `only-absolute-imports` claimed that an unset `compilerOptions.baseUrl` falls back to the `package.json` directory. It does not — with neither `paths` nor `baseUrl` configured, the rule reports nothing.
- Documented the exact supported Node.js range, and that `recommended` (`maxDepth: 1`, `suggested: true`) is stricter than the rule's own defaults (`maxDepth: 2`, `suggested: false`).

### Dependencies

- `eslint` 10.0.3 → 10.9.0 (dev; the peer range stays `>=10.0.0`)
- `@biomejs/biome` 2.4.7 → 2.5.10
- `@types/estree` 1.0.8 → 1.0.9
- `jest` 30.3.0 → 30.4.2
- `@types/node` pinned to `^20.19.0` to match the minimum supported Node.js version
- Removed unused `@typescript-eslint/rule-tester` (tests use ESLint's own `RuleTester`) and `@types/eslint` (ESLint 10 ships its own type definitions)

### Security

- Resolved all 5 advisories reported by `npm audit` (`flatted`, `js-yaml`, `picomatch`, `brace-expansion`). All were dev-only transitive dependencies and never reached consumers of the published package. `npm audit` now reports 0 vulnerabilities.

## [2.1.1] - 2026-08-21

### Fixed

- `no-relative-imports` no longer reports non-relative imports ([#24], [#25]).

### New contributors

- [@kAIPraxisBot] made their first contribution in [#25].

## [2.1.0] - 2026-03-15

### Added

- `no-absolute-imports` gained alias support and a `maxDepth` option.
- Comprehensive test suite for the import rules and utilities.
- Biome configuration for linting and formatting.

Released as "Small code improvements" ([#22]).

## [2.0.3] - 2025-05-23

### Fixed

- Incorrect passing of `load-tsconfig` arguments.

## [2.0.2] - 2025-04-07

### Added

- Ability to configure the config path per environment via ESLint `settings`:

  ```json
  {
    "settings": {
      "path": {
        "config": "tsconfig.json"
      }
    }
  }
  ```

### Changed

- Improved performance by caching config files during the lint process.

> v2.0.1 was never published to npm.

## [2.0.0] - 2025-04-06

### Added

- Support for ESLint 9+ and the flat config format ([#15]).

### Changed

- Improved performance, security and maintainability.

## [1.3.0] - 2024-02-27

### Added

- New `no-absolute-imports` rule ([#12]).

## [1.2.4] - 2024-01-10

### Fixed

- Absolute path handling in `tsconfig` ([#11]).

## [1.2.3] - 2023-12-15

### Fixed

- Backslashes are replaced with forward slashes in suggested paths ([#9]).

## [1.2.2] - 2023-08-04

Published the same day as 1.2.1; no separate changes are recorded in the commit history.

## [1.2.1] - 2023-08-04

### Fixed

- Wrong paths to the config properties, which made `--fix` replace a relative path with an empty string ([#5], [#6]).

## [1.2.0] - 2023-07-05

### Added

- Ability to load any `tsconfig` file, supporting the complete tsconfig specification ([#3], [#4]).

## [1.1.3] - 2022-12-24

### Changed

- Improved resolution of the path to `package.json` and of the suggested path.

## [1.1.2] - 2022-12-13

### Fixed

- Wrong path suggestion when multiple aliases matched.

## [1.1.1] - 2022-12-12

### Fixed

- Use `process.cwd()` for IDE auto-runners.

## [1.1.0] - 2022-12-11

### Added

- Support for the `jsconfig.json` file ([#2]).

## [1.0.1] - 2022-04-14

### Changed

- Fixed the rules folder structure.

## [1.0.0] - 2022-04-11

### Added

- New [`no-relative-imports`] rule (fixable), disallowing relative file imports where absolute is preferred ([#1]).
- This CHANGELOG file.

[GitHub releases]: https://github.com/qDanik/eslint-plugin-path/releases
[`no-relative-imports`]: https://github.com/qDanik/eslint-plugin-path/blob/main/docs/rules/no-relative-imports.md
[@kAIPraxisBot]: https://github.com/kAIPraxisBot

[#1]: https://github.com/qDanik/eslint-plugin-path/pull/1
[#2]: https://github.com/qDanik/eslint-plugin-path/pull/2
[#3]: https://github.com/qDanik/eslint-plugin-path/issues/3
[#4]: https://github.com/qDanik/eslint-plugin-path/pull/4
[#5]: https://github.com/qDanik/eslint-plugin-path/issues/5
[#6]: https://github.com/qDanik/eslint-plugin-path/pull/6
[#9]: https://github.com/qDanik/eslint-plugin-path/pull/9
[#11]: https://github.com/qDanik/eslint-plugin-path/pull/11
[#12]: https://github.com/qDanik/eslint-plugin-path/pull/12
[#15]: https://github.com/qDanik/eslint-plugin-path/pull/15
[#22]: https://github.com/qDanik/eslint-plugin-path/pull/22
[#24]: https://github.com/qDanik/eslint-plugin-path/issues/24
[#25]: https://github.com/qDanik/eslint-plugin-path/pull/25

[Unreleased]: https://github.com/qDanik/eslint-plugin-path/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/qDanik/eslint-plugin-path/compare/v2.1.1...v3.0.0
[2.1.1]: https://github.com/qDanik/eslint-plugin-path/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/qDanik/eslint-plugin-path/compare/v2.0.3...v2.1.0
[2.0.3]: https://github.com/qDanik/eslint-plugin-path/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/qDanik/eslint-plugin-path/compare/v2.0.0...v2.0.2
[2.0.0]: https://github.com/qDanik/eslint-plugin-path/compare/v1.0.0...v2.0.0
[1.3.0]: https://www.npmjs.com/package/eslint-plugin-path/v/1.3.0
[1.2.4]: https://www.npmjs.com/package/eslint-plugin-path/v/1.2.4
[1.2.3]: https://www.npmjs.com/package/eslint-plugin-path/v/1.2.3
[1.2.2]: https://www.npmjs.com/package/eslint-plugin-path/v/1.2.2
[1.2.1]: https://www.npmjs.com/package/eslint-plugin-path/v/1.2.1
[1.2.0]: https://www.npmjs.com/package/eslint-plugin-path/v/1.2.0
[1.1.3]: https://www.npmjs.com/package/eslint-plugin-path/v/1.1.3
[1.1.2]: https://www.npmjs.com/package/eslint-plugin-path/v/1.1.2
[1.1.1]: https://www.npmjs.com/package/eslint-plugin-path/v/1.1.1
[1.1.0]: https://www.npmjs.com/package/eslint-plugin-path/v/1.1.0
[1.0.1]: https://www.npmjs.com/package/eslint-plugin-path/v/1.0.1
[1.0.0]: https://github.com/qDanik/eslint-plugin-path/releases/tag/v1.0.0

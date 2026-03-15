const { setupMocks, FILES } = require('./setup');

setupMocks();

const { RuleTester } = require('eslint');
const rule = require('../lib/rules/no-absolute-imports').default;

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

describe('utils/index edge cases', () => {
  // getImport with empty filename returns {} (no listeners)
  it('returns empty object for empty filename', () => {
    const { getImport } = require('../lib/utils/index');
    const callback = jest.fn();
    const context = {
      filename: '',
      settings: {},
    };
    const result = getImport(context, callback);
    expect(result).toEqual({});
    expect(callback).not.toHaveBeenCalled();
  });

  // CallExpression that is not require/import (should not trigger callback)
  ruleTester.run('utils-index-call-expression-skip', rule, {
    valid: [
      // Regular function call with literal arg — not require/import, skipped
      { code: 'const x = someFunction("@components/button");', filename: FILES.alias },
      // require with no arguments
      { code: 'const x = require();', filename: FILES.alias },
      // require with non-literal argument
      { code: 'const x = require(variable);', filename: FILES.alias },
    ],
    invalid: [],
  });
});

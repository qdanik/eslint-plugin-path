const { rules } = require('../lib/rules/index');

describe('rules/index', () => {
  it('exports all three rules', () => {
    expect(rules.noRelativeImports).toBeDefined();
    expect(rules.noAbsoluteImports).toBeDefined();
    expect(rules.onlyAbsoluteImports).toBeDefined();
  });

  it('each rule has meta and create', () => {
    for (const rule of Object.values(rules)) {
      expect(rule.meta).toBeDefined();
      expect(rule.create).toBeInstanceOf(Function);
    }
  });
});

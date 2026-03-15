const plugin = require('../lib/index');

describe('eslint-plugin-path', () => {
  it('exports rules', () => {
    expect(plugin.rules).toBeDefined();
    expect(plugin.rules?.['no-relative-imports']).toBeDefined();
    expect(plugin.rules?.['no-absolute-imports']).toBeDefined();
    expect(plugin.rules?.['only-absolute-imports']).toBeDefined();
  });

  it('exports meta', () => {
    expect(plugin.meta?.name).toBe('eslint-plugin-path');
    expect(plugin.meta?.version).toBeDefined();
  });

  it('exports configs', () => {
    expect(plugin.configs?.recommended).toBeDefined();
    expect(Array.isArray(plugin.configs?.recommended)).toBe(true);
    expect(plugin.configs?.recommended?.[0]?.rules?.['path/no-relative-imports']).toBeDefined();
    expect(plugin.configs?.all).toBeDefined();
    expect(Array.isArray(plugin.configs?.all)).toBe(true);
    expect(plugin.configs?.all?.[0]?.rules?.['path/no-relative-imports']).toBeDefined();
  });
});

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

  it('exports the recommended preset', () => {
    expect(plugin.configs?.recommended).toBeDefined();
    expect(Array.isArray(plugin.configs?.recommended)).toBe(true);
    expect(plugin.configs?.recommended?.[0]?.rules?.['path/no-relative-imports']).toEqual([
      'error',
      { maxDepth: 1, suggested: true },
    ]);
  });

  // Removed in 3.0.0: `all` never enabled all rules — it enabled only
  // no-relative-imports, with weaker settings than `recommended`. The three rules
  // contradict each other, so no preset can enable them together.
  it('no longer exports an "all" preset', () => {
    expect(plugin.configs?.all).toBeUndefined();
    expect(Object.keys(plugin.configs ?? {})).toEqual(['recommended']);
  });
});

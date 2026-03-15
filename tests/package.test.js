jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');
  return {
    ...actual,
    existsSync: jest.fn((p) => {
      if (typeof p === 'string' && p.startsWith('/mock/')) return MOCK_FILES.has(p);
      return actual.existsSync(p);
    }),
  };
});

const MOCK_FILES = new Set([
  '/mock/project/package.json',
  '/mock/project/src/deep/file.js',
]);

const { getPackagePath } = require('../lib/utils/package');

describe('package', () => {
  describe('getPackagePath', () => {
    it('finds package.json walking up from file path', () => {
      expect(getPackagePath('/mock/project/src/deep/file.js')).toBe('/mock/project');
    });

    it('falls back to cwd when no package.json found', () => {
      expect(getPackagePath('/mock/no-project/src/file.js')).toBe(process.cwd());
    });

    it('handles empty filePath', () => {
      const result = getPackagePath('');
      expect(typeof result).toBe('string');
    });
  });
});

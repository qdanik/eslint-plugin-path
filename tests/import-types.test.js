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
  '/mock/src/button.js',
  '/mock/src/button.ts',
  '/mock/src/utils/index.js',
  '/mock/project/node_modules/react/index.js',
]);

const { isRelativeToParent, isExistingPath, isExternalPath } = require('../lib/utils/import-types');

describe('import-types', () => {
  describe('isRelativeToParent', () => {
    it('returns true for ../', () => {
      expect(isRelativeToParent('../foo')).toBe(true);
    });

    it('returns true for bare ..', () => {
      expect(isRelativeToParent('..')).toBe(true);
    });

    it('returns true for ..\\', () => {
      expect(isRelativeToParent('..\\foo')).toBe(true);
    });

    it('returns false for ./', () => {
      expect(isRelativeToParent('./foo')).toBe(false);
    });

    it('returns false for absolute path', () => {
      expect(isRelativeToParent('components/button')).toBe(false);
    });
  });

  describe('isExistingPath', () => {
    it('returns true for exact path', () => {
      expect(isExistingPath('/mock/src/button.js')).toBe(true);
    });

    it('returns true when path+extension exists', () => {
      expect(isExistingPath('/mock/src/button')).toBe(true);
    });

    it('returns true when path/index+extension exists', () => {
      expect(isExistingPath('/mock/src/utils')).toBe(true);
    });

    it('returns false when nothing matches', () => {
      expect(isExistingPath('/mock/src/missing')).toBe(false);
    });
  });

  describe('isExternalPath', () => {
    it('returns false for empty path', () => {
      expect(isExternalPath('', '/mock/project')).toBe(false);
    });

    it('returns true for installed package', () => {
      expect(isExternalPath('react', '/mock/project')).toBe(true);
    });

    it('returns false for non-installed package', () => {
      expect(isExternalPath('nonexistent-pkg', '/mock/project')).toBe(false);
    });
  });
});

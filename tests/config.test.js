jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');
  return {
    ...actual,
    existsSync: jest.fn((p) => {
      if (typeof p === 'string' && p.startsWith('/mock/')) return MOCK_FILES.has(p);
      return actual.existsSync(p);
    }),
    readFileSync: jest.fn((...args) => {
      if (args[0] === '/mock/js-project/jsconfig.json') {
        return JSON.stringify({ compilerOptions: { baseUrl: './src' } });
      }
      if (args[0] === '/mock/custom-project/myconfig.json') {
        return JSON.stringify({ compilerOptions: { baseUrl: './lib' } });
      }
      return actual.readFileSync(...args);
    }),
  };
});

jest.mock('load-tsconfig', () => ({
  loadTsConfig: jest.fn((dir, filename) => {
    if (dir === '/mock/ts-project') {
      return {
        data: {
          compilerOptions: {
            baseUrl: '.',
            paths: { '@app/*': ['src/*'], '@exact': ['src/exact'] },
          },
        },
      };
    }
    if (dir === '/mock/custom-project' && filename === 'myconfig.json') {
      return {
        data: {
          compilerOptions: { baseUrl: './lib' },
        },
      };
    }
    return null;
  }),
}));

const MOCK_FILES = new Set([
  '/mock/ts-project/package.json',
  '/mock/ts-project/tsconfig.json',
  '/mock/js-project/package.json',
  '/mock/js-project/jsconfig.json',
  '/mock/custom-project/package.json',
  '/mock/custom-project/myconfig.json',
  '/mock/empty-project/package.json',
]);

const { clearMatcher, getAliasItemCreator, getConfigSettings } = require('../lib/utils/config');

describe('config', () => {
  describe('clearMatcher', () => {
    it('removes * from value', () => {
      expect(clearMatcher('src/*')).toBe('src/');
    });

    it('returns value unchanged when no *', () => {
      expect(clearMatcher('src/exact')).toBe('src/exact');
    });
  });

  describe('getAliasItemCreator', () => {
    it('creates alias item with relative path', () => {
      const create = getAliasItemCreator('/mock/project');
      const item = create('src/components/*', '@components/*');
      expect(item).toEqual({
        path: '/mock/project/src/components/',
        alias: '@components/',
        isWildcard: true,
      });
    });

    it('creates alias item with absolute path', () => {
      const create = getAliasItemCreator('/mock/project');
      const item = create('/absolute/path/*', '@abs/*');
      expect(item).toEqual({
        path: '/absolute/path/',
        alias: '@abs/',
        isWildcard: true,
      });
    });

    it('creates alias item with exact match (no wildcard)', () => {
      const create = getAliasItemCreator('/mock/project');
      const item = create('src/exact', '@exact');
      expect(item).toEqual({
        path: '/mock/project/src/exact',
        alias: '@exact',
        isWildcard: false,
      });
    });

    it('creates baseUrl item (null alias)', () => {
      const create = getAliasItemCreator('/mock/project');
      const item = create('./src');
      expect(item).toEqual({
        path: '/mock/project/src',
        alias: null,
        isWildcard: false,
      });
    });
  });

  describe('getConfigSettings', () => {
    it('loads tsconfig with paths and baseUrl', () => {
      const result = getConfigSettings('/mock/ts-project', {});
      expect(result.length).toBeGreaterThan(0);
      const wildcard = result.find((r) => r.isWildcard);
      expect(wildcard).toBeTruthy();
      expect(wildcard.alias).toBe('@app/');
    });

    it('loads jsconfig with baseUrl', () => {
      const result = getConfigSettings('/mock/js-project', {});
      expect(result).toEqual([{ path: '/mock/js-project/src', alias: null, isWildcard: false }]);
    });

    it('returns cached result on second call', () => {
      const first = getConfigSettings('/mock/js-project', {});
      const second = getConfigSettings('/mock/js-project', {});
      expect(first).toBe(second);
    });

    it('loads custom config from settings', () => {
      const result = getConfigSettings('/mock/custom-project', { config: 'myconfig.json' });
      expect(result).toEqual([
        { path: '/mock/custom-project/lib', alias: null, isWildcard: false },
      ]);
    });

    it('returns empty array when no config file found', () => {
      const result = getConfigSettings('/mock/empty-project', {});
      expect(result).toEqual([]);
    });
  });
});

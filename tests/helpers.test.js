jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');
  return {
    ...actual,
    existsSync: jest.fn((p) => {
      if (typeof p === 'string' && p.startsWith('/mock/')) return MOCK_FILES.has(p);
      return actual.existsSync(p);
    }),
    readFileSync: jest.fn((...args) => {
      if (MOCK_READ[args[0]]) return MOCK_READ[args[0]];
      return actual.readFileSync(...args);
    }),
  };
});

jest.mock('load-tsconfig', () => ({
  loadTsConfig: jest.fn((dir) => {
    if (dir === '/mock/ts-project') {
      return {
        data: {
          compilerOptions: {
            baseUrl: '.',
            paths: { '@app/*': ['src/*'] },
          },
        },
      };
    }
    if (dir === '/mock/ts-noconfig') return null;
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
]);

const MOCK_READ = {
  '/mock/js-project/jsconfig.json': JSON.stringify({
    compilerOptions: { baseUrl: './src' },
  }),
  '/mock/custom-project/myconfig.json': JSON.stringify({
    compilerOptions: { baseUrl: './lib' },
  }),
};

const { isPathExists, loadConfigFile, isFileExists } = require('../lib/utils/helpers');

describe('helpers', () => {
  describe('isPathExists', () => {
    it('returns true for existing nested path', () => {
      expect(isPathExists({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(true);
    });

    it('returns false for missing path', () => {
      expect(isPathExists({ a: {} }, 'a.b.c')).toBe(false);
    });

    it('returns false for null map segment', () => {
      expect(isPathExists({ a: null }, 'a.b')).toBe(false);
    });

    it('returns true for top-level key', () => {
      expect(isPathExists({ x: 42 }, 'x')).toBe(true);
    });
  });

  describe('loadConfigFile', () => {
    it('loads jsconfig.json via readFileSync', () => {
      const result = loadConfigFile('/mock/js-project', 'jsconfig.json');
      expect(result).toEqual({ data: { compilerOptions: { baseUrl: './src' } } });
    });

    it('loads tsconfig.json via loadTsConfig', () => {
      const result = loadConfigFile('/mock/ts-project', 'tsconfig.json');
      expect(result).toEqual({
        data: {
          compilerOptions: {
            baseUrl: '.',
            paths: { '@app/*': ['src/*'] },
          },
        },
      });
    });

    it('throws on invalid config file', () => {
      const { readFileSync } = require('node:fs');
      readFileSync.mockImplementationOnce(() => {
        throw new SyntaxError('Unexpected token');
      });
      expect(() => loadConfigFile('/mock/js-project', 'jsconfig.json')).toThrow(
        "'jsconfig.json' is invalid",
      );
    });
  });

  describe('isFileExists', () => {
    it('returns true when file exists', () => {
      expect(isFileExists('/mock/ts-project', 'tsconfig.json')).toBe(true);
    });

    it('returns false when file does not exist', () => {
      expect(isFileExists('/mock/ts-project', 'jsconfig.json')).toBe(false);
    });
  });
});

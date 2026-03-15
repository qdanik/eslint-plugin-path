/**
 * Shared virtual filesystem and tsconfig mock for all rule tests.
 *
 * Projects:
 *   /project/root     — jsconfig with baseUrl: "./src"
 *   /project/alias    — tsconfig with paths (@components/*, @exact, @multi/*)
 *   /project/baseurl  — tsconfig with baseUrl: "." only
 */

const mockExistingFiles = new Set([
  // Root project (jsconfig + baseUrl)
  '/project/root/package.json',
  '/project/root/jsconfig.json',
  '/project/root/src/components/button.js',
  '/project/root/src/components/index.js',
  '/project/root/src/pages/users/details/index.js',
  // Alias project (tsconfig + paths)
  '/project/alias/package.json',
  '/project/alias/tsconfig.json',
  '/project/alias/src/app/components/metal/shiny/shiny-components.js',
  '/project/alias/src/app/components/button.js',
  '/project/alias/src/app/exact/index.js',
  '/project/alias/src/app/pages/feature/deep/use-alias.js',
  // Sibling directory (for suggested:true test — absolute is longer than relative)
  '/project/root/src/pages/users/buttons/index.js',
  // BaseUrl-only project (tsconfig with baseUrl, no paths)
  '/project/baseurl/package.json',
  '/project/baseurl/tsconfig.json',
  '/project/baseurl/presentation/presenters/auth.ts',
  '/project/baseurl/presentation/presenters/auth/index.ts',
  // No-config project (no tsconfig/jsconfig — configSettings = [])
  '/project/noconfig/package.json',
  '/project/noconfig/src/sub/file.js',
  '/project/noconfig/src/target.js',
]);

const mockJsconfigContent = JSON.stringify({ compilerOptions: { baseUrl: './src' } });

function setupMocks() {
  jest.mock('node:fs', () => {
    const actual = jest.requireActual('node:fs');
    return {
      ...actual,
      existsSync: jest.fn((p) => {
        if (typeof p === 'string' && p.startsWith('/project/')) return mockExistingFiles.has(p);
        return actual.existsSync(p);
      }),
      readFileSync: jest.fn((...args) => {
        if (args[0] === '/project/root/jsconfig.json') return mockJsconfigContent;
        return actual.readFileSync(...args);
      }),
    };
  });

  jest.mock('load-tsconfig', () => ({
    loadTsConfig: jest.fn((dir) => {
      if (dir === '/project/baseurl') {
        return { data: { compilerOptions: { baseUrl: '.' } } };
      }
      if (dir === '/project/alias') {
        return {
          data: {
            compilerOptions: {
              paths: {
                '@components/*': ['src/app/components/*'],
                '@exact': ['src/app/exact'],
                '@multi/*': ['src/missing/*', 'src/app/components/*'],
              },
            },
          },
        };
      }
      return null;
    }),
  }));
}

// File paths used across tests
const FILES = {
  root: '/project/root/src/pages/users/details/index.js',
  alias: '/project/alias/src/app/pages/feature/deep/use-alias.js',
  baseurl: '/project/baseurl/src/pages/feature/index.ts',
  noconfig: '/project/noconfig/src/sub/file.js',
};

module.exports = { setupMocks, FILES, EXISTING_FILES: mockExistingFiles };

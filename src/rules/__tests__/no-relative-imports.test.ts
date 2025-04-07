import { RuleTester } from '@typescript-eslint/rule-tester';
import noRelativeImports from '../no-relative-imports';

const ruleTester = new RuleTester();

ruleTester.run('no-relative-imports', noRelativeImports, {
  valid: [
    {
      code: `import something from 'absolute/path';`,
      filename: '/project/src/file.ts',
    },
    {
      code: `import something from '@alias/path';`,
      filename: '/project/src/file.ts',
    },
    {
      code: `import something from './local/path';`,
      filename: '/project/src/file.ts',
      options: [{ maxDepth: 3, suggested: true }],
    },
    {
      code: `import something from '../parent/path';`,
      filename: '/project/src/file.ts',
      options: [{ maxDepth: 2, suggested: true }],
    },
  ],
  invalid: [
    {
      code: `import something from '../../too/deep/path';`,
      filename: '/project/src/file.ts',
      options: [{ maxDepth: 2, suggested: true }],
      errors: [
        {
          messageId: 'noRelativeImports',
          data: {
            current: '../../too/deep/path',
            expected: 'absolute/path/to/too/deep/path',
          },
        },
      ],
      output: `import something from 'absolute/path/to/too/deep/path';`,
    },
    {
      code: `import something from '../relative/path';`,
      filename: '/project/src/file.ts',
      options: [{ maxDepth: 1, suggested: true }],
      errors: [
        {
          messageId: 'noRelativeImports',
          data: {
            current: '../relative/path',
            expected: 'absolute/path/to/relative/path',
          },
        },
      ],
      output: `import something from 'absolute/path/to/relative/path';`,
    },
  ],
});
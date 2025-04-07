import { RuleTester } from '@typescript-eslint/rule-tester';
import onlyAbsoluteImportRule from '../only-absolute-imports';

const ruleTester = new RuleTester();

ruleTester.run('only-absolute-imports', onlyAbsoluteImportRule, {
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
      code: `import something from 'external-package';`,
      filename: '/project/src/file.ts',
    },
  ],
  invalid: [
    {
      code: `import something from './relative/path';`,
      filename: '/project/src/file.ts',
      errors: [
        {
          messageId: 'onlyAbsoluteImports',
          data: {
            current: './relative/path',
            expected: 'absolute/path/to/relative/path',
          },
        },
      ],
      output: `import something from 'absolute/path/to/relative/path';`,
    },
    {
      code: `import something from '../parent/path';`,
      filename: '/project/src/file.ts',
      errors: [
        {
          messageId: 'onlyAbsoluteImports',
          data: {
            current: '../parent/path',
            expected: 'absolute/path/to/parent/path',
          },
        },
      ],
      output: `import something from 'absolute/path/to/parent/path';`,
    },
  ],
});
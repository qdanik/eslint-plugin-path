import { RuleTester } from '@typescript-eslint/rule-tester';
import noAbsoluteImportsRule from '../no-absolute-imports';

const ruleTester = new RuleTester();

ruleTester.run('no-absolute-imports', noAbsoluteImportsRule, {
	valid: [
		{
			code: `import something from './relative/path';`,
			filename: '/project/src/file.ts',
		},
		{
			code: `import something from '../parent/path';`,
			filename: '/project/src/file.ts',
		},
		{
			code: `import something from 'external-package';`,
			filename: '/project/src/file.ts',
		},
	],
	invalid: [
		{
			code: `import something from 'absolute/path';`,
			filename: '/project/src/file.ts',
			errors: [
				{
					messageId: 'noAbsoluteImports',
					data: {
						current: '/absolute/path',
						expected: './relative/path',
					},
				},
			],
			output: `import something from './relative/path';`,
		},
		{
			code: `import something from '/another/absolute/path';`,
			filename: '/project/src/file.ts',
			errors: [
				{
					messageId: 'noAbsoluteImports',
					data: {
						current: '/another/absolute/path',
						expected: '../another/relative/path',
					},
				},
			],
			output: `import something from '../another/relative/path';`,
		},
	],
});
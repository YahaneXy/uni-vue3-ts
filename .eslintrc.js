module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/base',
		'plugin:vue/vue3-essential',
		'plugin:vue/vue3-recommended',
		'plugin:vue/vue3-strongly-recommended',
		'standard-with-typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.eslint.json'],
		extraFileExtensions: ['.vue'],
	},
	ignorePatterns: ['.eslintrc.js', 'vite.config.ts', 'components.d.ts'],
	// overrides: [
	// 	{
	// 		files: ['vite.config.ts', '.eslintrc.js'],
	// 		parserOptions: {
	// 			parser: '@typescript-eslint/parser',
	// 			project: './tsconfig.json',
	// 		},
	// 	},
	// ],
	globals: {
		uni: false,
		WechatMiniprogram: false,
		getCurrentPages: false,
		CustomInterface: false,
	},
	plugins: ['vue', '@typescript-eslint', 'simple-import-sort'],
	rules: {
		'@typescript-eslint/consistent-type-imports': 'error', // 导入的类型如果仅仅是类型，不使用import type则会报错
		'no-undef': 0, //https://github.com/unplugin/unplugin-auto-import:当使用TypeScript时，我们建议直接禁用 no-undef 规则，因为TypeScript已经检查过它们了，你不需要担心这一点
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off', //要求加法的两个操作数都是相同的类型，并且是 bigint 、 number 或 string
		'@typescript-eslint/prefer-nullish-coalescing': 'off', // 允许使用||而不是强制要求??
		'@typescript-eslint/promise-function-async': 'off',
		'prefer-promise-reject-errors': 'off', // 不要求reject使用Error类型
		'@typescript-eslint/no-floating-promises': 'off', // 不要求promise一定要await
		'@typescript-eslint/strict-boolean-expressions': 'off', // 允许直接使用if(!xx)
		'@typescript-eslint/explicit-function-return-type': 'off', // 不要求写明返回值
		'@typescript-eslint/consistent-indexed-object-style': 'off', // 允许使用  [key: string]: unknown，而不是只限制Record<T,K>
		'@typescript-eslint/dot-notation': 'off',
		'vue/no-v-text-v-html-on-component': 0,
		'vue/no-v-html': 0,
		// 'no-duplicate-imports': 'error', // 禁止重复导入
		'vue/multi-word-component-names': 'off', // 取消该项，否则template报错
		'vue/require-default-prop': 'off', // 取消组件要求默认值
		quotes: ['error', 'single'],
		// 允许使用局部变量接收this
		'@typescript-eslint/no-this-alias': ['off'],
		// 允许使用显式的any
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/no-non-null-assertion': ['off'],
		'simple-import-sort/imports': 'error', // 插件，导包顺序
		'simple-import-sort/exports': 'error',
		'vue/attributes-order': 'error', // 设置vue标签的循序（v-if，v-model等）
		'vue/component-name-in-template-casing': [
			// 要求引用组件时使用kebab-case
			'error',
			'kebab-case',
			{
				registeredComponentsOnly: false,
			},
		],
		'prefer-const': [
			// 没有改变的变量要用const声明
			'error',
			{
				// 如果解构中的任何变量应该是const，则此规则会对这些变量发出警告。
				destructuring: 'any',
				ignoreReadBeforeAssign: false,
			},
		],
		'@typescript-eslint/ban-ts-comment': 'off', // 允许ts-ignore
	},
};

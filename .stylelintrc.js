module.exports = {
	extends: [
		'stylelint-config-standard',
		/* 'stylelint-config-standard-scss', */ 'stylelint-config-prettier',
		'stylelint-config-recommended-vue/scss',
	],
	overrides: [
		// https://stylelint.io/developer-guide/syntaxes/
		// https://stylelint.io/user-guide/configure/#overrides
		{
			files: ['*.scss', '**/*.scss'],
			customSyntax: 'postcss-scss',
		},
		{
			files: ['*.vue', '**/*.vue'],
			customSyntax: 'postcss-html',
		},
	],
	plugins: ['stylelint-order'],
	rules: {
		'comment-empty-line-before': null,
		// 注释前不需要换行
		// 'scss/double-slash-comment-empty-line-before': 'never',
		'value-keyword-case': null,
		'selector-type-no-unknown': [
			true,
			{
				ignoreTypes: ['page', 'block', 'cover-view', 'scroll-view', 'swiper', 'swiper-item'],
			},
		],
		// 设置import的方式为字符串，另一种为url
		'import-notation': 'string',
		// 允许scss使用@mixin等
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['mixin', 'include', 'extend', 'import'],
			},
		],
		// 允许属性
		'function-no-unknown': [
			true,
			{
				ignoreFunctions: ['constant', '/^v-/'],
			},
		],
		// 允许单位
		'unit-no-unknown': [true, { ignoreUnits: ['/rpx/', '/upx/'] }],
		'no-descending-specificity': null,
		// import的url必须使用双引号
		// 'function-url-quotes': 'always',
		// 颜色要写全，禁止如#ccc，必须#cccccc
		'color-hex-length': 'long',
		// 多个属性之间是否有回车
		'rule-empty-line-before': 'never',
		// 设置字体时是否需要添加通用字体
		'font-family-no-missing-generic-family-keyword': null,
		// 允许未知属性
		// 'property-no-unknown': null,
		'no-empty-source': null,
		// 允许未知伪类
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['deep'],
			},
		],
		// 控制css属性的排序
		'order/properties-order': [
			'position',
			'top',
			'right',
			'bottom',
			'left',
			'z-index',
			'display',
			'justify-content',
			'align-items',
			'float',
			'clear',
			'overflow',
			'overflow-x',
			'overflow-y',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'width',
			'min-width',
			'max-width',
			'height',
			'min-height',
			'max-height',
			'font-size',
			'font-family',
			'font-weight',
			'border',
			'border-style',
			'border-width',
			'border-color',
			'border-top',
			'border-top-style',
			'border-top-width',
			'border-top-color',
			'border-right',
			'border-right-style',
			'border-right-width',
			'border-right-color',
			'border-bottom',
			'border-bottom-style',
			'border-bottom-width',
			'border-bottom-color',
			'border-left',
			'border-left-style',
			'border-left-width',
			'border-left-color',
			'border-radius',
			'text-align',
			'text-justify',
			'text-indent',
			'text-overflow',
			'text-decoration',
			'white-space',
			'color',
			'background',
			'background-position',
			'background-repeat',
			'background-size',
			'background-color',
			'background-clip',
			'opacity',
			'filter',
			'list-style',
			'outline',
			'visibility',
			'box-shadow',
			'text-shadow',
			'resize',
			'transition',
		],
	},
};

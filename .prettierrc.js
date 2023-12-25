module.exports = {
	// 参考文档：https://www.prettier.cn/docs/options.html
	// 换行长度
	printWidth: 150,
	// 指定每个缩进级别的空格数
	tabWidth: 2,
	// 使用制表符而不是空格缩进行
	useTabs: true,
	// 在语句末尾是否需要分号
	semi: true,
	// 是否使用单引号
	singleQuote: true,
	// 更改引用对象属性的时间 可选值"<as-needed|consistent|preserve>"
	quoteProps: 'as-needed',
	// 多行时尽可能打印尾随逗号， 可选值"<none|es5|all>"，默认none
	trailingComma: 'es5',
	// 在对象文字中的括号之间打印空格
	bracketSpacing: true,
	// 在单独的箭头函数参数周围包括括号 always要，avoid不要
	arrowParens: 'always',
	// 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
	rangeStart: 0,
	// 换行符使用 lf
	endOfLine: 'lf',
};

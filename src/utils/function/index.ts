import type { CSSProperties } from 'vue';

import { cssConfig } from '@/config/global';

import { isEmpty, isNumber } from './test';

/**
 * @description 去除空格
 * @param {String} str 需要去除空格的字符串
 * @param {String} pos both(左右)|left|right|all 默认both
 */
function trim(str: object | string, pos = 'both') {
	str = String(str);
	if (pos === 'both') {
		return str.replace(/^\s+|\s+$/g, '');
	}
	if (pos === 'left') {
		return str.replace(/^\s*/, '');
	}
	if (pos === 'right') {
		return str.replace(/(\s*$)/g, '');
	}
	if (pos === 'all') {
		return str.replace(/\s+/g, '');
	}
	return str;
}

export function addUnit(value: string | number = 'auto', unit = '') {
	if (!unit) {
		unit = cssConfig.unit || 'px';
	}
	value = String(value);
	return isNumber(value) ? `${value}${unit}` : value;
}

/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
export function addStyle(customStyle: object | string | CSSProperties, target = 'object') {
	interface Style {
		[key: string]: string;
	}
	// 字符串转字符串，对象转对象情形，直接返回
	if (isEmpty(customStyle) || (typeof customStyle === 'object' && target === 'object') || (target === 'string' && typeof customStyle === 'string')) {
		return customStyle;
	}
	// 字符串转对象
	if (target === 'object') {
		// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
		customStyle = trim(customStyle);
		// 根据";"将字符串转为数组形式
		const styleArray = customStyle.split(';');
		const style: Style = {};
		// 历遍数组，拼接成对象
		for (let i = 0; i < styleArray.length; i++) {
			// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
			if (styleArray[i]) {
				const item = styleArray[i].split(':');
				style[trim(item[0])] = trim(item[1]);
			}
		}
		return style;
	}
	// 这里为对象转字符串形式
	let string = '';
	const style = customStyle as Style;
	for (const i in style) {
		// 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
		const key = i.replace(/([A-Z])/g, '-$1').toLowerCase();
		string += `${key}:${style[i]};`;
	}
	// 去除两端空格
	return trim(string);
}

/**
 * @description 格式化时间
 * @param {String|Number} dateTime 需要格式化的时间戳
 * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
 * @returns {string} 返回格式化后的字符串
 */
export function timeFormat(dateTime: Date | null | string, formatStr = 'yyyy-mm-dd'): string {
	let date;
	// 若传入时间为假值，则取当前时间
	if (!dateTime) {
		date = new Date();
	}
	// 若为unix秒时间戳，则转为毫秒时间戳（逻辑有点奇怪，但不敢改，以保证历史兼容）
	else if (/^\d{10}$/.test(dateTime?.toString().trim())) {
		date = new Date(Number(dateTime) * 1000);
	}
	// 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
	else if (typeof dateTime === 'string' && /^\d+$/.test(dateTime.trim())) {
		date = new Date(Number(dateTime));
	}
	// 处理平台性差异，在Safari/Webkit中，new Date仅支持/作为分割符的字符串时间
	// 处理 '2022-07-10 01:02:03'，跳过 '2022-07-10T01:02:03'
	else if (typeof dateTime === 'string' && dateTime.includes('-') && !dateTime.includes('T')) {
		date = new Date(dateTime.replace(/-/g, '/'));
	}
	// 其他都认为符合 RFC 2822 规范
	else {
		date = new Date(dateTime);
	}

	const timeSource: { [key: string]: string } = {
		y: date.getFullYear().toString(), // 年
		m: (date.getMonth() + 1).toString().padStart(2, '0'), // 月
		d: date.getDate().toString().padStart(2, '0'), // 日
		h: date.getHours().toString().padStart(2, '0'), // 时
		M: date.getMinutes().toString().padStart(2, '0'), // 分
		s: date.getSeconds().toString().padStart(2, '0'), // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};

	for (const key in timeSource) {
		const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
		if (ret) {
			// 年可能只需展示两位
			const beginIndex = key === 'y' && ret.length === 2 ? 2 : 0;
			formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
		}
	}

	return formatStr;
}
type RectResultType<T extends boolean> = T extends true ? UniNamespace.NodeInfo[] : UniNamespace.NodeInfo;
/**
 * 简化获取元素信息的方法
 * @param el 元素的样式
 * @param all 获取全部或单个
 */
export function queryRect<T extends boolean>(el: string, all?: boolean, instance?: any): Promise<RectResultType<T>> {
	return new Promise((resolve) => {
		let query: UniNamespace.SelectorQuery | null = null;
		if (instance) {
			query = uni.createSelectorQuery().in(instance);
		} else {
			query = uni.createSelectorQuery();
		}
		query[all ? 'selectAll' : 'select'](el)
			// .select(el)
			.boundingClientRect((rect) => {
				resolve(rect as RectResultType<T>);
			})
			.exec();
	});
}

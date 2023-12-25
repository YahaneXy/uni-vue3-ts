/**
 * 验证十进制数字
 */
export function isNumber(value: string) {
	return /^[+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value);
}

export function isObject(value: string | object | undefined) {
	return Object.prototype.toString.call(value) === '[object Object]';
}
/**
 * 判断是否为空
 */
export function isEmpty<T>(value: T | T[]) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0) return true;
			break;
		case 'boolean':
			if (!value) return true;
			break;
		case 'number':
			if (value === 0 || isNaN(value)) return true;
			break;
		case 'object':
			if (Array.isArray(value) && value.length === 0) {
				return true;
			}
			if (value === null) return true;
			// eslint-disable-next-line no-unreachable-loop
			for (const i in value) {
				return false;
			}
			return true;
	}
	return false;
}
/**
 * 验证手机格式
 */
export function isMobile(value: number | string) {
	return /^1([3589]\d|4[5-9]|6[1-2,4-7]|7[0-8])\d{8}$/.test(value as string);
}
// export default {
// 	number,
// 	object,
// 	empty,
// };

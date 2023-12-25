const prefix = '_xyStore'; // 有时间的缓存前缀

/**
 * @param {string}          key     键名
 * @param {any}             value   键值
 * @param {number|string}   time    时间，单位为秒
 */
function put<T>(key: string, value: T, time?: number | string) {
	uni.setStorageSync(key, value);
	const seconds = Number(time);
	if (seconds > 0) {
		let timeStamp = Date.parse(new Date() as unknown as string);
		timeStamp = timeStamp / 1000 + seconds;
		uni.setStorageSync(key + prefix, timeStamp.toString());
	} else {
		uni.removeStorageSync(key + prefix);
	}
}

/**
 * @param {string}  key 键名
 * @param {any}     def 如果该值有时限并且超过时限时，返回的时候的默认值，如果没有默认值，则返回false
 */
function get<T>(key: string, def?: T) {
	const deadtime = Number(uni.getStorageSync(key + prefix));
	const now = Date.parse(new Date() as unknown as string) / 1000;
	if (deadtime && deadtime < now) {
		if (def) {
			return def;
		} else {
			return false;
		}
	}
	const res = uni.getStorageSync(key);
	if (res) {
		return res;
	} else {
		if (!def) {
			return false;
		}
		return def;
	}
}

function remove(k: string) {
	uni.removeStorageSync(k);
	uni.removeStorageSync(k + prefix);
}

export default {
	put,
	get,
	remove,
};

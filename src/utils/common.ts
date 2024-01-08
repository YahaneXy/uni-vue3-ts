import manifest from '../manifest.json';
const config = {
	appid: manifest['mp-weixin'].appid,
	url: 'http://192.168.0.79:8080',
};
if (process.env.NODE_ENV === 'development') {
	// 开发环境
	config.url = 'http://192.168.0.79:8080';
}
function deepClone<T>(obj: T | T[]): T | T[] {
	// 对常见的“非”值，直接返回原来值
	if (!obj) return obj;
	if (typeof obj !== 'object' /*  && typeof obj !== 'function' */) {
		// 原始类型直接返回
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map((value: T) => {
			return deepClone(value) as T;
		});
	} else {
		const o = Object.entries(obj).map((value) => {
			return [value[0], deepClone(value[1])];
		});
		return Object.fromEntries(o);
	}
}
/**
 * 对象深合并
 * @param target
 * @param source
 * @returns
 */
function deepMerge(target: AnyObject = {}, source: AnyObject = {}) {
	target = deepClone(target);
	if (typeof target !== 'object' || typeof source !== 'object') return {};
	for (const prop in source) {
		if (!Object.hasOwnProperty.call(source, prop)) continue;
		if (prop in target) {
			if (typeof target[prop] !== 'object') {
				target[prop] = source[prop];
			} else {
				if (typeof source[prop] !== 'object') {
					target[prop] = source[prop];
				} else {
					if (target[prop].concat && source[prop].concat) {
						target[prop] = target[prop].concat(source[prop]);
					} else {
						target[prop] = deepMerge(target[prop], source[prop]);
					}
				}
			}
		} else {
			target[prop] = source[prop];
		}
	}
	return target;
}
/**
 * 调起确认按钮
 * @param {String} title - modal的标题
 * @param {String} content - modal的内容
 * @param {String} type - default-默认:#77c146  danger-删除:#fa541c
 */
function showModal(title: string, content: string, type: 'default' | 'danger' = 'default', confirmText = '确认'): Promise<boolean> {
	return new Promise((resolve /* , reject */) => {
		const color: AnyObject = {
			default: '#c73c00',
			danger: '#fa541c',
		};
		const confirmColor = color[type];
		uni.showModal({
			title,
			content,
			confirmText,
			cancelColor: '#ccc',
			confirmColor,
			success: (res) => {
				if (res.confirm) {
					resolve(true);
				} /* else if (res.cancel) {
					reject(false);
				} */
			},
		});
	});
}
/**
 * 返回上一页
 */
function navBack(delayTime: number) {
	const pages = getCurrentPages();
	const prevPage = pages[pages.length - 2]; // 上一个页面
	// 判断上一页是否为首页，如果是就直接返回首页
	if (prevPage?.route) {
		setTimeout(() => {
			uni.navigateBack({
				delta: 1,
				// 失败回调直接返回首页
				fail: () => {
					uni.reLaunch({
						url: '/pages/home/home',
					});
				},
			});
		}, delayTime);
	} else {
		uni.reLaunch({
			url: '/pages/home/home',
		});
	}
}
/**
 * 跳转
 * @param url
 */
function navTo(url: string) {
	uni.navigateTo({ url });
}
/**
 * 简易提示
 * @param title
 * @param duration
 * @param mask
 */
function toast(title: string, duration = 1500, mask = false) {
	uni.showToast({
		title,
		icon: 'none',
		duration,
		mask,
	});
}
/**
 * 检测新版本
 */
function checkNewVersion() {
	const updateManager = uni.getUpdateManager();
	updateManager.onCheckForUpdate((res) => {
		console.log('是否有新版本', res.hasUpdate);
	});
	updateManager.onUpdateReady(() => {
		showModal('发现新版本', '新版本已经准备好了，现在更新！').then(() => {
			updateManager.applyUpdate();
		});
	});
	updateManager.onUpdateFailed((err) => {
		toast(err);
		console.log('下载失败', err);
	});
}
/**
 * 保存图片，如果传入的是一个字符串则使用函数体内的保存，如果传入函数则执行函数
 * @param {String|Function} targetImage
 */
function saveImage(targetImage: string | (() => void)) {
	uni.getSetting({
		success: (res) => {
			const writable = res.authSetting['scope.writePhotosAlbum'];
			if (writable) {
				excu();
			} else {
				toast('保存失败，请在设置中允许保存图片到相册');
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success() {
						excu();
					},
					fail() {
						showModal('保存图片', '允许“泉洛侨批馆”使用您的保存权限，以将二维码保存到相册！').then(() => {
							uni.openSetting({
								success() {
									excu();
								},
								fail(err: any) {
									toast(`保存失败:${err.errMsg}`);
								},
							});
						});
					},
				});
			}
		},
	});
	function excu() {
		if (typeof targetImage === 'string') {
			uni.saveImageToPhotosAlbum({
				filePath: targetImage,
				success() {
					toast('保存成功！');
				},
				fail(err) {
					toast(`保存失败:${err.errMsg}`);
				},
			});
		} else {
			targetImage();
		}
	}
}

export default {
	config,
	deepClone,
	deepMerge,
	showModal,
	navBack,
	toast,
	navTo,
	checkNewVersion,
	saveImage,
};

import { useUserStore } from '@/stores/user';

import * as common from './common';
type Method =
	| 'OPTIONS'
	| 'GET'
	| 'HEAD'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'TRACE'
	| 'CONNECT'
	| 'options'
	| 'get'
	| 'head'
	| 'post'
	| 'put'
	| 'delete'
	| 'trace'
	| 'connect';
interface CustomConfig {
	method?: Method;
	headers?: { [index: string]: any };
	loading?: boolean;
	needToken?: boolean;
	url?: string;
	isJson?: boolean;
	[index: string]: any;
}

// // 避免多个请求时，多次进行跳转
// export const enableToLogin = true;
let requestTime = 0;
export function request<T = any>(customConfig: CustomConfig = {}): Promise<T> {
	let config: CustomConfig = {
		method: 'GET',
		headers: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // uni默认为application/json
			'X-APP-KEY': common.config.appid,
		},
		needToken: true,
	};
	const userInfo = useUserStore();
	config = common.deepMerge(config, customConfig);
	config.method = config.method!.toUpperCase() as Method;
	requestTime++;
	if (config.loading) {
		uni.showLoading({ title: '加载中' });
	}
	return new Promise((resolve, reject) => {
		const openId = userInfo.openId;
		if (openId && config.needToken) {
			const idObj = { openId };
			config.headers = common.deepMerge(config.headers, idObj);
		}
		// 是否携带token
		if (config.needToken) {
			const token = userInfo.token;
			if (token) {
				const Auth = { Authorization: token };
				config.headers = common.deepMerge(config.headers, Auth);
			} else {
				unLogin('请先登录');
				reject(new Error('未登录'));
				return;
			}
		}
		if ((config.isJson === undefined && config.method?.toUpperCase() === 'POST') || config.method?.toUpperCase() === 'PUT') {
			config.isJson = true;
		}
		// 是否json请求
		if (config.isJson) {
			config.headers!['content-type'] = 'application/json';
		}
		uni.request({
			// 如果检测到传进来的url是一个完整的https，则直接使用该url，否则就与全局设置一致
			url: /^(f|ht)tps?:\/\//i.test(config.url!) ? config.url! : common.config.url + config.url!,
			method: (config.method as UniNamespace.RequestOptions['method']) || 'GET',
			header: config.headers,
			data: config.data,
			success: (res: any) => {
				if (config.loading) {
					setTimeout(() => {
						uni.hideLoading();
					}, 500);
				}
				if (res.statusCode === 502) {
					reject(new Error('server error'));
					return;
				}
				let code = res.data.code;
				code = code === 0 ? 0 : code || 200;
				const message = res.data.message;
				if (code === 200) {
					resolve(res.data);
				} else if (code === 401) {
					// 如果登录权限异常，就移除登录状态，并且跳转到登录页面
					unLogin(message);
					userInfo.removeUserInfo();
					reject(new Error(message));
				} else if (code === 500) {
					uni.showToast({
						title: message || 'unknow error',
						icon: 'none',
					});
					reject(new Error(message));
				} else if (code !== 200) {
					errorToast(message);
					reject('error');
				}
			},
			fail: (error) => {
				errorToast();
				reject(new Error(error.errMsg));
			},
			complete: () => {
				if (config.loading) {
					requestTime--;
					if (requestTime === 0) {
						uni.hideLoading();
					}
				}
			},
		});
	});
}

function unLogin(errMsg?: string) {
	// 需要token但是没有实际登录的情况
	// 如果登录权限异常，就移除登录状态，并且跳转到登录页面
	const pages = getCurrentPages();
	const path = pages[pages.length - 1]['route'];
	setTimeout(() => {
		uni.navigateTo({
			url: `/pages/login/login?forward=/${path || ''}}`,
		});
	}, 1000);
	console.log('errMsg', errMsg);
	errorToast(errMsg);
}

/**
 * 错误提示
 * @param errMsg
 */
function errorToast(errMsg?: string) {
	// console.error('net errorToast', errMsg);
	uni.showToast({
		title: errMsg || '-: net error',
		icon: 'none',
	});
}

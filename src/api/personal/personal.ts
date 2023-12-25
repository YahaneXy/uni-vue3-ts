import type { R } from '@/api/base';
import { request } from '@/utils/request';

import type { BizUserVo } from './model/personalModel';

/**
 * 获取用户信息
 */
export function getUserInfo() {
	return request<R<BizUserVo>>({
		url: '/front/biz/user/userInfo',
		method: 'get',
		needToken: true,
	});
}
/**
 * 退出登录
 */
export function userLogout() {
	return request({
		url: '/front/passport/logout',
		method: 'post',
		needToken: true,
	});
}

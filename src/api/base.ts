import { request } from '@/utils/request';
export interface LoginParams {
	openId: string;
	unionId: string;
	code: string;
	tenantId: string;
}
export interface BaseEntity {
	/** 分页页码 */
	pageNum?: number;
	/** 分页数 */
	pageSize?: number;
	/** 搜索值 */
	searchValue?: string;
	/** 排序字段 */
	orderByColumn?: string;
	/** 排序字段顺序 */
	isAsc?: string;
	/** 请求参数 */
	params?: Record<string, any | undefined>;
}
export interface R<T> {
	// 消息码
	code: number;
	// 消息
	msg: string;
	// 数据
	data: T;
}
export interface TableDataInfo<T> {
	/** 总记录数 */
	total: number;
	/** 列表数据 */
	rows: T[];
	/** 消息状态码 */
	code: number;
	/** 消息内容 */
	msg: string;
}
/**
 * 登录
 * @param {LoginParams} data
 */
export function apiLogin(data: LoginParams) {
	return request<R<string>>({
		url: '/front/minapp/xcx/login',
		method: 'post',
		data,
	});
}
/**
 * 退出登录
 */
export function logout() {
	return request({
		url: '/front/passport/logout',
		method: 'POST',
		loading: false,
		needToken: true,
	});
}

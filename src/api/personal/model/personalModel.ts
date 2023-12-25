/**
 * BizUserVo，用户视图对象 biz_user
 */
export interface BizUserVo {
	/**
	 * 头像
	 */
	avatar?: string;
	/**
	 * 创建ip
	 */
	createIp?: string;
	/**
	 * 创建时间
	 */
	createTime?: Date;
	/**
	 * 最后登录ip
	 */
	lastLoginIp?: string;
	/**
	 * 最后登录时间
	 */
	lastLoginTime?: Date;
	/**
	 * 手机号（登录凭证）
	 */
	mobile?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 用户角色
	 */
	roles?: string;
	/**
	 * 账号状态（1正常 0停用）
	 */
	status?: number;
	/**
	 * 更新时间
	 */
	updateTime?: Date;
	/**
	 * 用户id
	 */
	userId?: number;
	/**
	 * 用户名
	 */
	username?: string;
}

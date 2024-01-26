import { defineStore } from 'pinia';

import type { LoginInfo, LoginParams } from '@/api/base';
import { apiLogin, logout } from '@/api/base';
import type { BizUserVo } from '@/api/personal/model/personalModel';
import { getUserInfo } from '@/api/personal/personal';

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			token: '',
			openId: '',
			isLogin: false,
			userInfo: null as BizUserVo | null,
		};
	},
	persist: {
		storage: {
			getItem: uni.getStorageSync,
			setItem: uni.setStorageSync,
		},
	},
	actions: {
		login(params: LoginParams) {
			return apiLogin(params).then((res) => {
				if (res.data) {
					const { data } = res;
					this.token = data;
					this.openId = params.openId;
					return data;
				}
			});
		},
		// 如果后端有token缓存，就直接走这一步
		saveLoginData(loginInfo: LoginInfo) {
			this.token = loginInfo.token!;
			this.openId = loginInfo.openId;
			this.isLogin = true;
		},
		logout() {
			return logout().then(() => {
				this.removeUserInfo();
			});
		},
		removeUserInfo() {
			this.token = '';
			this.openId = '';
			this.isLogin = false;
			this.userInfo = null;
		},
		setUserInfo() {
			return getUserInfo().then((res) => {
				// this.setUserInfo(res.data);
				this.userInfo = res.data;
			});
		},
	},
});

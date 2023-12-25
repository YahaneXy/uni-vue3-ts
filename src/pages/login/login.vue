<template>
	<view>
		<view class="login">
			<view class="wx">
				<view class="logo">测试用登录页</view>
				<view class="u-btn-wrap">
					<button class="login-btn" hover-class="shadow-hover" hover-stay-time="100" @click="loginNew">登 录</button>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" is-mask-click>
			<view class="pop-area flex flex-dr flex-a">
				<view class="title">新用户登录</view>
				<button
					class="login-btn pop-btn"
					hover-class="shadow-hover"
					hover-stay-time="100"
					open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber"
				>
					手机号一键登录
				</button></view
			>
		</uni-popup>
		<view class="copyright flex flex-jc flex-a">@copyright - 测试用登录页</view>
	</view>
</template>

<script lang="ts" setup>
import type { LoginParams } from '@/api/base';
import { getUserInfo } from '@/api/personal/personal';
// import { apiLogin } from '@/api/base';
import { useUserStore } from '@/store/user/index';
// import cache from '@/utils/cache';
// import common from '@/utils/common';
import { request } from '@/utils/request';

interface Openid {
	openId: string;
	unionId: string;
}
interface LoginInfo {
	openId: string;
	unionId: string;
	token?: string;
}

const $common = inject<CustomInterface.Common>('$common')!;

const user = useUserStore();

const popup: any = ref(null);

const loginInfo = ref<LoginInfo>();

const forward = ref('');
onLoad((options) => {
	forward.value = options?.forward ? decodeURIComponent(options.forward) : '';
});

function getUserOpenId(): Promise<Openid> {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				if (res.code) {
					request({
						url: '/front/minapp/codeConvertKey',
						data: {
							code: res.code,
						},
						method: 'post',
						headers: {
							'content-type': 'application/x-www-form-urlencoded',
							'X-APP-KEY': $common?.config.appid,
							tenantId: '000000',
						},
					})
						.then((res) => {
							resolve(res.data);
						})
						.catch((e) => {
							reject(e);
						});
				}
			},
		});
	});
}
function getPhoneNumber(e: WechatMiniprogram.ButtonGetPhoneNumber) {
	if (!e.detail.encryptedData) {
		return;
	}
	getUserOpenId().then((res) => {
		const data = res;
		const openId = data.openId;
		const unionId = data.unionId;
		const params: LoginParams = {
			openId,
			unionId,
			code: e.detail.code,
			tenantId: '000000',
		};
		user.login(params);
	});
}

// 后端已经缓存了token的操作
async function loginNew() {
	/*
	https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
	自2023年8月26日起，手机号快速验证组件将需要付费使用，改用以下方式：
	触发登录，请求解密接口时，后台直接验证是否已经存在用户，如果已经存在直接返回token，如果不存在则进行登录消费
	*/
	uni.showLoading({
		title: '登录中',
	});
	loginInfo.value = await getUserOpenId();
	if (loginInfo.value.token) {
		afterLogin(loginInfo.value.token);
	} else {
		popup.value.open();
	}
}

// 登录成功后执行的操作
function afterLogin(token: string) {
	user.saveLoginData(token);
	getUserInfo().then((res) => {
		user.setUserInfo(res.data);
		uni.hideLoading();
		$common.toast('登录成功!');
		setTimeout(() => {
			$common.navBack();
		}, 200);
	});
}
</script>

<style lang="scss" scoped>
.login {
	padding: 0 48rpx;
	height: 100vh;
	background: #ffffff;

	//公共抽离
	.u-btn-wrap {
		margin-bottom: 40rpx;
		width: 100%;
	}
	.wx {
		display: flex;
		align-items: center;
		padding-top: 198rpx;
		flex-direction: column;
		.logo {
			margin-bottom: 140rpx;
			// width: 175rpx;
			height: 175rpx;
			font-size: 80rpx;
			font-family: CusKaiTi, sans-serif;
			font-weight: bold;
			color: var(--color-6);
		}
	}
}
.login-btn {
	margin: 0 auto;
	height: 80rpx;
	font-size: 28rpx;
	border-radius: 8rpx;
	text-align: center;
	color: #ffffff;
	background-color: var(--color-6);
	line-height: 80rpx;
}
.pop-area {
	padding: 40rpx 32rpx 0;
	width: 80vw;
	height: 300rpx;
	border-radius: 14rpx;
	background-color: #ffffff;
	.title {
		margin-bottom: 60rpx;
	}
}
.pop-btn {
	width: 400rpx;
}
.copyright {
	position: fixed;
	bottom: 100rpx;
	width: 100%;
	font-size: 24rpx;
	text-align: center;
	color: #999999;
}
</style>

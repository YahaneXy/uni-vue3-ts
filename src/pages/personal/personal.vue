<template>
	<view class="personal">
		<view class="top mb34">
			<view class="top-user flex flex-a ml16" @click="userHandler">
				<image class="avatar" mode="scaleToFill" :src="userInfo?.avatar || '/static/images/avatar_null.png'"></image>
				<view class="user-name"> {{ userInfo?.username || '立即登录' }} </view>
			</view>
		</view>
		<view class="panel-box">
			<view class="panel-appointment mb16">
				<view class="flex flex-jc-sb">
					<view class="font-bold font30 mb20"> 菜单栏 </view>
					<view class="c-gray font24" @click="navTo(`/pagesSub/order/order?index=${0}`, true)">全部</view>
				</view>
				<view class="w100 flex flex-jc-sa">
					<view
						v-for="(item, index) in iconList"
						:key="index"
						class="appointment-box t-center"
						@click="navTo(`/pagesSub/appointment/myAppointment?index=${index + 1}`, true)"
					>
						<image v-if="isImg(item.icon)" class="panel-icons mb16" mode="heightFix" :src="item.icon"></image>
						<!-- <uni-icons v-else :type="item.icon" size="100rpx" color="var(--color-6)"></uni-icons> -->
						<!-- <wd-icon v-else :name="item.icon" size="100rpx" color="var(--color-6)" /> -->
						<view class="font24 c-333">{{ item.content }}</view>
					</view>
				</view>
			</view>
			<view
				v-for="(item, index) in panelList"
				:key="index"
				class="panel flex flex-a mb16"
				hover-class="shadow-hover"
				hover-stay-time="100"
				@click="handlePanel(item, item.needToken)"
			>
				<view class="flex1 flex flex-a">
					<image v-if="isImg(item.icon)" class="panel-icons" mode="heightFix" :src="item.icon"></image>
					<!-- <uni-icons v-else :type="item.icon" size="60rpx" color="var(--color-6)"></uni-icons> -->
					<view class="c-333 ml16">{{ item.content }}</view>
				</view>
				<!-- <uni-icons type="forward" size="16" color="#999999"></uni-icons> -->
			</view>
			<view v-show="isLogin" class="logout-btn" hover-class="main-hover" hover-stay-time="100" @click="logout"> 退出登录 </view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';

const user = useUserStore();

onShow(() => {
	uni.hideTabBar();
	// handleGetUserInfo();
	// isLogin.value = user.isLogin;
});

const $common = inject<CustomInterface.Common>('$common')!;

interface IconList {
	icon: string;
	content: string;
	[key: string]: any;
}
const iconList = ref<IconList[]>([
	{ icon: 'a-rootlist', content: '进行中' },
	{ icon: 'check', content: '已核销' },
	{ icon: 'info-circle', content: '已过期' },
	{ icon: 'close', content: '已取消' },
	// { icon: 'contact-filled', content: '已完成' },
]);
const panelList = ref<IconList[]>([
	{
		icon: 'contact-filled',
		content: '常用联系人',
		url: '/pagesSub/contacts/contacts?a=1',
		needToken: true,
	},
	{
		icon: 'list',
		content: '领队预约记录',
		url: '/pagesSub/appointment/groupAppointment',
		needToken: true,
	},
]);
// const userInfo = ref<BizUserVo>({});
const userInfo = computed(() => user.userInfo);
const isLogin = computed(() => user.isLogin);
// 用户登录相关操作
function userHandler() {
	if (!isLogin.value) {
		uni.navigateTo({
			url: '/pages/login/login',
		});
		return false;
	}
	return true;
}

// 点击面板
function handlePanel(item: IconList, needToken?: boolean) {
	if (item.url) {
		return navTo(item.url, needToken);
	}
	// if (item.url.indexOf('/') !== -1) {
	// 	navTo(item.url);
	// } else {
	// 	if (item.url === 'hotline') {
	// 		if (hotline.value) {
	// 			uni.makePhoneCall({
	// 				phoneNumber: hotline.value,
	// 			});
	// 		} else {
	// 			$common.toast('出现错误，请尝试刷新页面');
	// 		}
	// 	}
	// }
}

function navTo(url: string, needToken?: boolean) {
	if (!url) return;
	if (needToken && !userHandler()) {
		$common.toast('请先登录');
		return;
	}
	uni.navigateTo({
		url,
	});
}

function logout() {
	$common.showModal('退出登录', '确定要退出登录吗？').then(() => {
		user.logout().then(() => {
			$common.toast('登出成功');
		});
	});
}

// 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
function isImg(value: string) {
	return value.indexOf('/') !== -1;
}
</script>

<style lang="scss" scoped>
.c-333 {
	color: #333333;
}
.personal {
	.top {
		position: relative;
		padding: 34rpx 32rpx 0;
		width: 100%;
		height: 368rpx;
		border-radius: 0 0 68rpx 68rpx;
		// background: $mainC;
		background: var(--color-6);
		.top-user {
			.avatar {
				margin-right: 32rpx;
				width: 134rpx;
				height: 134rpx;
				border-radius: 100%;
			}
			.user-name {
				font-size: 40rpx;
				font-weight: bold;
				color: #ffffff;
			}
		}
	}
	.panel-box {
		position: relative;
		top: -184rpx;
		margin-bottom: -184rpx;
		padding: 0 32rpx;
		width: 100%;
		.panel-appointment {
			padding: 34rpx 32rpx;
			width: 686rpx;
			// height: 244rpx;
			border-radius: 8rpx;
			background: #ffffff;
			box-shadow: 0 0 4rpx 0 rgb(29 21 17 / 35%);
			.appointment-box {
				width: 33%;
			}
		}
		.panel {
			padding: 16rpx;
			width: 100%;
			height: 100rpx;
			font-size: 30rpx;
			background-color: #ffffff;
			transition: background-color 100ms;
			.panel-icons {
				margin-right: 24rpx;
				height: 38rpx;
			}
		}
		.panel-hover {
			background-color: #cccccc;
		}
		.logout-btn {
			margin: 0 auto;
			margin-top: 122rpx;
			width: 588rpx;
			height: 70rpx;
			border-radius: 8rpx;
			text-align: center;
			color: #ffffff;
			background-color: var(--color-6);
			line-height: 70rpx;
		}
	}
	.popup-area {
		padding: 32rpx;
		width: 600rpx;
		border-radius: 10rpx;
		background-color: #ffffff;
		.title {
			font-size: 40rpx;
			font-family: CusKaiti, sans-serif;
			font-weight: bold;
		}
	}
}
.shadow-hover {
	box-shadow: #cccccc 0 0 20rpx;
}
</style>

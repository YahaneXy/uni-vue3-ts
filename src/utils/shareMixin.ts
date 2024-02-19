export default {
	data() {
		return {
			share: {
				title: '欢迎使用小程序',
				path: '/pages/index/index',
			},
		};
	},
	// 分享到微信好友功能
	onShareAppMessage(): Page.CustomShareContent {
		return {
			title: this.share.title,
			path: this.share.path,
			success() {
				uni.showToast({
					title: '分享成功',
				});
			},
			fail() {
				uni.showToast({
					title: '分享失败',
					icon: 'none',
				});
			},
		};
	},
	// 分享到朋友圈功能
	onShareTimeline(): Page.CustomShareContent {
		return {
			title: this.share.title,
			path: this.share.path,
			success() {
				uni.showToast({
					title: '分享成功',
				});
			},
			fail() {
				uni.showToast({
					title: '分享失败',
					icon: 'none',
				});
			},
		};
	},
} as any;

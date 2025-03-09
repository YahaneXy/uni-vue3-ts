<template>
	<view class="ab-center" @click="emit('emptyClick')">
		<!-- <u-empty v-show="show && !loading" icon="/static/image/emptydata.png" :text="text"></u-empty> -->
		<view v-show="show && !loading" class="empty flex flex-a flex-dr flex-jc">
			<image class="empty-img" :src="emptyImg" mode="widthFix" :style="getEmptyImgStyle()"></image>
			<view class="empty-text" :style="{ color: emptyTextColor }">{{ emptyText }}</view>
		</view>
		<view v-show="loading" class="flex flex-a">
			<wd-loading />
			<view class="ml-8">加载中...</view>
		</view>
		<view v-show="nomore && !loading">
			<wd-divider> 没有更多了 </wd-divider>
		</view>
	</view>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { addUnit } from '@/utils/function';

interface EmptyProps {
	emptyImg?: string;
	show?: boolean;
	emptyText?: string;
	emptyTextColor?: string;
	loading?: boolean;
	nomore?: boolean;
	imgWidth?: number | string;
}
const props = withDefaults(defineProps<EmptyProps>(), {
	emptyImg: '/static/images/empty-list.png',
	show: false,
	emptyText: '空空如也',
	emptyTextColor: '#999',
	loading: false,
	nomore: false,
	imgWidth: '300rpx',
});
const getEmptyImgStyle = () => {
	const style: CSSProperties = {};
	if (props.imgWidth) {
		style.width = addUnit(props.imgWidth);
	}
	return style;
};
const emit = defineEmits(['emptyClick']);
// defineProps({
// 	emptyImg: {
// 		type: String,
// 		default: '/static/images/empty-list.png',
// 	},
// 	show: {
// 		type: Boolean,
// 		default: false,
// 	},
// 	text: {
// 		type: String,
// 		default: '空空如也',
// 	},
// 	loading: {
// 		type: Boolean,
// 		default: false,
// 	},
// 	nomore: {
// 		type: Boolean,
// 		default: false,
// 	},
// });
</script>

<style lang="scss" scoped></style>

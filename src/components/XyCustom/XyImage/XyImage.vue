<template>
	<view class="xy-image">
		<image v-show="!loading" class="xy-image-main" :mode="mode" :style="getStyle()" :src="imageUrl" @error="handleError" @load="handleLoaded"></image>
		<image v-show="loading" class="loading-img" :src="loadingImg" :style="getStyle()"></image>
	</view>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { addUnit } from '@/utils/function';

interface XyImageProps {
	src?: string;
	width?: number | string;
	height?: number | string;
	roundNum?: number | string;
	defaultSrc?: string;
	showLoading?: boolean;
	mode?:
		| 'scaleToFill'
		| 'aspectFit'
		| 'aspectFill'
		| 'widthFix'
		| 'heightFix'
		| 'top'
		| 'bottom'
		| 'center'
		| 'left'
		| 'right'
		| 'top left'
		| 'top right'
		| 'bottom left'
		| 'bottom right';
}
const props = withDefaults(defineProps<XyImageProps>(), {
	width: 100,
	height: 100,
	mode: 'scaleToFill',
	showLoading: false,
});
const loading = ref(props.showLoading);
const $common = inject<CustomInterface.Common>('$common')!;
const imageUrl = ref(props.src || props.defaultSrc || $common.config.errorImg);
const loadingImg = $common.config.loadingImg;
function handleLoaded() {
	if (loading.value) loading.value = false;
}
function handleError() {
	imageUrl.value = props.defaultSrc || $common.config.errorImg;
}
const getStyle = () => {
	const style: CSSProperties = {};
	style.borderRadius = addUnit(props.roundNum);
	style.width = addUnit(props.width);
	style.height = addUnit(props.height);
	return style;
};
</script>

<style scoped lang="scss"></style>

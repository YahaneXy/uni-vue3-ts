<template>
	<view> 这是测试页面 </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app';
// import { } from '@dcloudio/uni-app';
onShow(() => {
	const page = getCurrentPages();
	console.log(page);
});
</script>

<style lang="scss" scoped></style>

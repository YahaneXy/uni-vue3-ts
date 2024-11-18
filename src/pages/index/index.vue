<template>
	<view>
		<xy-tabbar :current-index="0" :height="tabbarHiehgt" />
	</view>
</template>

<script lang="ts" setup>
import XyTabbar from '@/components/xy-tabbar/xy-tabbar.vue';
import { tabbarHiehgt } from '@/config/global';
</script>
<style scoped lang="scss">
.search {
	width: 500rpx;
}
</style>

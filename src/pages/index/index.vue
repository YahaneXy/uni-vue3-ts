<template>
	<view>
		<!-- <view class="ab-center search">
			<xy-search :action-out-layer="false"></xy-search>
		</view> -->
		<xy-tabs :tabs="list"></xy-tabs>
		<xy-tabbar :current-index="0" :height="tabbarHiehgt" />
	</view>
</template>

<script lang="ts" setup>
import XyTabbar from '@/components/xy-tabbar/xy-tabbar.vue';
// import xySearch from '@/components/xy-search/xy-search.vue';
import xyTabs from '@/components/xy-tabs/xy-tabs.vue';
import { tabbarHiehgt } from '@/config/global';
// import { ref } from 'vue';

const list = ref([{ name: '123' }, { name: '456' }, { name: '678' }]);

onShow(() => {
	uni.hideTabBar();
});
</script>
<style scoped lang="scss">
.search {
	width: 500rpx;
}
</style>

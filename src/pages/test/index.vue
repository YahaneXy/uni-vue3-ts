<template>
	<view>测试页面 </view>
	<xy-Tabbar :current-index="1" :height="tabbarHiehgt" />
</template>

<script lang="ts" setup>
// import { } from '@dcloudio/uni-app';
import XyTabbar from '@/components/xy-tabbar/xy-tabbar.vue';
import { tabbarHiehgt } from '@/config/global';
</script>

<style lang="scss" scoped></style>

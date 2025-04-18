<template>
	<view>
		<view class="form-area">
			<!-- <xy-form>
				<xy-form-items label="姓名" label-position="top">
					<xy-input placeholder="请输入内容"></xy-input>
				</xy-form-items>
			</xy-form> -->
			<xy-search inner-action-gap border-radius="60rpx"></xy-search>
		</view>
	</view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.form-area {
	margin: 16rpx;
	padding: 16rpx 32rpx;
	border-radius: 16rpx;
	background-color: white;
}
</style>

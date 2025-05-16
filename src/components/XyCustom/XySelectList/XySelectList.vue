<template>
	<view class="xy-select-list" :style="{ gap: gap }">
		<view v-for="(item, index) in listData" :key="index" class="xy-select-list-item" @click="handleSelect(index)">
			<view v-show="showSelector" class="selector" :style="getSelectorStyle()">
				<view class="circle-outer" :style="getCircleOuterStyle(index)">
					<view class="circle" :style="getCircleStyle(index)"></view>
				</view>
			</view>
			<view class="flex1">
				<slot :item="item" :index="index"></slot>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { addUnit } from '@/utils/function';

import type { XySelectListEmits } from './types';
import { xySelectListProps } from './types';
const props = defineProps(xySelectListProps);
const emit = defineEmits<XySelectListEmits>();
const selectList = ref<number[]>([]);
const getSelectorStyle = () => {
	const style: CSSProperties = {
		width: addUnit(props.selectorWidth),
	};
	return style;
};
const getCircleOuterStyle = (index: number) => {
	const style: CSSProperties = {
		border: props.border,
		padding: addUnit(props.selectorPadding),
	};
	const isSelect = getIndex(index) > -1;
	style.borderColor = isSelect ? props.activeBorderColor : props.inactiveBorderColor;
	return style;
};
const getCircleStyle = (index: number) => {
	const style: CSSProperties = {
		width: addUnit(props.size),
		height: addUnit(props.size),
	};
	const isSelect = getIndex(index) > -1;
	style.backgroundColor = isSelect ? props.activeColor : props.inactiveColor;
	return style;
};
function handleSelect(index: number) {
	if (selectList.value.includes(index)) {
		selectList.value = selectList.value.filter((item) => item !== index);
	} else {
		selectList.value.push(index);
	}
	const selectItems = selectList.value.map((i) => props.listData[i]);
	emit('change', {
		items: selectItems,
		indexs: selectList.value,
	});
}

// 全选/全不选
function handleSelectAll(selectAll: boolean) {
	if (selectAll === true || selectAll === false) {
		selectList.value = selectAll ? props.listData.map((_, index) => index) : [];
		emit('change', {
			items: selectAll ? props.listData : [],
			indexs: selectList.value,
		});
		return;
	}
	const isSelectAll = selectList.value.length === props.listData.length && props.listData.length > 0;
	selectList.value = isSelectAll ? [] : props.listData.map((_, index) => index);
	emit('change', {
		items: isSelectAll ? [] : props.listData,
		indexs: selectList.value,
	});
}

// 清除所有
function handleClear() {
	selectList.value = [];
	emit('change', {
		items: [],
		indexs: [],
	});
}

const getIndex = (index: number) => {
	return selectList.value.findIndex((i) => i === index);
};
defineExpose({
	handleSelectAll,
	handleClear,
});
</script>
<script lang="ts">
export default {
	options: {
		virtualHost: true,
	},
};
</script>
<style scoped lang="scss">
.xy-select-list {
	display: flex;
	flex-direction: column;
	.xy-select-list-item {
		display: flex;
		align-items: center;
		.selector {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			.circle-outer {
				border-radius: 50%;
			}
			.circle {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
			}
		}
	}
}
</style>

<template>
	<view class="tabs flex flex-a" :style="`background-color:${bgColor};--font-c:${fontColor};--active-color:${activeColor}`">
		<view class="tabs-slider" :style="{ transform: `translate(${lineOffsetLeft}px)`, backgroundColor: sliderBgColor }" />
		<view
			v-for="(item, index) in tabs"
			:key="index"
			class="tabs-item flex1"
			:class="[index === currentIndex && 'tabs-active']"
			@click="onChange(index, true, item)"
			>{{ getTabName(item) }}</view
		>
	</view>
</template>

<script lang="ts" setup>
import { queryRect } from '@/utils/function';
const instance = getCurrentInstance();
interface Obj {
	// 设置disabled:true禁止点击该元素
	[key: string]: any;
}
type Tabs = string | number | Obj;
interface propsInterface {
	tabs: Tabs[];
	keyName?: string;
	height?: string | number;
	scrollable?: boolean;
	tabIndex?: number;
	bcgColor?: string;
	customStyle?: object | string;
	isBorder?: boolean;
	lineColor?: string;
	disabled?: boolean;
	bgColor?: string;
	sliderBgColor?: string;
	fontColor?: string;
	activeColor?: string;
}
const props = withDefaults(defineProps<propsInterface>(), {
	height: '72rpx',
	tabIndex: -1,
	keyName: 'name',
	bcgColor: 'inherit',
	lineColor: 'blue',
	disabled: false,
	bgColor: '#ffd2ab',
	sliderBgColor: '#ffffff',
	fontColor: 'white',
	activeColor: '#7dba00',
});
const emit = defineEmits<{
	(e: 'change', value: Tabs, index: number): void;
	(e: 'trigger'): void;
}>();
onMounted(async () => {
	await getAllItem();
	sliderChange(currentIndex.value, false);
});
/** 实际激活的位置 */
const currentIndex = ref(props.tabIndex === -1 ? 0 : props.tabIndex);
/** 列表的元素 */
const tabItems = ref<{ width: number }[]>([]);
// 滑块距离左侧的位置
const lineOffsetLeft = ref(0);
function onChange(index: number, onEmit = true, item?: Tabs) {
	emit('trigger');
	if (props.disabled) return;
	sliderChange(index, onEmit, item);
}
function sliderChange(index: number, onEmit = true, item?: Tabs) {
	currentIndex.value = index;
	let left = 0;
	for (let i = 0; i <= index; i++) {
		left += tabItems.value[i]?.width || 0;
	}
	lineOffsetLeft.value = left - ((tabItems.value[index]?.width as number) || 0);
	if (item && onEmit) {
		emit('change', item, index);
	}
}
// 根据传入的类型判断，是否使用自定义的keyName
function getTabName(tab: string | number | Obj) {
	if (typeof tab === 'object' && props.keyName) {
		const value = tab[props.keyName as string];
		if (!value) console.error('请检查数值或键名是否正确');
		return value ?? '';
	}
	return tab;
}
// 获取所有tab元素的属性
function getAllItem() {
	// 增加限定，避免穿透（测试发现似乎不会穿透到父组件，以防万一）
	return queryRect('.tabs-item', true, instance).then((res) => {
		tabItems.value = (res as unknown as WechatMiniprogram.BoundingClientRectCallbackResult[]).map((v) => {
			return {
				width: v.width,
			};
		});
		return res;
	});
}
watch(
	() => props?.tabIndex,
	async (newV) => {
		if (newV !== currentIndex.value) {
			await nextTick();
			sliderChange(newV, false);
		}
	},
	{
		immediate: false,
	}
);
</script>

<style lang="scss" scoped>
.tabs {
	position: relative;
	padding: 7rpx 9rpx;
	// width: 686rpx;
	height: 68rpx;
	border-radius: 34rpx;
	// background: var(--color-2);
	.tabs-slider {
		position: absolute;
		width: calc(50% - 9rpx);
		height: 54rpx;
		border-radius: 27rpx;
		// background-color: var(--color-2);
		// background-color: #ffffff;
		transition: all 300ms;
		transition-property: transform;
	}
	.tabs-item {
		z-index: 1;
		text-align: center;
		color: var(--font-c);
		// color: #7dba00;
	}
	.tabs-active {
		font-weight: bold;
		color: var(--active-color);
		// color: #7dba00 !important;
	}
}
</style>

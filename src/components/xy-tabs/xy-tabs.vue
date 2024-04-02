<template>
	<view class="xy-tabs" :class="[isBorder && ['xy-border-bottom', 'xy-border-top']]" :style="{ ...tabStyle }">
		<scroll-view scroll-with-animation :scroll-x="scrollable" :scroll-animation-duration="240" enhanced :show-scrollbar="false">
			<view class="tabs-item" :class="{ flex: !scrollable, 'tabs-scroll': scrollable }">
				<view
					v-for="(tab, index) in tabs"
					:id="`tab-item-${index}`"
					:key="index"
					:data-index="index"
					class="tab-item"
					:class="[Number(currentIndex) === index && 'active', !scrollable && 'flex1', typeof tab === 'object' && tab?.disabled && 'disabled']"
					:style="{ height: heightVal, lineHeight: heightVal }"
					@click="selected(index, tab)"
				>
					{{ getTabName(tab) }}
				</view>
				<view class="nav-line" :style="{ transform: `translate(${lineOffsetLeft}px)`, width: `${lineWidth}px`, background: lineColor }"></view>
			</view>
		</scroll-view>
	</view>
</template>
<script lang="ts" setup>
/**
 * tabs 标签
 * @property {string|object[]}		tabs		列表数据:[1,2,3] | ['1','2','3'] | [{name:'xx',disabled:true}]
 * @property {string}				keyName		数据为对象时的自定义键名，默认为name
 * @property {string|number}		height		整体高度
 * @property {boolean}				scrollable  是否允许滚动
 * @property {number}				tabIndex    tab所在位置，默认为0，外部设置时以外部为准
 * @property {string}				bcgColor	整体背景色，默认以父节点为准
 * @property {string}				lineColor   下划线的颜色
 * */
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';

import { addStyle, addUnit } from '@/utils/function';
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
}
const props = withDefaults(defineProps<propsInterface>(), {
	height: '72rpx',
	tabIndex: -1,
	keyName: 'name',
	bcgColor: 'inherit',
	lineColor: 'blue',
});

onMounted(async () => {
	await getAllItem();
	changeLine(currentIndex.value);
});

const emit = defineEmits<{
	(e: 'change', value: number): void;
	(e: 'update:tabIndex', value: number): void;
}>();

/** 自定义样式 */
const tabStyle = computed(() => {
	// if (props.customStyle) return addStyle(props.customStyle);
	return props.customStyle ? (addStyle(props.customStyle) as object) : {};
});
/** 组件高度 */
const heightVal = computed(() => {
	return addUnit(props.height);
});
/** 下划线宽度 */
const lineWidth = ref(24);
/** 下划线的位置 */
const lineOffsetLeft = ref(0);

interface TabItems {
	width: number;
}
/** 列表的元素 */
const tabItems = ref<TabItems[]>([]);
/** 实际激活的位置 */
const currentIndex = ref(props.tabIndex === -1 ? 0 : props.tabIndex);

// 点选tabs时进行数据更新
function selected(index: number, item: Tabs) {
	if (typeof item === 'object' && (item as Obj)?.disabled) {
		return;
	}
	emit('change', index);
	emit('update:tabIndex', index);
	if (props.tabIndex === -1) {
		currentIndex.value = index;
		changeLine(index);
	}
}

/**
 * 改变line的位置和宽度，不支持事实地切换屏幕宽度，刷新后可以重新生效
 * @param index 位置
 */
async function changeLine(index: number) {
	// 在选择后设置下划线的长度为元素的1/2
	lineWidth.value = (await queryRect(`#tab-item-${index}`)).width / 2;
	let left = 0;
	for (let i = 0; i <= index; i++) {
		left += tabItems.value[i]?.width || 0;
		// if (tabItems.value[i]) {
		// 	left += (tabItems.value[i]?.width as number) || 0;
		// }
	}
	lineOffsetLeft.value = left - ((tabItems.value[index]?.width as number) || 0) / 2 - lineWidth.value / 2;
}

// 获取所有tab元素的属性
function getAllItem() {
	// 增加限定，避免穿透（测试发现似乎不会穿透到父组件，以防万一）
	return queryRect('.tabs-item .tab-item', true).then((res) => {
		tabItems.value = (res as unknown as WechatMiniprogram.BoundingClientRectCallbackResult[]).map((v) => {
			return {
				width: v.width,
			};
		});
		return res;
	});
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

/**
 * 简化获取元素信息的方法
 * @param el 元素的样式
 * @param all 获取全部或单个
 */
function queryRect(el: string, all?: boolean): Promise<WechatMiniprogram.BoundingClientRectCallbackResult> {
	return new Promise((resolve) => {
		uni
			.createSelectorQuery()
			.in(instance)
			[all ? 'selectAll' : 'select'](el)
			// .select(el)
			.boundingClientRect((rect) => {
				resolve(rect as WechatMiniprogram.BoundingClientRectCallbackResult);
			})
			.exec();
	});
}

watch(
	() => props.tabIndex,
	(nweV) => {
		// 如果父组件的index和内部index不同，则使用父组件的index，并且更新内容
		if (nweV !== currentIndex.value) {
			currentIndex.value = nweV;
			changeLine(nweV);
		}
	}
);
</script>
<script lang="ts">
export default {
	name: 'XyTabs',
};
</script>
<style lang="scss" scoped>
.xy-tabs {
	position: relative;
	overflow-y: hidden;
	height: v-bind(heightVal);
	background-color: v-bind('props.bcgColor');
	// 隐藏滚动条
	// ::-webkit-scrollbar {
	// 	display: none;
	// 	width: 0 !important;
	// 	height: 0 !important;
	// }
	.tabs-item {
		position: relative;
		white-space: nowrap;
		box-sizing: border-box;
		.tab-item {
			position: relative;
			padding: 0 12rpx;
			text-align: center;
			&.active {
				font-size: 30rpx;
				font-weight: bold;
			}
			&.disabled {
				font-weight: 400 !important;
				color: #cccccc !important;
				cursor: not-allowed;
			}
		}
		.nav-line {
			position: absolute;
			bottom: 4rpx;
			height: 6rpx;
			border-radius: 200rpx;
			// background: blue;
			// transition-duration: 300ms;
			// transition: width 300ms;
			transition: all 300ms;
			transition-property: transform;
		}
	}
	.tab-flex {
		display: flex;
		justify-content: space-around;
	}
	// 居左显示item,支持水平滑动
	.tabs-scroll {
		.tab-item {
			display: inline-block;
		}
	}
}
</style>

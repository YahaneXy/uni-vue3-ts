<template>
	<view
		class="tabbar xy-border-top"
		:class="[position === 'bottom' && ['on-bottom', 'w100'], fixed && 'fiexd']"
		:style="{ background: background, zIndex, opacity: loaded ? 1 : 0, transition: 'all 500ms' }"
	>
		<view class="tab-content flex flex-a">
			<view
				v-for="(item, index) in barList"
				:key="item.pagePath"
				class="tab-item flex flex-dr flex-jc-sb flex1"
				:style="{ top: top }"
				@click="switchTab(item, index)"
			>
				<image
					class="x-center"
					:class="[midButton && item.midButton ? ['mid-button'] : 'icon']"
					:style="imgStyle"
					mode="heightFix"
					:src="index === currentIndex ? item.selectedIconPath : item.iconPath"
				></image>
				<view
					class="text x-center"
					:style="{ color: index === currentIndex ? activeColor : inactiveColor, fontWeight: index === currentIndex ? 'bold' : 400, ...iconStyle }"
					>{{ item.text }}</view
				>
			</view>
			<view
				v-if="midButton"
				class="mid-border xy-border"
				:style="{
					backgroundColor: background,
					left: midButtonLeft,
				}"
			>
			</view>
		</view>
		<view v-if="safeAreaInsetBottom" class="safe-bottom"></view>
	</view>
</template>
<script lang="ts" setup>
/**
 * @property {BarList} 				barList					数据列表，见下列接口
 * @property {boolean}				safeAreaInsetBottom		是否有底部安全区域
 * @property {string}				position				所在位置，目前只支持bottom（2023-8-29）
 * @property {boolean}				fixed					是否是fixed
 * @property {string}				iconSize				图标大小
 * @property {string}				fontsize				文字大小
 * @property {string}				top						图标和文字离顶部的距离，默认0
 * @property {number}				currentIndex			当前激活的下标
 * @property {string}				activeColor				激活的颜色
 * @property {string}				inactiveColor			未激活的颜色
 * @property {string}				background				背景色
 * @property {boolean}				switchDisabled			是否禁止跳转
 * @property {boolean | number}		height					是否禁止跳转
 * @property {boolean}				fadeInAnime				显示加载时的过度动画
 * @event beforeSwitch 切换页面前的事件，必须返回一个布尔值，为true时才允许切换
 */

import { tabBar } from '@/pages.json';
import { addUnit } from '@/utils/function';

uni.hideTabBar();
interface BarList {
	iconPath: string;
	selectedIconPath: string;
	text: string;
	pagePath: string;
	midButton?: boolean;
}
interface TabbarProps {
	barList?: BarList[];
	safeAreaInsetBottom?: boolean;
	position?: string;
	fixed?: boolean;
	iconSize?: string;
	fontSize?: string;
	top?: string;
	currentIndex?: number;
	activeColor?: string;
	inactiveColor?: string;
	background?: string;
	switchDisabled?: boolean;
	height?: string | number;
	beforeSwitch?: () => boolean | Promise<boolean>;
	imgMode: string;
	zIndex: number | string;
	fadeInAnime: boolean;
}
const props = withDefaults(defineProps<TabbarProps>(), {
	safeAreaInsetBottom: true,
	position: 'bottom',
	fixed: true,
	iconSize: '20px',
	fontSize: '12px',
	top: '0px',
	currentIndex: 0,
	barList: () => tabBar.list,
	inactiveColor: '#333333',
	activeColor: 'var(--color-6)',
	background: '#ffffff',
	height: '50px',
	imgMode: 'scaleToFill',
	zIndex: 1,
	fadeInAnime: false,
});

onLoad(() => {
	getMidButtonLeft();
	loaded.value = true;
});

const loaded = ref(false);

const midButton = ref(props.barList.filter((v) => v.midButton).length > 0);
// 大图标居中值，需要同时跟css设置，否则位置会有偏差
const midButtonLeft = ref('50%');

const imgStyle = computed(() => {
	const customStyle = <
		{
			width?: string;
			height?: string;
			[index: string]: string | undefined;
		}
	>{};
	customStyle.width = addUnit(props.iconSize);
	customStyle.height = addUnit(props.iconSize);
	return customStyle;
});
const iconStyle = computed(() => {
	interface Style {
		fontSize?: string;
		lineHeight?: string;
		fontWeight?: string;
		[index: string]: string | undefined;
	}
	const customStyle: Style = {};
	customStyle.fontSize = addUnit(props.fontSize);
	customStyle.lineHeight = addUnit(props.fontSize);
	// customStyle.fontWeight = 'normal';
	return customStyle;
});
const barHeight = computed(() => addUnit(props.height));

function getMidButtonLeft() {
	const windowWidth = uni.getSystemInfoSync().windowWidth;
	midButtonLeft.value = windowWidth / 2 + 'px';
}

// 切换页面
async function switchTab(item: BarList, index: number) {
	if (index === props.currentIndex) return;
	let enableSwitch = true;
	if (typeof props.beforeSwitch === 'function') {
		enableSwitch = await props.beforeSwitch();
	} else {
		enableSwitch = props.beforeSwitch || true;
	}
	if (props.switchDisabled || !enableSwitch) {
		return;
	}
	uni.switchTab({
		url: `/${item.pagePath}`,
	});
}
</script>
<script lang="ts">
export default {
	name: 'XyTabbar',
};
</script>

<style lang="scss" scoped>
.tabbar {
	// min-height: 50px;
	height: auto;
	.tab-content {
		position: relative;
		// height: 50px;
		height: v-bind(barHeight);
		.tab-item {
			// text-align: center;
			position: relative;
			// z-index: 10;
			height: 100%;
			background: v-bind('props.background');
			.icon {
				top: 14rpx;
			}
			.text {
				bottom: 14rpx;
			}
		}
	}
}
.on-bottom {
	bottom: 0;
}
.fiexd {
	position: fixed;
}
.mid-button {
	top: -40rpx;
	z-index: 4;
	width: 90rpx !important;
	height: 90rpx !important;
}
.mid-border {
	position: absolute;
	top: -50rpx;
	left: 50%;
	z-index: 3;
	width: 110rpx;
	height: 110rpx;
	border-radius: 100%;
	transform: translateX(-50%);
	&::after {
		border-radius: 100px;
	}
}
.x-center {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}
// .safe-bottom {
// 	width: 100%;
// 	height: calc(constant(safe-area-inset-bottom));
// 	height: calc(env(safe-area-inset-bottom));
// }
</style>

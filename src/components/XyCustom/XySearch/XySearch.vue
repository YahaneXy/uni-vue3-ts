<template>
	<view class="flex flex-a flex1">
		<view
			class="xy-search"
			:style="{ borderRadius: isShape, height: addUnit(height), backgroundColor: bcgColor, border: isBorder ? `solid 1rpx ${borderColor}` : '0rpx' }"
		>
			<template v-if="showLeft">
				<image v-if="isImg(iconType)" style="width: 14px; height: 14px" :src="iconType"></image>
				<icon v-else class="xy-search-icon" :type="iconType" :size="addUnit(iconSize)" :color="iconColor"></icon>
			</template>
			<input
				v-model="inputer"
				class="xy-input"
				type="text"
				:placeholder="placeholder ? placeholder : '请输入内容'"
				:placeholder-style="placeholderStyle"
				:style="{
					color,
				}"
				:disabled="disabled"
				@input="valueChange"
				@confirm="onConfirm"
				@focus="handleFocus"
				@blur="handleBlur"
			/>
			<view
				v-show="showClearIcon && inputer && (keepClearShow ? true : clearIconInnerShow)"
				class="xy-search-icon-clear flex flex-a"
				@click="clearInput"
			>
				<icon type="clear" :size="addUnit(clearIconSize)" :color="clearIconColor" />
			</view>
			<!-- 分割线 -->
			<view v-if="showDivider" class="xy-search-divider" :style="dividerStyle"></view>
			<!-- 内部的搜索按钮 -->
			<view
				v-if="actionShow && !actionOutLayer"
				class="xy-search-action"
				:style="actionStyle"
				hover-class="xy-search-action-hover"
				hover-stay-time="100"
				@click="onSearch"
				>{{ actionText }}</view
			>
		</view>
		<!-- 外部的搜索按钮 -->
		<view
			v-if="actionShow && actionOutLayer"
			class="xy-search-action"
			:style="actionStyle"
			hover-class="xy-search-action-hover"
			hover-stay-time="100"
			@click="onSearch"
			>{{ actionText }}</view
		>
	</view>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { addStyle, addUnit } from '@/utils/function';
import { isObject } from '@/utils/function/test';

const $common = inject<CustomInterface.Common>('$common')!;

/**
 * search 搜索框
 * @description 简单的自定义搜索框
 * @property {String}				modelValue				输入框绑定值
 * @property {String}				bcgColor				背景色
 * @property {String}				color					字体颜色
 * @property {String}				placeholder				占位文字内容（默认为“请输入内容”）
 * @property {String}				placeholderStyle		占位文字样式，只支持字符串
 * @property {Boolean}				showLeft				是否显示左侧图标
 * @property {String}				iconColor				左侧图标颜色
 * @property {String}				iconSize				左侧图标大小
 * @property {String}				iconType				左侧图标，参照https://uniapp.dcloud.net.cn/component/icon.html#，可以是图片
 * @property {String}				isBorder				是否显示border
 * @property {String}				borderColor				border颜色
 * @property {Boolean}				actionShow				是否显示右侧的“搜索”控件
 * @property {Boolean}				showDivider				是否显示右侧控件的分割线
 * @property {Boolean}				dividerColor			右侧分割线颜色
 * @property {Boolean}				dividerCustomStyle		右侧分割线自定义样式
 * @property {Boolean}				actionColor				右侧搜索控件颜色
 * @property {Boolean}				actionOutLayer			右侧搜索控件是否显示在外侧
 * @property {String|Object}		actionCustomStyle		右侧搜索控件的自定义样式
 * @property {String}				actionText				右侧搜索控件文字
 * @property {Boolean}				shape					search框的形状，square方形，round圆形
 * @property {Boolean}				showClearIcon			是否显示清除按钮
 * @property {Boolean}				clearIconColor			清除按钮的颜色
 * @property {Boolean}				clearIconSize			清除按钮的大小
 * @property {Boolean}				keepClearShow			只要有文本内容，就保持显示清除按钮，无需聚焦
 * @property {Number|String}		height					整体高度
 *
 * @event    #search search事件，用户触发回车或者点击输入框右下角的“搜索时”会触发，并将输入框中的内容返回回去
 * @event    #clear  触发清除图标事件
 * @event    #focus  聚焦、失焦时触发
 */

const props = withDefaults(
	defineProps<{
		modelValue?: string;
		bcgColor?: string;
		color?: string;
		placeholder?: string;
		placeholderStyle?: string;
		showLeft?: boolean;
		iconColor?: string;
		iconSize?: string | number;
		/** 图标类型，支持类型https://uniapp.dcloud.net.cn/component/icon.html */
		iconType?: string;
		/** 显示边框 */
		isBorder?: boolean;
		/** 边框颜色 */
		borderColor?: string;
		/** 显示搜索 */
		actionShow?: boolean;
		/** 搜索按钮字体颜色 */
		actionColor?: string;
		actionOutLayer?: boolean;
		actionCustomStyle?: string | object;
		// 右侧分割线
		showDivider?: boolean;
		dividerColor?: string;
		dividerCustomStyle?: CSSProperties;
		// 形状
		shape?: 'square' | 'round';
		// 是否显示清除
		showClearIcon?: boolean;
		clearIconColor?: string;
		clearIconSize?: string | number;
		keepClearShow?: boolean;
		height?: string | number;
		actionText?: string;
		disabled?: boolean;
	}>(),
	{
		modelValue: '',
		bcgColor: '#ffffff',
		color: '#000',
		showLeft: true,
		isBorder: true,
		borderColor: '#cccccc',
		// 右侧搜索
		actionShow: true,
		actionColor: '#000',
		actionBorderColor: '#ccc',
		actionOutLayer: false,
		actionCustomStyle: '',
		// 右侧分割线
		dividerColor: '#000',
		iconType: 'search',
		iconColor: '#999',
		shape: 'round',
		placeholderStyle: 'color: #999999',
		iconSize: 30,
		showClearIcon: true,
		clearIconColor: '#ccc',
		clearIconSize: 30,
		height: '64rpx',
		actionText: '搜索',
		disabled: false,
	}
);
const inputer = ref('');
const isFocus = ref(false);
const clearIconInnerShow = ref(false);
const actionStyle = computed(() => {
	const radius = props.shape === 'square' ? '10rpx' : '40rpx';
	let style = {
		borderRadius: `0 ${radius} ${radius} 0`,
		height: props.height || '1.8rem',
		lineHeight: props.height || '1.8rem',
		color: props.actionColor,
	};
	if (props.actionOutLayer) {
		const defaultActionStyle = {
			border: 'solid 1rpx #ccc',
			background: '#fff',
			// height: '1.8rem',
			// lineHeight: '1.8rem',
			marginLeft: '10rpx',
		};
		style.borderRadius = '10rpx';
		style = Object.assign(style, defaultActionStyle);
	}
	if (isObject(props.actionCustomStyle)) {
		return addStyle($common.deepMerge(style, props.actionCustomStyle as object)) as string;
	}
	const custom = addStyle(props.actionCustomStyle as object) || {};
	return $common.deepMerge(style, custom as object);
});
const isShape = computed(() => {
	return props.shape === 'square' ? '10rpx' : '40rpx';
});

const dividerStyle = computed(() => {
	const style: CSSProperties = {
		borderColor: props.dividerColor,
	};
	if (isObject(props.dividerCustomStyle)) {
		return addStyle($common.deepMerge(style, props.dividerCustomStyle as object)) as string;
	}
	const custom = addStyle(props.dividerCustomStyle as object) || {};
	return $common.deepMerge(style, custom as object);
});

const emit = defineEmits<{
	(e: 'search', value: string): void;
	(e: 'update:modelValue', value: string): void;
	(e: 'clear'): void;
	(e: 'focus', value: boolean): void;
}>();

function handleBlur() {
	isFocus.value = false;
}
function handleFocus() {
	isFocus.value = true;
}

// 旧方法
function valueChange(e: any) {
	const value = e.detail.value;
	emit('update:modelValue', value);
}
// 旧方法
function onConfirm(e: any) {
	emit('search', e.detail.value);
}

function onSearch() {
	if (props.disabled) return;
	emit('search', props.modelValue);
}

function clearInput() {
	if (props.disabled) return;
	inputer.value = '';
	emit('clear');
	emit('update:modelValue', '');
}
watch(
	() => props.modelValue,
	(value) => {
		if (value !== inputer.value) {
			inputer.value = value;
		}
	}
);
let timer: ReturnType<typeof setTimeout> | null = null;
watch(
	() => isFocus.value,
	(value) => {
		if (!value) {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			timer = setTimeout(() => {
				clearIconInnerShow.value = false;
			}, 50);
		} else {
			clearIconInnerShow.value = true;
		}
	}
);
// 方法
// 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
function isImg(value: string) {
	return value.indexOf('/') !== -1;
}
</script>
<script lang="ts">
export default {
	name: 'XySearch',
	// options: {
	// 	styleIsolation: 'shared', // 启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
	// },
};
</script>
<style lang="scss" scoped>
.xy-search {
	display: flex;
	align-items: center;
	// height: 64rpx;
	// background-color: v-bind('props.bcgColor');
	padding-left: 20rpx;
	width: 100%;
	// border: solid #cccccc 1rpx;
	// :deep(.xy-input) {
	// 	padding: 0 !important;
	// 	border-radius: 0 40rpx 40rpx 0 !important;
	// 	// .icon-clear {
	// 	// 	// padding: 0 20rpx;
	// 	// 	padding-left: 20rpx;
	// 	// }
	// }
	// .icon-clear {
	// 	padding: 0 20rpx;
	// 	height: 100%;
	// }
	// .pr20 {
	// 	padding-right: 20rpx;
	// }
	.xy-search-icon {
		margin-right: 10rpx;
	}
	.xy-input {
		// height: 2rem;
		height: 100%;
		font-size: 28rpx;
		flex: 1;
	}
	.xy-search-icon-clear {
		// padding: 0 0 0 rpx;
		// padding-left: 20rpx;
		padding: 10rpx;
		height: 100%;
	}
}
.xy-search-action {
	width: 90rpx;
	// height: 2rem;
	// line-height: 2rem;
	text-align: center;
	transition: all 50ms;
}
.xy-search-action-hover {
	background: #cccccc;
	opacity: 0.75;
}
.xy-search-divider {
	margin-right: -0.5px;
	height: 80%;
	// border-color: #004997 !important;
	border-left-style: solid;
	border-left-width: 0.5px !important;
}
</style>

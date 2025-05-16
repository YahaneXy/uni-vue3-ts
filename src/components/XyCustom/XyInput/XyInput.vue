<template>
	<view class="xy-input" :class="[isBorder && 'border']" :style="getStyle()">
		<input
			v-model="inputer"
			class="input"
			:type="type"
			:style="{ height: addUnit(height) }"
			:placeholder="placeholder ? placeholder : '请输入内容'"
			:placeholder-style="placeholderStyle"
			:maxlength="Number(maxLength) || -1"
			@input="valueChange"
			@confirm="onConfirm"
			@focus="focus"
			@blur="blur"
		/>
		<slot name="right"></slot>
		<view v-show="clearable && inputer && (keepClearShow ? true : isFocus)" class="icon-clear flex flex-a" @click="clearInput">
			<icon type="clear" :size="clearIconSize" :color="clearIconColor" />
		</view>
	</view>
</template>
<script lang="ts" setup>
/**
 * search 搜索框
 * @description 简单的自定义搜索框
 * @property {String}				modelValue				输入框绑定值
 * @property {String}				bcgColor				背景色
 * @property {String}				placeholder				占位文字内容（默认为“请输入内容”）
 * @property {String}				placeholderStyle		占位文字样式，只支持字符串
 * @property {String|CSSProperties}	customStyle				自定义style
 * @property {String}				isBorder				是否显示border
 * @property {String}				borderColor				border颜色
 * @property {Boolean}				shape					input框的形状，square方形，round圆形
 * @property {Number}				round					border-radius的值，如果有该值，则shape无效
 * @property {Boolean}				clearable				是否显示清除按钮
 * @property {Boolean}				clearIconColor			清除按钮的颜色
 * @property {Boolean}				clearIconSize			清除按钮的大小
 * @property {Number|String}		height					整体高度
 * @property {Boolean}				keepClearShow			只要有文本内容，就保持显示清除按钮，无需聚焦
 * @property {Boolean}				errorColor				Form组件错误时的颜色
 * @property {Boolean}				changeBorderWhenError	Form组件错误时，是否改变边框颜色
 * @property {String}				maxLength				输入框最大长度
 * @property {String}				type					输入框类型，string、password、number
 *
 * @event    #change 输入框内容变化时触发，返回输入框内容
 * @event    #search search事件，用户触发回车或者点击输入框右下角的“搜索时”会触发，并将输入框中的内容返回回去
 * @event    #clear  触发清除图标事件
 * @event    #focus  聚焦、失焦时触发
 */

import type { CSSProperties } from 'vue';

import { deepMerge } from '@/utils/common';
import { addStyle, addUnit } from '@/utils/function';

import { xyFormItemsContextKey } from '../XyForm/constants';
interface PropsInterface {
	modelValue?: string | number;
	bcgColor?: string;
	placeholder?: string;
	placeholderStyle?: string;
	customStyle?: CSSProperties | string;
	isBorder?: boolean;
	// 形状
	shape?: 'square' | 'round';
	round?: string | number; // 如果是round，round的数值
	// 是否显示清除
	clearable?: boolean;
	clearIconColor?: string;
	clearIconSize?: string | number;
	height?: string | number;
	maxLength?: string | number;
	type?: 'string' | 'password' | 'number';
	keepClearShow?: boolean;
	errorColor?: string;
	changeBorderWhenError?: boolean;
}
const props = withDefaults(defineProps<PropsInterface>(), {
	bcgColor: '#fff',
	height: '64rpx',
	clearable: true,
	clearIconColor: '#ccc',
	clearIconSize: 16,
	isBorder: true,
	customStyle: '',
	keepClearShow: true,
	errorColor: 'var(--error-color)',
	type: 'string',
	changeBorderWhenError: true,
});
const formItem = inject(xyFormItemsContextKey, undefined);
// onMounted(() => {
// 	console.log('rule', getStyle());
// });
const inputer = ref<string | number>('');
const isFocus = ref(false);
const isRound = computed(() => {
	if (props.round) {
		return addUnit(props.round);
	}
	return props.shape === 'round' ? '40rpx' : '10rpx';
});

const getStyle = () => {
	const style: CSSProperties = {};
	style.borderRadius = isRound.value;
	style.height = addUnit(props.height);
	style.backgroundColor = props.bcgColor;
	style.padding = props.isBorder ? '0 20rpx' : '0';
	let cusStyle: CSSProperties = {};
	if (formItem?.validateState === 'error') {
		style.borderColor = props.errorColor;
	}
	if (typeof props.customStyle === 'string') {
		cusStyle = <CSSProperties>addStyle(props.customStyle);
	}
	return deepMerge(style, cusStyle || {});
};

/** 变化是否来源内部 */
// const changeFromInner = ref(false);

const emit = defineEmits<{
	(e: 'on-confirm', value: string): void;
	(e: 'on-change', value: string): void;
	(e: 'update:modelValue', value: string): void;
	(e: 'clear'): void;
	(e: 'focus'): void;
	(e: 'blur'): void;
}>();
function valueChange(e: any) {
	if (props.modelValue !== undefined) {
		const value = (e as unknown as WechatMiniprogram.CustomEvent).detail.value;
		emit('update:modelValue', value);
		emit('on-change', value);
	}
	const changeTrigger = formItem?.rule?.some((v) => v.trigger === 'change');
	if (changeTrigger) {
		formItem?.validate('change');
	}
}

function onConfirm(e: WechatMiniprogram.CustomEvent) {
	emit('on-confirm', e.detail.value);
}
function clearInput() {
	inputer.value = '';
	valueChange({ detail: { value: '' } });
	emit('clear');
	emit('update:modelValue', '');
}

/**
 * 输入框聚焦
 */
function focus() {
	isFocus.value = true;
	emit('focus');
}
/**
 * 输入框失焦
 */
async function blur() {
	const blurTrigger = formItem?.rule?.some((v) => v.trigger === 'blur');
	if (blurTrigger) {
		formItem?.validate('blur');
	}
	isFocus.value = false;
	emit('blur');
}
watch(
	() => props.modelValue,
	(value) => {
		inputer.value = value!;
	}
);
</script>
<script lang="ts">
export default {
	options: {
		virtualHost: true,
	},
};
</script>
<style lang="scss" scoped>
.xy-input {
	display: flex;
	align-items: center;
	width: 100%;
	.input {
		// height: 2rem;
		font-size: 28rpx;
		flex: 1;
	}
	.icon-clear {
		padding-left: 24rpx;
		height: 100%;
	}
}
.border {
	border: solid 1rpx #cccccc;
}
</style>

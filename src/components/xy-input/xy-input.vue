<template>
	<view
		class="xy-input"
		:class="[isBorder && 'border']"
		:style="{ borderRadius: isRound, height: addUnit(height), backgroundColor: bcgColor, padding: isBorder ? '0 20rpx' : '0' }"
	>
		<input
			v-model="inputer"
			type="text"
			:style="{ height: addUnit(height) }"
			:placeholder="placeholder ? placeholder : '请输入内容'"
			:placeholder-style="placeholderStyle"
			:maxlength="Number(maxLength) || -1"
			@input="valueChange"
			@confirm="onConfirm"
			@focus="focus"
			@blur="blur"
		/>
		<view v-show="clearable && inputer && isFocus" class="icon-clear flex flex-a" @click="clearInput">
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
 * @property {String}				isBorder				是否显示border
 * @property {String}				borderColor				border颜色
 * @property {Boolean}				shape					input框的形状，square方形，round圆形
 * @property {Boolean}				clearable				是否显示清除按钮
 * @property {Boolean}				clearIconColor			清除按钮的颜色
 * @property {Boolean}				clearIconSize			清除按钮的大小
 * @property {Number|String}		height					整体高度
 *
 * @event    #search search事件，用户触发回车或者点击输入框右下角的“搜索时”会触发，并将输入框中的内容返回回去
 * @event    #clear  触发清除图标事件
 * @event    #focus  聚焦、失焦时触发
 */

import { addUnit } from '@/utils/function';
interface PropsInterface {
	modelValue?: string;
	bcgColor?: string;
	placeholder?: string;
	placeholderStyle?: string;
	isBorder?: boolean;
	// 形状
	shape?: 'square' | 'round';
	// 是否显示清除
	clearable?: boolean;
	clearIconColor?: string;
	clearIconSize?: string | number;
	height?: string | number;
	maxLength?: string | number;
}
const props = withDefaults(defineProps<PropsInterface>(), {
	bcgColor: '#fff',
	height: '64rpx',
	clearable: true,
	clearIconColor: '#ccc',
	clearIconSize: 16,
	isBorder: true,
});
watch(
	() => props.modelValue,
	(value) => {
		inputer.value = value!;
	}
);
const inputer = ref('');
const isFocus = ref(false);
const isRound = computed(() => {
	return props.shape === 'square' ? '40rpx' : '10rpx';
});
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
	// changeFromInner.value = true;
	if (props.modelValue !== undefined) {
		const value = (e as unknown as WechatMiniprogram.CustomEvent).detail.value;
		emit('update:modelValue', value);
		emit('on-change', value);
	}
}

function onConfirm(e: WechatMiniprogram.CustomEvent) {
	emit('on-confirm', e.detail.value);
}
function clearInput() {
	inputer.value = '';
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
function blur() {
	isFocus.value = false;
	emit('blur');
}
</script>

<style lang="scss" scoped>
.xy-input {
	display: flex;
	align-items: center;
	width: 100%;
	input {
		// height: 2rem;
		font-size: 28rpx;
		flex: 1;
	}
	.icon-clear {
		height: 100%;
	}
}
.border {
	border: solid 1rpx #cccccc;
}
</style>

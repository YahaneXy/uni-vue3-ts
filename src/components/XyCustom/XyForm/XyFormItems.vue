<template>
	<view ref="formItemRef" class="form-item" :class="[required && label && 'required']" :style="getItemStyle">
		<view v-if="showLabel && label" class="form-label" :style="getLabelStyle">{{ label }}</view>
		<view class="form-item-slot w100">
			<slot></slot>
			<view class="form-item-error" :style="getStyle()">{{ validateErrorMsg }}</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { addUnit } from '@/utils/function';

import { xyFormContextKey, xyFormItemsContextKey } from './constants';
import type { validateParams, XyFormItemContext } from './types';
import { xyFormItemsProps, type XyFormItemValidateState } from './XyFormItems';
onMounted(() => {
	formContext?.addField(expose);
	const rule = getRules();
	if (rule.length) {
		required.value = rule.some((item) => item.required) && props.showRequired;
	}
});
const formContext = inject(xyFormContextKey, undefined);
const props = defineProps(xyFormItemsProps);
const validateErrorMsg = ref('');
const validateState = ref<XyFormItemValidateState>('');
const innerLabelWidth = computed(() => {
	let width: number | string = 0;
	if (formContext?.labelWidth) {
		width = formContext?.labelWidth;
	}
	if (props.labelWidth) {
		width = props.labelWidth;
	}
	return width;
});
const getItemStyle = computed(() => {
	const style: CSSProperties = {};
	if (props.labelPosition === 'left') {
		style.alignItems = 'center';
	}
	if (props.labelPosition === 'top') {
		style.flexDirection = 'column';
		style.rowGap = addUnit(props.labelGap);
	}
	return style;
});
const getLabelStyle = computed(() => {
	const style: CSSProperties = {};
	style.width = addUnit(innerLabelWidth.value);
	return style;
});
function validate(status?: validateParams): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const rule = getRules();
		const { prop } = props;
		const value = formContext?.modelValue[prop];
		validateState.value = 'validating';
		if (!rule.length) {
			resolve(true);
			return true;
		}
		for (const item of rule) {
			if (item.required) {
				if (!value) {
					validateErrorMsg.value = item.message || `${prop}不能为空`;
					reject({ prop, ...item });
					validateState.value = 'error';
					return false;
				}
			}
			if (item.pattern) {
				if (!item.pattern.test(value)) {
					validateErrorMsg.value = item.message || `${prop}格式不正确`;
					reject({ prop, ...item });
					validateState.value = 'error';
					return false;
				}
			}
		}
		validateState.value = 'success';
		resolve(true);
		return true;
	});
}
const context = reactive({
	$el: getCurrentInstance(),
});
const required = ref(false);
const getRules = () => {
	const { prop } = props;
	if (prop && formContext?.rules) {
		const rule = formContext?.rules[prop];
		if (!rule && process.env.NODE_ENV === 'development') {
			console.warn(`表单${prop}没有对应的校验规则`);
		}
		return rule || [];
	}
	return [];
};
const getStyle = () => {
	if (validateState.value !== 'error') {
		return '';
	}
	return 'opacity: 1;transform: translate(-50%, 0)';
};
const expose: XyFormItemContext = reactive({
	...context,
	...toRefs(props),
	validate,
	validateState,
	rule: getRules(),
});
provide(xyFormItemsContextKey, expose);

defineExpose(expose);
</script>
<script lang="ts">
export default {
	options: {
		virtualHost: true,
	},
};
</script>
<style scoped lang="scss">
.form-item {
	position: relative;
	display: flex;
	padding: 16rpx 0;
	.form-label {
		flex-shrink: 0;
	}
	.form-item-slot {
		position: relative;
	}
	.form-item-error {
		position: absolute;
		left: 50%;
		font-size: 24rpx;
		white-space: nowrap;
		color: red;
		opacity: 0;
		transition:
			transform 0.3s,
			opacity 0.1s;
		transform: translate(-50%, -50%);
	}
}
</style>

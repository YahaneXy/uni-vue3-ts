import { makeStringProp } from '../common/XyProps';

export const xyFormItemValidateStates = ['', 'error', 'validating', 'success'] as const;
export type XyFormItemValidateState = (typeof xyFormItemValidateStates)[number];
export type LablePosition = 'left' | 'top';
export const xyFormItemsProps = {
	// 表单项的label
	label: {
		type: String,
		default: '',
	},
	/**
	 * label的宽度，可在form中统一配置，设置该值时优先使用该值
	 */
	labelWidth: {
		type: [String, Number],
	},
	showLabel: {
		type: Boolean,
		default: true,
	},
	prop: {
		type: String,
		default: '',
	},
	/**
	 * 是否显示必填
	 */
	showRequired: {
		type: Boolean,
		default: true,
	},
	/**
	 * 表单label的位置，可选值为left、top
	 */
	labelPosition: makeStringProp<LablePosition>('left'),
	/**
	 * label与插槽之间的间距，仅在labelPosition为top时有效
	 */
	labelGap: {
		type: [String, Number],
		default: 8,
	},
};
export type XyFormItemsProps = ExtractPropTypes<typeof xyFormItemsProps>;

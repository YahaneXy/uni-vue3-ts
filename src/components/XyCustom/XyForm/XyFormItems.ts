export const xyFormItemValidateStates = ['', 'error', 'validating', 'success'] as const;
export type XyFormItemValidateState = (typeof xyFormItemValidateStates)[number];

export const xyFormItemsProps = {
	// 表单项的label
	label: {
		type: String,
		default: '',
	},
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
	showRequired: {
		type: Boolean,
		default: true,
	},
};
export type XyFormItemsProps = ExtractPropTypes<typeof xyFormItemsProps>;

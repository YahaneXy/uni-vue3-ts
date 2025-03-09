import { type ExtractPropTypes } from 'vue';

import { type XyFormRules } from './types';
export const definePropType = <T>(val: any): PropType<T> => val;
export const xyFormProps = {
	modelValue: {
		type: Object,
		default: () => ({}),
	},
	rules: {
		type: definePropType<XyFormRules<any>>(Object),
	},
	labelWidth: {
		type: [String, Number],
		default: 160,
	},
};

export type XyFormProps = ExtractPropTypes<typeof xyFormProps>;

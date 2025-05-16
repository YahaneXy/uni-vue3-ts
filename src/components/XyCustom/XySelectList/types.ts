import { type ExtractPropTypes } from 'vue';

export const xySelectListProps = {
	// 列表数据
	listData: {
		type: Array,
		default: () => [],
	},
	// 每行间距
	gap: {
		type: [String, Number],
		default: 10,
	},
	showSelector: {
		type: Boolean,
		default: true,
	},
	// 选中时的颜色
	activeColor: {
		type: String,
		default: 'var(--color-main)',
	},
	// 未选中时的颜色
	inactiveColor: {
		type: String,
		default: '#999999',
	},
	// 选中时的边框颜色
	activeBorderColor: {
		type: String,
		default: 'var(--color-main)',
	},
	// 未选中时的边框颜色
	inactiveBorderColor: {
		type: String,
		default: '#999999',
	},
	// 左边圆形选择器宽度
	selectorWidth: {
		type: [String, Number],
		default: 100,
	},
	// 边框样式
	border: {
		type: String,
		default: '1rpx solid #fff',
	},
	// 边框到圆形的间距
	selectorPadding: {
		type: [String, Number],
		default: '4rpx',
	},
	// 圆形选择器大小
	size: {
		type: [String, Number],
		default: '28rpx',
	},
};

export interface XySelectListContext {
	/**
	 * 选择全部
	 * @param selectAll 如果有传递该参数，true则全选，false则全不选，不传则切换
	 */
	handleSelectAll: (selectAll?: boolean) => void;
	/**
	 * 清除所有选中，可以在例如删除选中元素之后调用该函数
	 */
	handleClear: () => void;
}

export interface XySelectChangeParam<T = any> {
	items: T[];
	indexs: number[];
}

export type XySelectListEmits = (e: 'change', value: XySelectChangeParam) => void;

export type XySelectListProps = ExtractPropTypes<typeof xySelectListProps>;

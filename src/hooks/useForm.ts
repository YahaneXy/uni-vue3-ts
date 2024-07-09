// 重置表单
import { reactive } from 'vue';
export function useForm<T extends object>(formFunc: () => T) {
	const form = reactive(formFunc());

	const reset = (partialForm?: Partial<T>) => {
		Object.assign(form, formFunc(), partialForm);
	};
	return [form, { reset }] as const;
}

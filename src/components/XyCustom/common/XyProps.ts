export const makeStringProp = <T>(defaultVal: T) => ({
	type: String as unknown as PropType<T>,
	default: defaultVal,
});

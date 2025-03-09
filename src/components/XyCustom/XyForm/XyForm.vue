<template>
	<view><slot></slot> </view>
</template>

<script setup lang="ts">
import { xyFormContextKey } from './constants';
import type { /* FormResultType,  */ XyFormContext, XyFormItemContext } from './types';
import { xyFormProps } from './XyForm';

const props = defineProps(xyFormProps);
const fields: XyFormItemContext[] = [];
const addField: XyFormContext['addField'] = (field) => {
	fields.push(field);
};
async function validate<T extends boolean>(getError?: T): Promise<any> {
	let valid = true;
	const result: any[] = [];
	for (const field of fields) {
		try {
			await field.validate('');
		} catch (error) {
			result.push(error);
			valid = false;
		}
	}
	if (getError) {
		return result;
	} else {
		return valid;
	}
}
provide(
	xyFormContextKey,
	reactive({
		...toRefs(props),
		addField,
		validate,
	})
);
defineExpose({
	validate,
});
</script>
<script lang="ts">
export default {
	options: {
		virtualHost: true,
	},
};
</script>
<style scoped lang="scss"></style>

import type { InjectionKey } from 'vue';

import { type XyFormContext, type XyFormItemContext } from './types';

export const xyFormContextKey: InjectionKey<XyFormContext> = Symbol('XyFormKey');
export const xyFormItemsContextKey: InjectionKey<XyFormItemContext> = Symbol('XyFormItemsKey');

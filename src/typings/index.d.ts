import type * as CacheUtils from '@/utils/cache';
import type * as CommonUtils from '@/utils/common';

declare global {
	namespace CustomInterface {
		type Common = typeof CommonUtils;
		type Cache = typeof CacheUtils;
		// type Common = typeof import('@/utils/common.ts').default;
	}
}
type AnyObject = Record<string, any>;

export {};

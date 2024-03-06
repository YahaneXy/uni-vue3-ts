import type CommonUtils from '@/utils/common';
// import type CacheUtils from '@/utils/cache';

declare global {
	namespace CustomInterface {
		// type Common = typeof import('@/utils/common.ts').default;
		type Common = typeof CommonUtils;
		// type Cache = typeof import('@/utils/cache').default;
		// type Cache = typeof CacheUtils;
	}
}
type AnyObject = Record<string, any>;

export {};

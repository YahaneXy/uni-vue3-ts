// import type common from '@/utils/common';
// import type cache from '@/utils/cache.ts';
// import type common from '@/utils/common.ts';
type AnyObject = Record<string, any>;

declare namespace CustomInterface {
	/**
	 * /src/util/common.ts
	 */
	// interface anyObject {
	// 	[key: string]: any;
	// }
	type Common = typeof import('@/utils/common.ts').default;
	// type Common = typeof common;
	type Cache = typeof import('@/utils/cache').default;
	// interface Common {
	// 	// $common: typeof common;
	// 	config: {
	// 		appid: string;
	// 		url: string;
	// 	};
	// 	deepClone<T>(obj: T | T[]): T | T[];
	// 	deepMerge(target?: Obj, source?: Obj): Obj;
	// 	showModal(a: string, b: string): Promise<void>;
	// 	navBack(): void;
	// 	toast(title: string, duration?: number, mask?: boolean);
	// }
	// interface Cache {
	// 	put<T>(key: string, value: T, time?: number | string);
	// 	get<T>(key: string, def?: T);
	// 	remove(k: string);
	// }
}
// declare module '@vue/runtime-core' {
// 	interface TestCustom {
// 		Common: typeof common;
// 	}
// }

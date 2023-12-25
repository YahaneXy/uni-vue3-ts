import uni from '@dcloudio/vite-plugin-uni';
// https://vitejs.dev/config/
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [
		AutoImport({
			imports: ['vue', 'uni-app', 'pinia'],
			dts: 'src/auto-imports.d.ts',
			dirs: ['src/store'],
			eslintrc: {
				enabled: true,
				globalsPropValue: true,
			},
		}),
		uni(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@u': path.resolve(__dirname, 'src/utils'),
		},
	},
	/**
	 * 预加载css，可以直接全局使用@includes，但是会导致每个页面都增加相应的样式
	 * 在main中引入则不会
	 */
	// css: {
	// 	preprocessorOptions: {
	// 		scss: {
	// 			additionalData: '@import "./src/style/common.scss";',
	// 		},
	// 	},
	// },
});

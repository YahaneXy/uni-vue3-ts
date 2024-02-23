import './style/common.scss';

// import { createPinia } from 'pinia';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createSSRApp } from 'vue';

import App from './App.vue';
// const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);
import { store } from './stores';
import cache from './utils/cache';
import common from './utils/common';
// import shareMixin from './utils/shareMixin';
// const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);
export function createApp() {
	const app = createSSRApp(App);
	// app.use(pinia);
	app.use(store);
	// app.mixin(shareMixin);
	app.provide('$common', common);
	app.provide('$cache', cache);
	// app.config.globalProperties.$common = common;
	return {
		app,
	};
}

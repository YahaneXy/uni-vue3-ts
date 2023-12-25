export {};

declare module 'vue' {
	type Hooks = App.AppInstance & Page.PageInstance;
	// eslint-disable-next-line
	interface ComponentCustomOptions extends Hooks {}
}

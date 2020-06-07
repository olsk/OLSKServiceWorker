import RollupStart from './main.svelte';

const OLSKServiceWorker = new RollupStart({
	target: document.body,
	props: Object.assign({
		DebugEnableLogging: false,
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()))),
});

export default OLSKServiceWorker;

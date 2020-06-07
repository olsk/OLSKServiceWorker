<script>
export let registrationRoute = null;
export let DebugFakeUpdateAlertVisible = false;
export let DebugEnableLogging = true;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// VALUE

	_ValueUpdateAlertIsVisible: DebugFakeUpdateAlertVisible,

	// INTERFACE

	InterfaceReloadButtonDidClick() {
		mod.ControlSkipWaiting();
	},

	// CONTROL

	ControlSkipWaiting () {
		nextWorker.postMessage({
			action: 'skipWaiting',
		});
	},

	// SETUP

	async SetupEverything() {
		if (!navigator.serviceWorker) {
			return DebugEnableLogging && console.info('Service worker not available');
		}

		if (!registrationRoute) {
			return DebugEnableLogging && console.info('Missing registration route');
		}

		registration = await navigator.serviceWorker.register(registrationRoute);
		
		DebugEnableLogging && console.info('Service Worker Registered');

		registration.addEventListener('updatefound', handleUpdateFound);

		navigator.serviceWorker.addEventListener('controllerchange', function (event) {
			DebugEnableLogging && console.log('controllerchange', event);

			window.location.reload();
		});
	},

	// LIFECYCLE

	LifecycleModuleDidMount() {
		mod.SetupEverything();
	},

};

let registration, nextWorker;

function handleUpdateFound (event) {
	DebugEnableLogging && console.log('updatefound', event);

	nextWorker = registration.installing;

	nextWorker.addEventListener('statechange', function (event) {
		DebugEnableLogging && console.log('statechange', nextWorker.state, event, navigator.serviceWorker.controller);

		if (nextWorker.state !== 'installed') {
			return;
		}

		if (!navigator.serviceWorker.controller) {
			return;
		}

		mod._ValueUpdateAlertIsVisible = true;
	});
}

import { onMount } from 'svelte';
onMount(mod.LifecycleModuleDidMount);
</script>

{#if mod._ValueUpdateAlertIsVisible }
<div class="OLSKServiceWorkerUpdateAlert">
	<span class="OLSKServiceWorkerUpdateAlertLabel">{ OLSKLocalized('OLSKServiceWorkerUpdateAlertLabelText') }</span>
	<button class="OLSKServiceWorkerUpdateAlertReloadButton" on:click={ mod.InterfaceReloadButtonDidClick }>{ OLSKLocalized('OLSKServiceWorkerUpdateAlertReloadButtonText') }</button>
</div>
{/if}

<style type="text/css">
.OLSKServiceWorkerUpdateAlert {
	padding: 10px;
	border: 1px solid #7f7f7f;

	position: fixed;
	top: 0;
	right: 0;

	background: #f3f3f3;
	font-family: 'Helvetica Neue', 'Helvetica', sans-serif;
}
</style>

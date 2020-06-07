<script>
export let isDisabled = false;
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

	SetupEverything() {
		mod.SetupAlfa();
	},

	SetupAlfa() {
		
	},

	// LIFECYCLE

	LifecycleModuleDidLoad() {
		mod.SetupEverything();
	},

};

mod.LifecycleModuleDidLoad();

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

import { onMount, afterUpdate } from 'svelte';

onMount(async function StartSetup() {
	if (isDisabled) {
		return DebugEnableLogging && console.info('Service worker disabled');
	}

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
});
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

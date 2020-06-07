<script>
export let isDisabled = false;
export let registrationRoute = null;
export let DebugFakeUpdateAlertVisible = false;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// VALUE

	_ValueUpdateAlertIsVisible: DebugFakeUpdateAlertVisible,

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

let notificationElement, reloadButton, registration, nextWorker;

function handleUpdateFound (event) {
	console.log('updatefound', event);

	nextWorker = registration.installing;

	nextWorker.addEventListener('statechange', function (event) {
		console.log('statechange', nextWorker.state, event, navigator.serviceWorker.controller);

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
		return console.info('Service worker disabled');
	}

	if (!navigator.serviceWorker) {
		return console.info('Service worker not available');
	}

	if (!registrationRoute) {
		return console.info('Missing registration route');
	}

	registration = await navigator.serviceWorker.register(registrationRoute);
	
	console.info('Service Worker Registered');

	registration.addEventListener('updatefound', handleUpdateFound);

	navigator.serviceWorker.addEventListener('controllerchange', function (event) {
		console.log('controllerchange', event);

		window.location.reload();
	});
});

afterUpdate(function () {
	(function() {
		if (!notificationElement) {
			return;
		}

		notificationElement.addEventListener('click', function () {
			notificationElement.remove();
		});
	})();

	(function() {
		if (!reloadButton) {
			return;
		}

		reloadButton.addEventListener('click', function () {
			nextWorker.postMessage({
				action: 'skipWaiting',
			});
		});
	})();
});
</script>

{#if mod._ValueUpdateAlertIsVisible }
<div class="OLSKServiceWorkerUpdateAlert" bind:this={ notificationElement }>
	<span class="OLSKServiceWorkerUpdateAlertLabel">{ OLSKLocalized('OLSKServiceWorkerUpdateAlertLabelText') }</span>
	<button bind:this={ reloadButton }>{ OLSKLocalized('OLSKServiceWorkerReload') }</button>
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

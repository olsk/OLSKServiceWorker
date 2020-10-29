<script>
export let OLSKServiceWorkerRegistrationRoute;
export let DebugFakeUpdateAlertVisible = false;
export let DebugEnableLogging = true;
export let DebugAllowLocalhost = false;

import OLSKInternational from 'OLSKInternational';
const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, JSON.parse(`{"OLSK_I18N_SEARCH_REPLACE":"OLSK_I18N_SEARCH_REPLACE"}`)[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};

const mod = {

	// VALUE

	_ValueRegistration: undefined,

	_ValueNextWorker: undefined,

	_ValueUpdateAlertIsVisible: DebugFakeUpdateAlertVisible,

	// INTERFACE

	InterfaceReloadButtonDidClick() {
		mod.ControlSkipWaiting();
	},

	// CONTROL

	ControlSkipWaiting () {
		mod._ValueNextWorker.postMessage('OLSKMessageSkipWaiting');
	},

	// MESSAGE

	MessageUpdateFound (event) {
		DebugEnableLogging && console.log('updatefound', event);

		mod._ValueNextWorker = mod._ValueRegistration.installing;

		mod._ValueNextWorker.addEventListener('statechange', mod.MessageNextWorkerStateChange);
	},

	MessageNextWorkerStateChange (event) {
		DebugEnableLogging && console.log('statechange', mod._ValueNextWorker.state, event, navigator.serviceWorker.controller);

		if (mod._ValueNextWorker.state !== 'installed') {
			return;
		}

		if (!navigator.serviceWorker.controller) {
			return;
		}

		mod._ValueUpdateAlertIsVisible = true;
	},

	MessageControllerChange (event) {
		DebugEnableLogging && console.log('controllerchange', event);

		window.location.reload();
	},

	// SETUP

	async SetupEverything() {
		if (!navigator.serviceWorker) {
			return DebugEnableLogging && console.info('Service worker not available');
		}

		if (!OLSKServiceWorkerRegistrationRoute) {
			return DebugEnableLogging && console.info('Missing registration route');
		}

		if (document.location.hostname === 'localhost' && !DebugAllowLocalhost) {
			return DebugEnableLogging && console.info('OLSKServiceWorker: Skipping on localhost');
		};

		await mod.SetupRegistration();

		mod.SetupControllerChange();
	},

	async SetupRegistration() {
		mod._ValueRegistration = await navigator.serviceWorker.register(OLSKServiceWorkerRegistrationRoute);
		
		DebugEnableLogging && console.info('Service Worker Registered');

		mod._ValueRegistration.addEventListener('updatefound', mod.MessageUpdateFound);
	},

	SetupControllerChange () {
		navigator.serviceWorker.addEventListener('controllerchange', mod.MessageControllerChange);
	},

	// LIFECYCLE

	LifecycleModuleDidMount() {
		mod.SetupEverything();
	},

};

mod.LifecycleModuleDidMount();
</script>

{#if mod._ValueUpdateAlertIsVisible }
<div class="OLSKServiceWorkerUpdateAlert" on:click={ () => mod._ValueUpdateAlertIsVisible = false }>
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

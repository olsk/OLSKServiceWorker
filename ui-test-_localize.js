const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`OLSKServiceWorker_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
				DebugFakeUpdateAlertVisible: true,
			});
		});

		it('localizes OLSKServiceWorkerUpdateAlertLabel', function () {
			browser.assert.text(OLSKServiceWorkerUpdateAlertLabel, uLocalized('OLSKServiceWorkerUpdateAlertLabelText'));
		});

		it('localizes OLSKServiceWorkerUpdateAlertReloadButton', function () {
			browser.assert.text(OLSKServiceWorkerUpdateAlertReloadButton, uLocalized('OLSKServiceWorkerUpdateAlertReloadButtonText'));
		});

		it('localizes OLSKServiceWorkerLauncherItemReload', function () {
			return browser.assert.OLSKLauncherItemText('OLSKServiceWorkerLauncherItemReload', uLocalized('OLSKServiceWorkerLauncherItemReloadText'));
		});

		it('localizes OLSKServiceWorkerLauncherItemDebugForceUpdate', function () {
			return browser.assert.OLSKLauncherItemText('OLSKServiceWorkerLauncherItemDebugForceUpdate', uLocalized('OLSKServiceWorkerLauncherItemDebugForceUpdateText'));
		});
	
	});

});

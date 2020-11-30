const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`OLSKServiceWorker_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
				DebugFakeUpdateAlertVisible: true,
			});
		});

		it('localizes OLSKServiceWorkerUpdateAlertLabel', function () {
			browser.assert.text(OLSKServiceWorkerUpdateAlertLabel, uLocalized('OLSKServiceWorkerUpdateAlertLabelText'));
		});

		it('localizes OLSKServiceWorkerUpdateAlertReloadButton', function () {
			browser.assert.text(OLSKServiceWorkerUpdateAlertReloadButton, uLocalized('OLSKServiceWorkerUpdateAlertReloadButtonText'));
		});

		it('localizes OLSKServiceWorkerLauncherItemDebugForceUpdate', function () {
			return browser.assert.OLSKLauncherItemText('OLSKServiceWorkerLauncherItemDebugForceUpdate', uLocalized('OLSKServiceWorkerLauncherItemDebugForceUpdateText'));
		});
	
	});

});

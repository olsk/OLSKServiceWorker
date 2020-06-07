const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

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
	
	});

});

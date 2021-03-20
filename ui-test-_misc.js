const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('OLSKServiceWorker_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('OLSKServiceWorkerUpdateAlertReloadButton', function test_OLSKServiceWorkerUpdateAlertReloadButton () {
		
		it('classes OLSKDecorPress', function () {
			browser.assert.hasClass(OLSKServiceWorkerUpdateAlertReloadButton, 'OLSKDecorPress');
		});
		
		it('classes OLSKDecorPressCall', function () {
			browser.assert.hasClass(OLSKServiceWorkerUpdateAlertReloadButton, 'OLSKDecorPressCall');
		});

	});
	
});

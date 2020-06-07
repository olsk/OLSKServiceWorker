const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	OLSKServiceWorkerUpdateAlert: '.OLSKServiceWorkerUpdateAlert',
	OLSKServiceWorkerUpdateAlertLabel: '.OLSKServiceWorkerUpdateAlertLabel',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('OLSKServiceWorker_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('hides OLSKServiceWorkerUpdateAlert', function () {
		browser.assert.elements(OLSKServiceWorkerUpdateAlert, 0);
	});

	context('DebugFakeUpdateAlertVisible', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				DebugFakeUpdateAlertVisible: true,
			});
		});

		it('shows OLSKServiceWorkerUpdateAlert', function () {
			browser.assert.elements(OLSKServiceWorkerUpdateAlert, 1);
		});

		it('shows OLSKServiceWorkerUpdateAlertLabel', function () {
			browser.assert.elements(OLSKServiceWorkerUpdateAlertLabel, 1);
		});
	
	});

});
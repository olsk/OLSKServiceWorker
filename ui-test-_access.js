const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	OLSKServiceWorkerUpdateAlert: '.OLSKServiceWorkerUpdateAlert',
	OLSKServiceWorkerUpdateAlertLabel: '.OLSKServiceWorkerUpdateAlertLabel',
	OLSKServiceWorkerUpdateAlertReloadButton: '.OLSKServiceWorkerUpdateAlertReloadButton',
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

	it('shows OLSKServiceWorkerLauncherFakeItemProxy', function () {
		return browser.assert.OLSKLauncherItems('OLSKServiceWorkerLauncherFakeItemProxy', 1);
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

		it('shows OLSKServiceWorkerUpdateAlertReloadButton', function () {
			browser.assert.elements(OLSKServiceWorkerUpdateAlertReloadButton, 1);
		});

		context('click', function () {

			before(function () {
				return browser.click(OLSKServiceWorkerUpdateAlert);
			});
			
			it('hides OLSKServiceWorkerUpdateAlert', function () {
				browser.assert.elements(OLSKServiceWorkerUpdateAlert, 0);
			});
		
		});
	
	});

});

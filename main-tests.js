const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

describe('OLSKServiceWorkerView', function testOLSKServiceWorkerView() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(null);
		}, /OLSKrrorInputInvalid/);
	});

	it('throws if not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView('');
		}, /OLSKrrorInputInvalid/);
	});

	it('throws if contains whitespace', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView('alfa bravo');
		}, /OLSKrrorInputInvalid/);
	});

	it('returns function body', function() {
		deepEqual(mainModule.OLSKServiceWorkerView('alfa'), mainModule._OLSKServiceWorkerTemplate.toString().replace('VERSION_ID_TOKEN', 'alfa').replace('function () {', '').trim().slice(0, -1));
	});

});

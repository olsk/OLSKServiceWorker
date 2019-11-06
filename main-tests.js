const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const uStubTokens = function () {
	return {
		VERSION_ID_TOKEN: 'alfa',
		REFERRER_MATCH_TOKEN: 'bravo',
	}
}

describe('OLSKServiceWorkerView', function testOLSKServiceWorkerView() {

	it('throws if not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(null);
		}, /OLSKrrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				VERSION_ID_TOKEN: null,
			}));
		}, /OLSKrrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				VERSION_ID_TOKEN: '',
			}));
		}, /OLSKrrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN contains whitespace', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				VERSION_ID_TOKEN: 'alfa bravo',
			}));
		}, /OLSKrrorInputNotValid/);
	});

	it('throws if REFERRER_MATCH_TOKEN not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				REFERRER_MATCH_TOKEN: null,
			}));
		}, /OLSKrrorInputNotValid/);
	});

	it('throws if REFERRER_MATCH_TOKEN not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				REFERRER_MATCH_TOKEN: '',
			}));
		}, /OLSKrrorInputNotValid/);
	});

	it('returns function body', function() {
		deepEqual(mainModule.OLSKServiceWorkerView(uStubTokens()), mainModule._OLSKServiceWorkerTemplate.toString().replace('VERSION_ID_TOKEN', 'alfa').replace(/REFERRER_MATCH_TOKEN/g, 'bravo').replace('function () {', '').trim().slice(0, -1));
	});

});

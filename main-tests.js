const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const uStubTokens = function () {
	return {
		VERSION_ID_TOKEN: 'alfa',
		REFERRER_MATCH_TOKEN: 'bravo',
	}
}

describe('OLSKServiceWorkerView', function test_OLSKServiceWorkerView() {

	it('throws if not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				VERSION_ID_TOKEN: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				VERSION_ID_TOKEN: '',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN contains whitespace', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				VERSION_ID_TOKEN: 'alfa bravo',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if REFERRER_MATCH_TOKEN not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				REFERRER_MATCH_TOKEN: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if REFERRER_MATCH_TOKEN not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(Object.assign(uStubTokens(), {
				REFERRER_MATCH_TOKEN: '',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns function body', function() {
		deepEqual(mainModule.OLSKServiceWorkerView(uStubTokens()), mainModule._OLSKServiceWorkerTemplate.toString().replace('VERSION_ID_TOKEN', 'alfa').replace(/REFERRER_MATCH_TOKEN/g, 'bravo').replace('_OLSKServiceWorkerTemplate () {', '').trim().slice(0, -1));
	});

});

const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const uStubTokens = function (inputData = {}) {
	return Object.assign({
		VERSION_ID_TOKEN: 'alfa',
		REFERRER_MATCH_TOKEN: 'bravo',
	}, inputData);
};

const uFakeSelf = function() {
	const _listeners = {};
	const _calls = {};

	return {
		addEventListener (param1, param2) {
			_listeners[param1] = param2;
		},
		skipWaiting () {
			_calls.skipWaiting = (_calls.skipWaiting || 0) + 1;
		},
		_FakeListeners () {
			return _listeners;
		},
		_FakeCalls () {
			return _calls;
		},
	};
};

const uFakeCaches = function(inputData = []) {
	const _calls = {};
	const _deletes = [];
	const _caches = {};

	return {
		keys () {
			_calls.keys = (_calls.keys || 0) + 1;

			return inputData;
		},
		delete (inputData) {
			_deletes.push(inputData);
		},
		open (cacheName) {
			_caches[cacheName] = {};

			return {
				put (request, value) {
					_caches[cacheName][request.url] = value;
				},
			};
		},
		async match (inputData) {
			return Object.values(_caches).reduce(function (coll, item) {
				if (Object.keys(item).includes(inputData.url)) {
					coll.push(item[inputData.url]);
				}

				return coll;
			}, []).shift();
		},
		_FakeCalls () {
			return _calls;
		},
		_FakeDeletes () {
			return _deletes;
		},
		_FakeCaches () {
			return _caches;
		},
	};
};

const uFakeFetch = async function (inputData) {
	this._FakeRequests = [];
	this._FakeRequests.push(inputData.url);

	this._FakeResponses = [];
	this._FakeResponses.push({
		url: inputData.url,
		status: 200,
		clone () {
			return Object.assign({}, this);
		},
	});

	return this._FakeResponses.slice(-1).pop();
};

const uModule = function(param1 = uFakeSelf()) {
	return Object.assign(mainModule.OLSKServiceWorkerModule(param1, uFakeCaches(), uFakeFetch), {
		_DataOriginPage: '/charlie',
	});
};

describe('OLSKServiceWorkerRequestMatchesROCOAPI', function test_OLSKServiceWorkerRequestMatchesROCOAPI() {

	const uRequest = function (inputData) {
		return {
			method: 'GET',
			mode: 'cors',
			url: inputData,
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerRequestMatchesROCOAPI(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if not valid', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerRequestMatchesROCOAPI(uRequest(null));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns false if not roco api', function() {
		deepEqual(mainModule.OLSKServiceWorkerRequestMatchesROCOAPI(uRequest('https://alfa.com/bravo')), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.OLSKServiceWorkerRequestMatchesROCOAPI(uRequest('https://rosano.ca/api/alfa')), true);
	});

});

describe('OLSKServiceWorkerModule', function test_OLSKServiceWorkerModule() {

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerModule(null, uFakeCaches());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerModule({
				addEventListener: {},
			}, uFakeCaches());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerModule(uFakeSelf(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not valid', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerModule(uFakeSelf(), {
				keys: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not function', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerModule(uFakeSelf(), uFakeCaches(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(typeof uModule(), 'object');
	});

	context('ControlClearCache', function () {
		
		it('calls caches.delete on caches.all', async function () {
			const item = uFakeCaches(['alfa', 'bravo']);

			await Object.assign(uModule(), {
				_ValueCaches: item,
			}).ControlClearCache();

			deepEqual(item._FakeCalls().keys, 1);
			deepEqual(item._FakeDeletes(), ['alfa', 'bravo']);
		});
	
	});

	context('OLSKServiceWorkerDidActivate', function () {
		
		it('calls event.waitUntil with mod.ControlClearCache()', function () {
			const item = {};

			const mod = Object.assign(uModule(), {
				ControlClearCache () {
					return 'alfa';
				},
			});
			
			mod.OLSKServiceWorkerDidActivate({
				waitUntil (inputData) {
					item.waitUntil = inputData;
				},
			});

			deepEqual(item.waitUntil, 'alfa');
		});

	});

	context('OLSKServiceWorkerDidFetch', function () {

		const uFetchEvent = function (inputData) {
			const _FakeResponses = [];

			return {
				async respondWith (inputData) {
					return _FakeResponses.push(await inputData);
				},
				request: Object.assign({
					method: 'GET',
					url: 'https://alfa.bravo/charlie/ui-style.css',
					mode: 'no-cors',
					referrer: 'https://alfa.bravo/charlie',
				}, inputData),
				_FakeResponses () {
					return _FakeResponses;
				},
			};
		};

		it('ignores if method POST', async function () {
			const item = uFetchEvent({
				method: 'POST',
			});

			await uModule().OLSKServiceWorkerDidFetch(item);

			deepEqual(item._FakeResponses(), []);
		});

		it('ignores if url sw.js', async function () {
			const item = uFetchEvent({
				url: 'https://alfa.bravo/sw.js',
			});

			await uModule().OLSKServiceWorkerDidFetch(item);

			deepEqual(item._FakeResponses(), []);
		});

		context('OriginPage', function () {

			context('mode navigate', function () {
				
				it('ignores if to other page', async function () {
					const item = uFetchEvent({
						url: 'https://alfa.bravo/charlie',
						mode: 'navigate',
						referrer: 'https://alfa.bravo/delta',
					});

					await Object.assign(uModule(), {
						_DataOriginPage: '/delta',
					}).OLSKServiceWorkerDidFetch(item);

					deepEqual(item._FakeResponses(), []);
				});

				it('responds if to OriginPage', async function () {
					const item = uFetchEvent({
						url: 'https://alfa.bravo/delta',
						mode: 'navigate',
						referrer: 'https://alfa.bravo/charlie',
					});

					await Object.assign(uModule(), {
						_DataOriginPage: '/delta',
					}).OLSKServiceWorkerDidFetch(item);

					deepEqual(item._FakeResponses().length, 1);
				});
			
			});

			context('referrer', function () {
				
				it('ignores if other page', async function () {
					const item = uFetchEvent({
						referrer: 'https://alfa.bravo/charlie',
					});

					await Object.assign(uModule(), {
						_DataOriginPage: '/delta',
					}).OLSKServiceWorkerDidFetch(item);

					deepEqual(item._FakeResponses(), []);
				});

				it('responds if OriginPage', async function () {
					const item = uFetchEvent({
						referrer: 'https://alfa.bravo/delta',
					});

					await Object.assign(uModule(), {
						_DataOriginPage: '/delta',
					}).OLSKServiceWorkerDidFetch(item);

					deepEqual(item._FakeResponses().length, 1);
				});
			
			});
		
		});

		context('response', function () {

			const uObject = function (key, value) {
				const outputData = {};

				outputData[key] = value;

				return outputData;
			};

			context('network_not_ok', function () {

				const event = uFetchEvent();
				const mod = Object.assign(uModule(), {
					_alfa: uFakeFetch,
					async _ValueFetch (inputData) {
						return Object.assign(await mod._alfa(inputData), {
							status: 401,
						});
					},
				});

				before(function () {
					return mod.OLSKServiceWorkerDidFetch(event);
				});

				it('requests fetch', function () {
					deepEqual(mod._FakeRequests, [event.request.url]);
				});

				it('returns network response', function () {
					deepEqual(mod._FakeResponses, event._FakeResponses());
				});

				it('caches no response', function () {
					deepEqual(mod._ValueCaches._FakeCaches(), {});
				});
			
			});

			context('network_ok', function () {

				const event = uFetchEvent();
				const mod = uModule();

				before(function () {
					return mod.OLSKServiceWorkerDidFetch(event);
				});

				it('performs network fetch', function () {
					deepEqual(mod._FakeRequests, [event.request.url]);
				});

				it('returns network response', function () {
					deepEqual(mod._FakeResponses, event._FakeResponses());
				});

				it('caches response', function () {
					deepEqual(mod._ValueCaches._FakeCaches(), uObject(mod._DataCacheName, uObject(event.request.url, mod._FakeResponses[0])));
				});
			
			});

			context('cached', function () {

				const event = uFetchEvent();
				const mod = uModule();

				before(function () {
					return mod.OLSKServiceWorkerDidFetch(event);
				});

				before(function () {
					return mod.OLSKServiceWorkerDidFetch(event);
				});

				it('performs no network fetch', function () {
					deepEqual(mod._FakeRequests, [event.request.url]);
				});

				it('returns cached response', function () {
					deepEqual(event._FakeResponses(), [mod._FakeResponses[0], mod._FakeResponses[0]]);
				});

			});
		
		});
	
	});

	context('OLSKServiceWorkerDidReceiveMessage', function () {
		
		it('calls skipWaiting if data.action skipWaiting', function () {
			const item = uFakeSelf();
			const mod = uModule(item);
			
			mod.OLSKServiceWorkerDidReceiveMessage({
				data: {
					action: 'skipWaiting',
				},
			});

			deepEqual(item._FakeCalls().skipWaiting, 1);
		});

		it('does nothing', function () {
			const item = uFakeSelf();
			const mod = uModule(item);
			
			mod.OLSKServiceWorkerDidReceiveMessage({
				data: {
					action: 'alfa',
				},
			});

			deepEqual(item._FakeCalls().skipWaiting, undefined);
		});
	
	});

});

describe('OLSKServiceWorkerInitialization', function test_OLSKServiceWorkerInitialization() {

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerInitialization(null, uModule());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerInitialization({
				addEventListener: {},
			}, uModule());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerInitialization(uFakeSelf(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not valid', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerInitialization(uFakeSelf(), {
				OLSKServiceWorkerDidReceiveMessage: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(mainModule.OLSKServiceWorkerInitialization(uFakeSelf(), uModule()), undefined);
	});

	it('calls addEventListener for activate', function () {
		const item = uFakeSelf();
		const mod = uModule(item);
		
		mainModule.OLSKServiceWorkerInitialization(item, mod);

		deepEqual(item._FakeListeners().activate, mod.OLSKServiceWorkerDidActivate);
	});

	it('calls addEventListener for fetch', function () {
		const item = uFakeSelf();
		const mod = uModule(item);
		
		mainModule.OLSKServiceWorkerInitialization(item, mod);

		deepEqual(item._FakeListeners().fetch, mod.OLSKServiceWorkerDidFetch);
	});

	it('calls addEventListener for message', function () {
		const item = uFakeSelf();
		const mod = uModule(item);
		
		mainModule.OLSKServiceWorkerInitialization(item, mod);

		deepEqual(item._FakeListeners().message, mod.OLSKServiceWorkerDidReceiveMessage);
	});

});

describe('OLSKServiceWorkerViewTemplate', function test_OLSKServiceWorkerViewTemplate() {

	it('returns string', function() {
		deepEqual(mainModule.OLSKServiceWorkerViewTemplate(), `const mod = (function ${ mainModule.OLSKServiceWorkerModule.toString() })(self, caches, fetch, true);\n\n(function ${ mainModule.OLSKServiceWorkerInitialization.toString() })(self, mod);`);
	});

});

describe('OLSKServiceWorkerView', function test_OLSKServiceWorkerView() {

	it('throws if not object', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(uStubTokens({
				VERSION_ID_TOKEN: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(uStubTokens({
				VERSION_ID_TOKEN: '',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN contains whitespace', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(uStubTokens({
				VERSION_ID_TOKEN: 'alfa bravo',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if REFERRER_MATCH_TOKEN not string', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(uStubTokens({
				REFERRER_MATCH_TOKEN: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if REFERRER_MATCH_TOKEN not filled', function() {
		throws(function() {
			mainModule.OLSKServiceWorkerView(uStubTokens({
				REFERRER_MATCH_TOKEN: '',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string ', function() {
		deepEqual(typeof mainModule.OLSKServiceWorkerView(uStubTokens()), 'string');
	});

	it('replaces VERSION_ID_TOKEN', function() {
		deepEqual(mainModule.OLSKServiceWorkerView(uStubTokens()).includes('VERSION_ID_TOKEN'), false);
		deepEqual(mainModule.OLSKServiceWorkerView(uStubTokens()).includes(uStubTokens().VERSION_ID_TOKEN), true);
	});

	it('replaces REFERRER_MATCH_TOKEN', function() {
		deepEqual(mainModule.OLSKServiceWorkerView(uStubTokens()).includes('REFERRER_MATCH_TOKEN'), false);
		deepEqual(mainModule.OLSKServiceWorkerView(uStubTokens()).includes(uStubTokens().REFERRER_MATCH_TOKEN), true);
	});

});

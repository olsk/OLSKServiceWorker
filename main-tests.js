const { throws, deepEqual } = require('assert');

const main = require('./main.js');

const uStubTokens = function (inputData = {}) {
	return Object.assign({
		VERSION_ID_TOKEN: 'alfa',
		ORIGIN_PAGE_PATH_TOKEN: 'bravo',
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
	return Object.assign(main.OLSKServiceWorkerModule(param1, uFakeCaches(), uFakeFetch), {
		_DataOriginPage: '/charlie',
	});
};

const uWindow = function (inputData = {}) {
	return Object.assign({
		prompt () {},
		confirm () {},
		location: {
			reload () {},
		},
	}, inputData);
};

const uNavigator = function (inputData = {}) {
	return Object.assign({
		serviceWorker: Object.assign({
			async getRegistration () {
				return {};
			},
			controller: {
				postMessage () {},
			},
		}, inputData),
	});
};

const uLocalized = function (inputData) {
	return inputData + 'LOCALIZED';
};

describe('OLSKServiceWorkerModule', function test_OLSKServiceWorkerModule() {

	it('throws if param1 not object', function() {
		throws(function() {
			main.OLSKServiceWorkerModule(null, uFakeCaches());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			main.OLSKServiceWorkerModule({
				addEventListener: {},
			}, uFakeCaches());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function() {
		throws(function() {
			main.OLSKServiceWorkerModule(uFakeSelf(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not valid', function() {
		throws(function() {
			main.OLSKServiceWorkerModule(uFakeSelf(), {
				keys: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not function', function() {
		throws(function() {
			main.OLSKServiceWorkerModule(uFakeSelf(), uFakeCaches(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(typeof uModule(), 'object');
	});

	context('ControlClearCache', function test_ControlClearCache () {
		
		it('calls caches.delete on caches.all', async function () {
			const item = uFakeCaches(['alfa', 'bravo']);

			await Object.assign(uModule(), {
				_ValueCaches: item,
			}).ControlClearCache();

			deepEqual(item._FakeCalls().keys, 1);
			deepEqual(item._FakeDeletes(), ['alfa', 'bravo']);
		});
		
		it('excludes _DataPersistenceCacheName', async function () {
			const item = uFakeCaches(['alfa', uModule()._DataPersistenceCacheName]);

			await Object.assign(uModule(), {
				_ValueCaches: item,
			}).ControlClearCache();

			deepEqual(item._FakeCalls().keys, 1);
			deepEqual(item._FakeDeletes(), ['alfa']);
		});
	
	});

	context('ControlAddPersistenceCacheURL', function test_ControlAddPersistenceCacheURL () {

		it('throws if not string', function () {
			throws(function () {
				uModule(uFakeSelf()).ControlAddPersistenceCacheURL(null);
			}, /ErrorInputNotValid/);
		});
		
		it('excludes _DataPersistenceCacheName', async function () {
			const item = Math.random().toString();

			const mod = Object.assign(uModule(uFakeSelf()), {
				_ValuePersistenceCacheURLs: [],
			});
			
			mod.ControlAddPersistenceCacheURL(item);

			deepEqual(mod._ValuePersistenceCacheURLs, [item]);
		});
	
	});

	context('OLSKServiceWorkerDidActivate', function test_OLSKServiceWorkerDidActivate () {
		
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

	context('OLSKServiceWorkerDidFetch', function test_OLSKServiceWorkerDidFetch () {

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

		context('mode cors', function () {
			
			it('ignores if not in _ValuePersistenceCacheURLs', async function () {
				const item = uFetchEvent({
					mode: 'cors',
				});

				await uModule().OLSKServiceWorkerDidFetch(item);

				deepEqual(item._FakeResponses(), []);
			});
			
			it('responds', async function () {
				const url = Math.random().toString();
				const mod = uModule();

				mod.ControlAddPersistenceCacheURL(url);

				const item = uFetchEvent({
					url,
					mode: 'cors',
				});

				await mod.OLSKServiceWorkerDidFetch(item);

				deepEqual(item._FakeResponses().length, 1);
			});
		
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

				it('caches response in _DataVersionCacheName', function () {
					deepEqual(mod._ValueCaches._FakeCaches(), uObject(mod._DataVersionCacheName, uObject(event.request.url, mod._FakeResponses[0])));
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

			context('_ValuePersistenceCacheURLs', function () {

				const url = Math.random().toString();
				const event = uFetchEvent({
					url,
				});
				const mod = uModule();

				before(function () {
					return mod.ControlAddPersistenceCacheURL(url);
				});

				before(function () {
					return mod.OLSKServiceWorkerDidFetch(event);
				});

				it('caches response in _DataPersistenceCacheName', function () {
					deepEqual(mod._ValueCaches._FakeCaches(), uObject(mod._DataPersistenceCacheName, uObject(event.request.url, mod._FakeResponses[0])));
				});
			
			});
		
		});
	
	});

	context('OLSKServiceWorkerDidReceiveMessage', function test_OLSKServiceWorkerDidReceiveMessage () {

		context('string', function () {
			
			it('does nothing if not formatted', async function () {
				const item = [];
				const data = '_OLSKServiceWorker_' + Date.now().toString();

				await Object.assign(uModule(uFakeSelf()), {
					[data]: (function () {
						item.push(null);
					}),
				}).OLSKServiceWorkerDidReceiveMessage({
					data,
				})

				deepEqual(item, []);
			});

			it('calls method and posts message with result', async function () {
				const item = Math.random().toString();
				const data = 'OLSKServiceWorker_' + Date.now().toString();

				deepEqual(await Object.assign(uModule(uFakeSelf()), {
					[data]: (function () {
						return item;
					}),
				}).OLSKServiceWorkerDidReceiveMessage({
					data,
					source: {
						postMessage: (function () {
							return Array.from(arguments);
						}),
					},
				}), [{
					OLSKMessageSignature: data,
					OLSKMessageArguments: undefined,
					OLSKMessageResponse: item,
				}]);
			});
			
		});

		context('object', function () {
			
			it('does nothing if not formatted', async function () {
				const item = [];
				const OLSKMessageSignature = '_OLSKServiceWorker_' + Date.now().toString();
				const OLSKMessageArguments = [Math.random().toString()];

				await Object.assign(uModule(uFakeSelf()), {
					[OLSKMessageSignature]: (function () {
						item.push(null);
					}),
				}).OLSKServiceWorkerDidReceiveMessage({
					data: {
						OLSKMessageSignature,
						OLSKMessageArguments,
					},
				});

				deepEqual(item, []);
			});

			it('calls method and posts message with result', async function () {
				const OLSKMessageSignature = 'OLSKServiceWorker_' + Date.now().toString();
				const OLSKMessageArguments = [Math.random().toString()];

				deepEqual(await Object.assign(uModule(uFakeSelf()), {
					[OLSKMessageSignature]: (function () {
						return [...arguments, 'PROCESSED'];
					}),
				}).OLSKServiceWorkerDidReceiveMessage({
					data: {
						OLSKMessageSignature,
						OLSKMessageArguments,
					},
					source: {
						postMessage: (function () {
							return Array.from(arguments);
						}),
					},
				}), [{
					OLSKMessageSignature,
					OLSKMessageArguments,
					OLSKMessageResponse: [OLSKMessageArguments[0], 'PROCESSED'],
				}]);
			});
		
		});
	
	});

	context('OLSKServiceWorker_ClearVersionCache', function test_OLSKServiceWorker_ClearVersionCache () {

		it('calls ControlClearCache', async function () {
			const item = Math.random().toString();

			const mod = Object.assign(uModule(uFakeSelf()), {
				ControlClearCache: (function () {
					return item
				}),
			});
			
			deepEqual(mod.OLSKServiceWorker_ClearVersionCache(), item);
		});
	
	});

	context('OLSKServiceWorker_SkipWaiting', function test_OLSKServiceWorker_SkipWaiting () {

		it('calls ControlClearCache', async function () {
			const item = Math.random().toString();

			const mod = Object.assign(uModule(uFakeSelf()), {
				_ValueSelf: {
					skipWaiting: (function () {
						return item;
					}),
				},
			});
			
			deepEqual(mod.OLSKServiceWorker_SkipWaiting(), item);
		});
	
	});

	context('OLSKServiceWorker_AddPersistenceCacheURL', function test_OLSKServiceWorker_AddPersistenceCacheURL () {

		it('calls ControlAddPersistenceCacheURL', async function () {
			const item = Math.random().toString();

			const mod = Object.assign(uModule(uFakeSelf()), {
				ControlAddPersistenceCacheURL: (function () {
					return Array.from(arguments);
				}),
			});
			
			deepEqual(mod.OLSKServiceWorker_AddPersistenceCacheURL(item), [item]);
		});
	
	});

});

describe('OLSKServiceWorkerInitialization', function test_OLSKServiceWorkerInitialization() {

	it('throws if param1 not object', function() {
		throws(function() {
			main.OLSKServiceWorkerInitialization(null, uModule());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			main.OLSKServiceWorkerInitialization({
				addEventListener: {},
			}, uModule());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function() {
		throws(function() {
			main.OLSKServiceWorkerInitialization(uFakeSelf(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not valid', function() {
		throws(function() {
			main.OLSKServiceWorkerInitialization(uFakeSelf(), {
				OLSKServiceWorkerDidReceiveMessage: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(main.OLSKServiceWorkerInitialization(uFakeSelf(), uModule()), undefined);
	});

	it('calls addEventListener for activate', function () {
		const item = uFakeSelf();
		const mod = uModule(item);
		
		main.OLSKServiceWorkerInitialization(item, mod);

		deepEqual(item._FakeListeners().activate, mod.OLSKServiceWorkerDidActivate);
	});

	it('calls addEventListener for fetch', function () {
		const item = uFakeSelf();
		const mod = uModule(item);
		
		main.OLSKServiceWorkerInitialization(item, mod);

		deepEqual(item._FakeListeners().fetch, mod.OLSKServiceWorkerDidFetch);
	});

	it('calls addEventListener for message', function () {
		const item = uFakeSelf();
		const mod = uModule(item);
		
		main.OLSKServiceWorkerInitialization(item, mod);

		deepEqual(item._FakeListeners().message, mod.OLSKServiceWorkerDidReceiveMessage);
	});

});

describe('OLSKServiceWorkerViewTemplate', function test_OLSKServiceWorkerViewTemplate() {

	it('returns string', function() {
		deepEqual(main.OLSKServiceWorkerViewTemplate(), `const mod = (function ${ main.OLSKServiceWorkerModule.toString() })(self, caches, fetch, true);\n\n(function ${ main.OLSKServiceWorkerInitialization.toString() })(self, mod);`);
	});

});

describe('OLSKServiceWorkerView', function test_OLSKServiceWorkerView() {

	it('throws if not object', function() {
		throws(function() {
			main.OLSKServiceWorkerView(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not string', function() {
		throws(function() {
			main.OLSKServiceWorkerView(uStubTokens({
				VERSION_ID_TOKEN: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN not filled', function() {
		throws(function() {
			main.OLSKServiceWorkerView(uStubTokens({
				VERSION_ID_TOKEN: '',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if VERSION_ID_TOKEN contains whitespace', function() {
		throws(function() {
			main.OLSKServiceWorkerView(uStubTokens({
				VERSION_ID_TOKEN: 'alfa bravo',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ORIGIN_PAGE_PATH_TOKEN not string', function() {
		throws(function() {
			main.OLSKServiceWorkerView(uStubTokens({
				ORIGIN_PAGE_PATH_TOKEN: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ORIGIN_PAGE_PATH_TOKEN not filled', function() {
		throws(function() {
			main.OLSKServiceWorkerView(uStubTokens({
				ORIGIN_PAGE_PATH_TOKEN: '',
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns string ', function() {
		deepEqual(typeof main.OLSKServiceWorkerView(uStubTokens()), 'string');
	});

	it('replaces VERSION_ID_TOKEN', function() {
		deepEqual(main.OLSKServiceWorkerView(uStubTokens()).includes('VERSION_ID_TOKEN'), false);
		deepEqual(main.OLSKServiceWorkerView(uStubTokens()).includes(uStubTokens().VERSION_ID_TOKEN), true);
	});

	it('replaces ORIGIN_PAGE_PATH_TOKEN', function() {
		deepEqual(main.OLSKServiceWorkerView(uStubTokens()).includes('ORIGIN_PAGE_PATH_TOKEN'), false);
		deepEqual(main.OLSKServiceWorkerView(uStubTokens()).includes(uStubTokens().ORIGIN_PAGE_PATH_TOKEN), true);
	});

});

describe('OLSKServiceWorkerLauncherFakeItemProxy', function test_OLSKServiceWorkerLauncherFakeItemProxy() {

	it('returns object', function () {
		const item = main.OLSKServiceWorkerLauncherFakeItemProxy();
		deepEqual(item, {
			LCHRecipeName: 'OLSKServiceWorkerLauncherFakeItemProxy',
			LCHRecipeCallback: item.LCHRecipeCallback,
		});
	});

	context('LCHRecipeCallback', function () {
		
		it('returns undefined', function () {
			deepEqual(main.OLSKServiceWorkerLauncherFakeItemProxy().LCHRecipeCallback(), undefined);
		});

	});

});

describe('OLSKServiceWorkerLauncherItemDebugForceUpdate', function test_OLSKServiceWorkerLauncherItemDebugForceUpdate() {

	it('throws if param1 not window', function () {
		throws(function () {
			main.OLSKServiceWorkerLauncherItemDebugForceUpdate({}, uNavigator(), uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not navigator', function () {
		throws(function () {
			main.OLSKServiceWorkerLauncherItemDebugForceUpdate(uWindow(), {}, uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not OLSKLocalized', function () {
		throws(function () {
			main.OLSKServiceWorkerLauncherItemDebugForceUpdate(uWindow(), uNavigator(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = main.OLSKServiceWorkerLauncherItemDebugForceUpdate(uWindow(), uNavigator(), uLocalized);

		deepEqual(item, {
			LCHRecipeSignature: 'OLSKServiceWorkerLauncherItemDebugForceUpdate',
			LCHRecipeName: uLocalized('OLSKServiceWorkerLauncherItemDebugForceUpdateText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
		});
	});

	context('LCHRecipeCallback', function () {

		it('returns undefined', async function () {
			deepEqual(await main.OLSKServiceWorkerLauncherItemDebugForceUpdate(uWindow(), uNavigator(), uLocalized).LCHRecipeCallback(), undefined);
		});

		it('calls OLSKServiceWorker_SkipWaiting if waiting', async function () {
			const item = [];

			await main.OLSKServiceWorkerLauncherItemDebugForceUpdate(uWindow({
				reload () {
					item.push('alfa');
				},
			}), uNavigator({
				async getRegistration () {
					return {
						waiting: {
							postMessage () {
								item.push(...arguments);
							},
						},
					};
				},
			}), uLocalized).LCHRecipeCallback();

			deepEqual(item, ['OLSKServiceWorker_SkipWaiting']);
		});

		it('calls postMessage then reload', async function () {
			const item = [];

			await main.OLSKServiceWorkerLauncherItemDebugForceUpdate(uWindow({
				location: {
					reload () {
						item.push('alfa');
					},
				},
			}), uNavigator({
				controller: {
					postMessage () {
						item.push(...arguments);
					},
				},
			}), uLocalized).LCHRecipeCallback();

			deepEqual(item, ['OLSKServiceWorker_ClearVersionCache', 'alfa']);
		});

	});

});

describe('OLSKServiceWorkerRecipes', function test_OLSKServiceWorkerRecipes() {

	it('throws if param1 not window', function () {
		throws(function () {
			main.OLSKServiceWorkerRecipes({}, uNavigator(), uLocalized, true);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not navigator', function () {
		throws(function () {
			main.OLSKServiceWorkerRecipes(uWindow(), {}, uLocalized, true);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not OLSKLocalized', function () {
		throws(function () {
			main.OLSKServiceWorkerRecipes(uWindow(), uNavigator(), null, true);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param4 not boolean', function () {
		throws(function () {
			main.OLSKServiceWorkerRecipes(uWindow(), uNavigator(), uLocalized, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('includes production recipes', function () {
		deepEqual(main.OLSKServiceWorkerRecipes(uWindow(), uNavigator(), uLocalized, false).map(function (e) {
			return e.LCHRecipeSignature || e.LCHRecipeName;
		}), Object.keys(main).filter(function (e) {
			return e.match(/Launcher/) && !e.match(/Fake/);
		}));
	});

	context('OLSK_IS_TESTING_BEHAVIOUR', function () {

		it('includes all recipes', function () {
			deepEqual(main.OLSKServiceWorkerRecipes(uWindow(), uNavigator(), uLocalized, true).map(function (e) {
				return e.LCHRecipeSignature || e.LCHRecipeName;
			}), Object.keys(main).filter(function (e) {
				return e.match(/Launcher/);
			}));
		});
	
	});

});

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.OLSKServiceWorker = global.OLSKServiceWorker || {})));
}(this, (function (exports) { 'use strict'; Object.defineProperty(exports, '__esModule', { value: true }); let mod = {}; Object.assign(exports, mod = {

	OLSKServiceWorkerRequestMatchesROCOAPI (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!inputData.url) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return !!inputData.url.match(/^https\:\/\/rosano\.ca\/api/);
	},

	_OLSKServiceWorkerTemplate () {
		const cacheName = 'OLSKServiceWorkerCache-VERSION_ID_TOKEN';

		self.addEventListener('activate', async function (event) {
			console.log('activate', event);
			
			event.waitUntil(Promise.all(
				(await caches.keys()).map(function (e) {
					return caches.delete(e);
				})
			));
		});

		self.addEventListener('fetch', function (event) {
			if (event.request.method !== 'GET') {
				return console.log('ignoring non-Get', event.request);
			}

			if (event.request.url.match('sw.js')) {
				return console.log('ignoring sw.js', event.request);
			}

			if (event.request.mode === 'cors') {
				return console.log('ignoring cors', event.request);
			}

			if (!(event.request.referrer.match(/REFERRER_MATCH_TOKEN/) && event.request.mode === 'no-cors') && !event.request.url.match(/REFERRER_MATCH_TOKEN/)) {
				return console.log('ignoring referrer', event.request);
			};

			event.respondWith(async function() {
				let cacheResponse = await caches.match(event.request);

				if (cacheResponse) {
					return cacheResponse;
				}

				let networkResponse = await fetch(event.request);

				if (networkResponse.status !== 200) {
					return networkResponse;
				}

				(await caches.open(cacheName)).put(event.request, networkResponse.clone());

				return networkResponse;
			}());
		});

		self.addEventListener('message', function (event) {
			console.log('message', event);

		  if (event.data.action === 'skipWaiting') {
		    self.skipWaiting();
		  }
		});
	},

	OLSKServiceWorkerView (inputData) {
		console.log('DEPRECATED OLSKServiceWorkerView: use OLSKServiceWorkerViewTemplate');
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}
		
		if (typeof inputData.VERSION_ID_TOKEN !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!inputData.VERSION_ID_TOKEN) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (inputData.VERSION_ID_TOKEN.match(/\s/)) {
			throw new Error('OLSKErrorInputNotValid');
		}
		
		if (typeof inputData.REFERRER_MATCH_TOKEN !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!inputData.REFERRER_MATCH_TOKEN) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return mod._OLSKServiceWorkerTemplate.toString().replace(/VERSION_ID_TOKEN/g, inputData.VERSION_ID_TOKEN).replace(/REFERRER_MATCH_TOKEN/g, inputData.REFERRER_MATCH_TOKEN).replace('_OLSKServiceWorkerTemplate () {', '').trim().slice(0, -1);
	},

	OLSKServiceWorkerModule (param1, param2, param3) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param1.addEventListener !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2.keys !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		const mod = {

			// VALUE

			_ValueSelf: param1,
			_ValueCaches: param2,
			_ValueFetch: param3,

			// DATA

			_DataCacheName: 'OLSKServiceWorkerCache-VERSION_ID_TOKEN',

			// CONTROL

			async ControlClearCache () {
				return Promise.all(
					(await mod._ValueCaches.keys()).map(function (e) {
						return mod._ValueCaches.delete(e);
					})
				);
			},

			// MESSAGE

			OLSKServiceWorkerDidActivate (event) {
				event.waitUntil(mod.ControlClearCache());
			},

			async OLSKServiceWorkerDidFetch (event) {
				if (event.request.method !== 'GET') {
					return;
				}

				if (event.request.url.match('sw.js')) {
					return;
				}

				// if (event.request.mode === 'cors') {
				// 	return console.log('ignoring cors', event.request);
				// }

				// if (!(event.request.referrer.match(/REFERRER_MATCH_TOKEN/) && event.request.mode === 'no-cors') && !event.request.url.match(/REFERRER_MATCH_TOKEN/)) {
				// 	return console.log('ignoring referrer', event.request);
				// };

				return event.respondWith(async function() {
					let cacheResponse = await mod._ValueCaches.match(event.request);

					if (cacheResponse) {
						return cacheResponse;
					}

					let networkResponse = await mod._ValueFetch(event.request);

					if (networkResponse.status === 200) {
						(await mod._ValueCaches.open(mod._DataCacheName)).put(event.request, networkResponse.clone());
					}

					return networkResponse;
				}());
			},

			OLSKServiceWorkerDidReceiveMessage (event) {
				if (event.data.action === 'skipWaiting') {
				  mod._ValueSelf.skipWaiting();
				}
			},
		
		};
		
		return mod;
	},

	OLSKServiceWorkerInitialization (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param1.addEventListener !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2.OLSKServiceWorkerDidReceiveMessage !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		param1.addEventListener('activate', param2.OLSKServiceWorkerDidActivate);
		param1.addEventListener('fetch', param2.OLSKServiceWorkerDidFetch);
		param1.addEventListener('message', param2.OLSKServiceWorkerDidReceiveMessage);
	},

	OLSKServiceWorkerViewTemplate () {
		return `const mod = (function ${ mod.OLSKServiceWorkerModule.toString() })();\n\n(function ${ mod.OLSKServiceWorkerInitialization.toString() })(self, mod);`;
	},
	
}); })));

const mod = {

	OLSKServiceWorkerRequestMatchesROCOAPI (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!inputData.url) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return !!inputData.url.match(/^https\:\/\/rosano\.ca\/api/);
	},

	OLSKServiceWorkerModule (param1, param2, param3, param4) {
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

			_DataVersionCacheName: 'OLSKServiceWorkerVersionCache-VERSION_ID_TOKEN',
			_DataOriginPage: 'ORIGIN_PAGE_PATH_TOKEN',

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

				if (event.request.mode === 'cors') {
					return;
				}

				if (event.request.mode === 'navigate' && !event.request.url.includes(mod._DataOriginPage)) {
					return;
				}

				if (event.request.mode !== 'navigate' && !event.request.referrer.includes(mod._DataOriginPage)) {
					return;
				}

				// if (!(event.request.referrer.match(/ORIGIN_PAGE_PATH_TOKEN/) && event.request.mode === 'no-cors') && !event.request.url.match(/ORIGIN_PAGE_PATH_TOKEN/)) {
				// 	return console.log('ignoring referrer', event.request);
				// };

				return event.respondWith(async function() {
					let cacheResponse = await mod._ValueCaches.match(event.request);

					if (cacheResponse) {
						return cacheResponse;
					}

					let networkResponse = param4 ? await fetch(event.request) : await mod._ValueFetch(event.request);

					if (networkResponse.status === 200) {
						(await mod._ValueCaches.open(mod._DataVersionCacheName)).put(event.request, networkResponse.clone());
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
		return `const mod = (function ${ mod.OLSKServiceWorkerModule.toString() })(self, caches, fetch, true);\n\n(function ${ mod.OLSKServiceWorkerInitialization.toString() })(self, mod);`;
	},

	OLSKServiceWorkerView (inputData) {
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
		
		if (typeof inputData.ORIGIN_PAGE_PATH_TOKEN !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!inputData.ORIGIN_PAGE_PATH_TOKEN) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return mod.OLSKServiceWorkerViewTemplate()
			.split('VERSION_ID_TOKEN').join(inputData.VERSION_ID_TOKEN)
			.split('ORIGIN_PAGE_PATH_TOKEN').join(inputData.ORIGIN_PAGE_PATH_TOKEN);
	},
	
};

Object.assign(exports, mod);

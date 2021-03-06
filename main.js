const main = {

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
			_ValuePersistenceCacheURLs: [],

			// DATA

			_DataVersionCacheName: 'OLSKServiceWorkerVersionCache-VERSION_ID_TOKEN',
			_DataPersistenceCacheName: 'OLSKServiceWorkerPersistenceCache',
			_DataOriginPage: 'ORIGIN_PAGE_PATH_TOKEN',

			// CONTROL

			async ControlClearCache () {
				return Promise.all(
					(await mod._ValueCaches.keys()).filter(function (e) {
						return e !== mod._DataPersistenceCacheName;
					}).map(function (e) {
						return mod._ValueCaches.delete(e);
					})
				);
			},

			ControlAddPersistenceCacheURL (inputData) {
				if (typeof inputData !== 'string') {
					throw new Error('OLSKErrorInputNotValid');
				}

				if (mod._ValuePersistenceCacheURLs.includes(inputData)) {
					return;
				}

				mod._ValuePersistenceCacheURLs.push(inputData);
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

				if (event.request.mode === 'cors' && !mod._ValuePersistenceCacheURLs.includes(event.request.url)) {
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
					const cacheResponse = await mod._ValueCaches.match(event.request);

					if (cacheResponse) {
						return cacheResponse;
					}

					const networkResponse = param4 ? await fetch(event.request) : await mod._ValueFetch(event.request);

					if (networkResponse.status === 200) {
						(await mod._ValueCaches.open(mod._ValuePersistenceCacheURLs.includes(event.request.url) ? mod._DataPersistenceCacheName : mod._DataVersionCacheName)).put(event.request, networkResponse.clone());
					}

					return networkResponse;
				}());
			},

			async OLSKServiceWorkerDidReceiveMessage (event) {
				const OLSKMessageSignature = event.data.OLSKMessageSignature || event.data;

				if (typeof OLSKMessageSignature !== 'string') {
					return;
				}

				if (!OLSKMessageSignature.startsWith('OLSKServiceWorker_')) {
					return;
				}

				return event.source.postMessage({
					OLSKMessageSignature,
					OLSKMessageArguments: event.data.OLSKMessageArguments,
					OLSKMessageResponse: await mod[OLSKMessageSignature](...[].concat(event.data.OLSKMessageArguments || [])),
				});
			},

			OLSKServiceWorker_ClearVersionCache () {
				return mod.ControlClearCache();
			},

			OLSKServiceWorker_SkipWaiting () {
				return mod._ValueSelf.skipWaiting();
			},

			OLSKServiceWorker_AddPersistenceCacheURL (inputData) {
				return mod.ControlAddPersistenceCacheURL(inputData);
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
		return `(function() {
			const mod = (function ${ main.OLSKServiceWorkerModule.toString() })(self, caches, fetch, true);

			(function ${ main.OLSKServiceWorkerInitialization.toString() })(self, mod);
		})();`;
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

		return main.OLSKServiceWorkerViewTemplate()
			.split('VERSION_ID_TOKEN').join(inputData.VERSION_ID_TOKEN)
			.split('ORIGIN_PAGE_PATH_TOKEN').join(inputData.ORIGIN_PAGE_PATH_TOKEN);
	},

	OLSKServiceWorkerLauncherFakeItemProxy () {
		return {
			LCHRecipeName: 'OLSKServiceWorkerLauncherFakeItemProxy',
			LCHRecipeCallback () {},
		};
	},

	OLSKServiceWorkerLauncherItemReload (param1, OLSKLocalized) {
		if (!param1.location) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKServiceWorkerLauncherItemReload',
			LCHRecipeName: OLSKLocalized('OLSKServiceWorkerLauncherItemReloadText'),
			LCHRecipeCallback () {
				return param1.location.reload();
			},
		};
	},

	OLSKServiceWorkerLauncherItemDebugForceUpdate (param1, param2, OLSKLocalized) {
		if (!param1.location) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!param2.serviceWorker) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKServiceWorkerLauncherItemDebugForceUpdate',
			LCHRecipeName: OLSKLocalized('OLSKServiceWorkerLauncherItemDebugForceUpdateText'),
			async LCHRecipeCallback () {
				const item = await param2.serviceWorker.getRegistration();

				if (item.waiting) {
					return item.waiting.postMessage('OLSKServiceWorker_SkipWaiting');
				}

				param2.serviceWorker.controller.postMessage('OLSKServiceWorker_ClearVersionCache');

				param1.location.reload();
			},
		};
	},

	OLSKServiceWorkerRecipes (param1, param2, param3, param4) {
		if (!param1.location) {
			throw new Error('OLSKErrorInputNotValid');
		}
		
		if (!param2.serviceWorker) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param4 !== 'boolean') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return [
			main.OLSKServiceWorkerLauncherFakeItemProxy(),
			main.OLSKServiceWorkerLauncherItemReload(param1, param3),
			main.OLSKServiceWorkerLauncherItemDebugForceUpdate(param1, param2, param3),
		].filter(function (e) {
			if (param4) {
				return true;
			}

			return !(e.LCHRecipeSignature || e.LCHRecipeName).match(/Fake/);
		});
	},
	
};

Object.assign(exports, main);

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
	
}); })));

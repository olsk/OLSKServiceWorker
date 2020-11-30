const mod = {

	OLSKControllerRoutes  () {
		return [{
			OLSKRoutePath: '/stub/OLSKServiceWorker',
			OLSKRouteMethod: 'get',
			OLSKRouteSignature: 'OLSKServiceWorkerStubRoute',
			OLSKRouteFunction(req, res, next) {
				return res.render(require('path').join(__dirname, 'stub-view'));
			},
			OLSKRouteLanguageCodes: ['en', 'fr', 'es'],
		}];
	},

	OLSKControllerStaticAssetFiles () {
		return [
			'main.js',
		];
	},

	OLSKControllerSharedStaticAssetFolders () {
		return [
			'_shared/__external',
		];
	},

};

Object.assign(exports, mod);

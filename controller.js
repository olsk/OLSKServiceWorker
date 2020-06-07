exports.OLSKControllerRoutes = function() {
	return [
		{
			OLSKRouteSignature: 'OLSKServiceWorkerStubRoute',
			OLSKRoutePath: '/stub/OLSKServiceWorker',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction (req, res, next) {
				return res.render(require('path').join(__dirname, 'stub-view'));
			},
			OLSKRouteLanguages: ['en', 'fr', 'es'],
		},
	];
};

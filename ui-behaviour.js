(function() {
	const mod = {

		// DATA

		DataNavigator () {
			return navigator.serviceWorker ? navigator : {
				serviceWorker: {},
			};
		},

		// INTERFACE

		InterfaceLauncherButtonDidClick () {
			window.Launchlet.LCHSingletonCreate({
				LCHOptionRecipes: exports.OLSKServiceWorkerRecipes(window, mod.DataNavigator(), window.OLSKLocalized, true),
			});
		},

	};

	window.OLSKServiceWorkerBehaviour = mod;
})();

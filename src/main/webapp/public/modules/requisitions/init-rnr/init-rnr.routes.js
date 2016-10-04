(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('app.requisitions.initRnr', {
			url: '/requisitions/init-rnr',
			controller: 'InitiateRnrController',
			templateUrl: 'modules/requisitions/init-rnr/init.html'
		});

	}

})();
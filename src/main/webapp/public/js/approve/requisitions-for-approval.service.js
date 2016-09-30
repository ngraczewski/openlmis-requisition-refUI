(function() {
	
	'use strict';

	angular.module('rnr').factory('RequisitionForApproval', function ($resource) {
	  return $resource('/requisitions-for-approval.json', {}, {});
	});

})();
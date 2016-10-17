(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').factory('Requisition', Requisition);

  Requisition.$inject = ['$resource', 'RequisitionURL'];

  function Requisition($resource, RequisitionURL) {
    return $resource(RequisitionURL('/api/requisitions/:id', {id: '@id'}, {
        save: {method: 'PUT'},
        get: {method: 'GET'}
    }));
  }

})();
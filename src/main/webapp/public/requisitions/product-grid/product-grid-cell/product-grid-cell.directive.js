(function() {
  
  'use strict';

  angular.module('openlmis.requisitions')
    .directive('productGridCell', productGridCell);

  productGridCell.$inject = [];

  function productGridCell() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        row: '=',
        col: '=',
        type: '='
      },
      templateUrl: 'requisitions/product-grid/product-grid-cell/product-grid-cell.html',
      link: function(scope) {
        scope.userInput = scope.type === 'USER_INPUT';
      }
    }
  }

})();
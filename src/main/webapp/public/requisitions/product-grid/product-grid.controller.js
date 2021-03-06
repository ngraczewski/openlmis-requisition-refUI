(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .controller('ProductGridCtrl', productGridCtrl);

  productGridCtrl.$inject = ['$scope', 'LineItemFactory'];

  function productGridCtrl($scope, LineItemFactory) {

    angular.forEach($scope.ngModel.requisitionLineItems, function(lineItem) {
      LineItemFactory.extendLineItem(lineItem);
    });

    $scope.ngModel.$getTemplate().then(function(template) {
      $scope.columns = [];
      angular.forEach(template.columnsMap, function(column) {
        $scope.columns.push(column);
      });
    }).finally(function() {
      $scope.templateLoaded = true;
    });

  }

})();
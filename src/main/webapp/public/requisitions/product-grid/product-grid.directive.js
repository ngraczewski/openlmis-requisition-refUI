(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').directive('productGrid', productGrid);

  function productGrid() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        columns: '=columns',
        products: '=products'
      },
      templateUrl: 'requisitions/product-grid/product-grid.html',
      link: function(scope) {
        scope.visibleColumns = getMappedVisibleColumns(scope.columns, ['skipped', 'product', 'productCode'], []);

        $scope.showCategory = function (index) {
          return !((index > 0 ) && (scope.products[index].productCategory == scope.products[index - 1].productCategory));
        };

        function getMappedVisibleColumns(rnrColumns, fixedColumns, skipped) {
          skipped = skipped || [];
          var filteredColumns = _.reject(rnrColumns, function (column) {
            return (skipped.indexOf(column.name) !== -1) || (column.visible !== true);
          });

          var fullSupplyVisibleColumns = _.groupBy(filteredColumns, function (column) {
            if ((fixedColumns.indexOf(column.name) > -1))
              return 'fixed';

            return 'scrollable';
          });

          var nfsColumns = {fixed: [], scrollable: []}; // non-full supply columns
          nfsColumns.fixed = _.filter(fullSupplyVisibleColumns.fixed, function (column) {
            return _.contains(['product', 'productCode'], column.name);
          });

          nfsColumns.scrollable = _.filter(fullSupplyVisibleColumns.scrollable, function (column) {
            return _.contains(RegularRnrLineItem.visibleForNonFullSupplyColumns, column.name);
          });

          // find columns needed for non-full supply products: requested quantity and the reason for the request
          // these are needed/displayed regardless of how the R&R form is setup - ie all non-full supply product requests
          // always have a requested quantity and the associated reason for the request
          // ensure these are in the list of scrollable columns.
          var nfsReqQuantityColumns = _.filter(rnrColumns, function (column) {
            return _.contains(['quantityRequested', 'reasonForRequestedQuantity'], column.name);
          });
          if(nfsReqQuantityColumns.length === 0) throw new Error('Requested Quantity column(s) not found');
          nfsColumns.scrollable = _.union(nfsColumns.scrollable, nfsReqQuantityColumns);

          return {
            fullSupply: fullSupplyVisibleColumns,
            nonFullSupply: nfsColumns
          };
        }
      }
    };
  }

})();
(function() {
  
    'use strict';

    angular.module('openlmis.requisitions').factory('PeriodFactory', periodFactory);

    periodFactory.$inject = ['$q', '$resource', 'RequisitionURL'];

    function periodFactory($q, $resource, RequisitionURL) {

        var resource = $resource(RequisitionURL('/api/requisitions/periods-for-initiate'), {}, {
            getPeriods: {
                method: 'GET',
                isArray: true
            },
            getRequisitions: {
                method: 'GET',
                isArray: true
            }
        });

        var service = {
            get: get
        };
        return service;

        function get(programId, facilityId, emergency) {
            var deferred = $q.defer();

            var periods = resource.getPeriods({
                programId: programId,
                facilityId: facilityId,
                emergency: emergency
            });

            var requisitions = resource.getRequisitions({
                programId: programId,
                facilityId: facilityId
            });

            $q.all([
                periods.$promise,
                requisitions.$promise
            ]).then(function(responses) {
                deferred.resolve(createPeriods(responses[0], responses[1]));
            }).finally(function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function createPeriods(periods, requisitions) {
            var created = [];
            angular.forEach(periods, function(period) {
                var requisition = getRequisitionForPeriod(requisitions, period);
                created.push(createPeriod(period, requisition));
            });
            return created;
        }

        function getRequisitionForPeriod(requisitions, period) {
            var toReturn;
            angular.forEach(requisitions, function(requisition) {
                if (requisition.processingPeriodId === period.id) {
                    toReturn = requisition;
                }
            });
            return toReturn;
        }

        function createPeriod(period, requisition) {
            return new Period(
                period.name,
                formatDate(period.startDate),
                formatDate(period.endDate),
                requisition ? requisition.status : undefined,
                requisition ? requisition.id : undefined
            );
        }

        function formatDate(date) {
            return new Date(date.join('-'));
        }
    }

})();
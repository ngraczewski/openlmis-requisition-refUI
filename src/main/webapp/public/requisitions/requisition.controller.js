/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */
(function() {
    'use strict';

    angular.module('openlmis.requisitions').controller('RequisitionCtrl', RequisitionCtrl);

    RequisitionCtrl.$inject = ['$scope', 'requisition', 'AuthorizationService', 'messageService', '$ngBootbox'];

    function RequisitionCtrl($scope, requisition, AuthorizationService, messageService, $ngBootbox) {
        $scope.requisition = requisition;
        $scope.requisitionType = $scope.requisition.emergency ? "requisition.type.emergency" : "requisition.type.regular";

        $scope.periodDisplayName = function () {
            //TODO: This is a temporary solution.
            return $scope.requisition.processingPeriod.startDate.slice(0,3).join("/") + ' - ' + $scope.requisition.processingPeriod.endDate.slice(0,3).join("/");
        };

        $scope.save = function() {
            Requisition.save({id: this.rnr.id}, this.rnr)
            .$promise.then(
            function(value) {
                $scope.message = "Requisition saved successfuly!";
                $scope.error = "";
            },
            function(error) {
                $scope.error = "There was an error saving this requisition.";
                $scope.message = "";
            }
            )

        $scope.authorizeRnr = function() {
            $ngBootbox.confirm(messageService.get("msg.question.confirmation.authorize")).then(function() {
                $scope.requisition.$authorize().then(
                    function(response) {
                        $ngBootbox.alert(messageService.get('msg.rnr.submitted.success'));
                    }, function(response) {
                        $ngBootbox.alert(messageService.get('msg.rnr.authorized.failure'));
                    }
                );
            });
        };

         $scope.authorizeEnabled = function() {
            return true;
            //return ($scope.requisition === "INITIATED" || $scope.requisition === "SUBMITTED") && AuthorizationService.hasPermission("AUTHORIZE_REQUISITION");
        };
    }
})();

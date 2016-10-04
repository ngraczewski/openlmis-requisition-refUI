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

  angular.module('rnr').controller('InitiateRnrController', InitiateRnrController);

  InitiateRnrController.$inject = ['$scope', 'localStorageService', 'Requisitions', 'AuthorizationService', 'navigateBackService', 'messageService', '$timeout]', 'OpenlmisServerURL', '$http'];

  function InitiateRnrController($scope, localStorageService, Requisitions, AuthorizationService, navigateBackService, messageService, $timeout, OpenlmisServerURL, $http) {
    var isNavigatedBack;

      $scope.selectedRnrType = {"name": "Regular", "emergency": false};

      $scope.rnrTypes = {"types": [
        {"name": messageService.get("requisition.type.regular"), "emergency": false},
        {"name": messageService.get("requisition.type.emergency"), "emergency": true}
      ]};

      var resetRnrData = function () {
        $scope.periodGridData = [];
        $scope.selectedProgram = null;
        $scope.selectedFacilityId = null;
        $scope.myFacility = null;
        $scope.programs = null;
        $scope.facilities = null;
        $scope.error = null;
      };

      $scope.$on('$viewContentLoaded', function () {
        $scope.selectedType = navigateBackService.selectedType || "0";
        $scope.selectedProgram = navigateBackService.selectedProgram;
        $scope.selectedFacilityId = navigateBackService.selectedFacilityId;
        isNavigatedBack = navigateBackService.isNavigatedBack;
        $scope.$watch('programs', function () {
          isNavigatedBack = navigateBackService.isNavigatedBack;
          if (!isNavigatedBack) $scope.selectedProgram = undefined;
          if ($scope.programs && !isUndefined($scope.selectedProgram)) {
            $scope.selectedProgram = _.where($scope.programs, {id: $scope.selectedProgram.id})[0];
            $scope.loadPeriods();
          }
        });
        $scope.loadFacilityData($scope.selectedType);
        if (isNavigatedBack) {

        }
        $scope.$watch('facilities', function () {
          if ($scope.facilities && isNavigatedBack) {
            $scope.selectedFacilityId = navigateBackService.selectedFacilityId;
            isNavigatedBack = false;
          }
        });
      });

      $scope.loadFacilityData = function (selectedType) {
        isNavigatedBack = isNavigatedBack ? selectedType !== "0" : resetRnrData();

        var url = OpenlmisServerURL + '/referencedata/api/users/' +
            localStorageService.get(localStorageKeys.USER_ID) + '&access_token=' +
            localStorageService.get(localStorageKeys.ACCESS_TOKEN);

        $http({ // TODO change to resource Users.get
            method: 'GET',
            url: url,
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function(data) {
           $scope.facilities = [data.homeFacility];
           $scope.myFacility = data.homeFacility;
           if ($scope.myFacility) {
             $scope.facilityDisplayName = $scope.myFacility.code + '-' + $scope.myFacility.name;
             $scope.selectedFacilityId = $scope.myFacility.id;
             $scope.programs = $scope.myFacility.supportedPrograms;
           } else {
             $scope.facilityDisplayName = messageService.get("label.none.assigned");
             $scope.programs = null;
             $scope.selectedProgram = null;
           }
        }).error(function(data) {
            $scope.error = messageService.get("msg.rnr.get.user.info.error");
        });
      };

      var getPeriodSpecificButton = function (activeForRnr) {
        return '<input type="button" ng-click="initRnr(row.entity)" openlmis-message="button.proceed" class="btn btn-primary btn-small grid-btn" ng-show="' + activeForRnr + '"/>';
      };

      var optionMessage = function (entity, defaultMessage) {
        return entity === undefined || _.isEmpty(entity) ? messageService.get("label.none.assigned") : defaultMessage;
      };

      var resetValuesForFirstPeriod = function (periodGridData) {
        var firstPeriodWithRnrStatus = periodGridData[0];
        firstPeriodWithRnrStatus.activeForRnr = true;
        if (!firstPeriodWithRnrStatus.rnrId) {
          firstPeriodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.not.started");
        }
      };

      var createPeriodWithRnrStatus = function (periods, rnrs) {

        if (periods === null || periods.length === 0) {
          $scope.error = messageService.get("msg.no.period.available");
          if ($scope.isEmergency) {
            addPreviousRequisitionToPeriodList(rnrs);
          }
          return;
        }

        $scope.periodGridData = [];

        var periodWithRnrStatus;

        periods.forEach(function (period) {
          periodWithRnrStatus = angular.copy(period);
          if ($scope.isEmergency) {
            periodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.not.started");
          }
          else {
            periodWithRnrStatus.rnrStatus = messageService.get("msg.rnr.previous.pending");
            if (rnrs !== null && rnrs.length > 0 && periodWithRnrStatus.id === rnrs[0].period.id) {
              periodWithRnrStatus.rnrId = rnrs[0].id;
              periodWithRnrStatus.rnrStatus = rnrs[0].status;
            }
          }
          $scope.periodGridData.push(periodWithRnrStatus);
        });

        resetValuesForFirstPeriod($scope.periodGridData);

        if ($scope.isEmergency) {
          addPreviousRequisitionToPeriodList(rnrs);
        }

      };

      var addPreviousRequisitionToPeriodList = function (rnrs) {
        var periodWithRnrStatus;
        if (rnrs === null || rnrs.length === 0) return;
        rnrs.forEach(function (rnr) {
          if (rnr.status === 'INITIATED' || rnr.status === 'SUBMITTED') {
            periodWithRnrStatus = angular.copy(rnr.period);
            periodWithRnrStatus.rnrStatus = rnr.status;
            periodWithRnrStatus.rnrId = rnr.id;
            periodWithRnrStatus.activeForRnr = true;
            $scope.periodGridData.push(periodWithRnrStatus);
          }
        });
      };

      $scope.periodGridOptions = { data: 'periodGridData',
        canSelectRows: false,
        displayFooter: false,
        displaySelectionCheckbox: false,
        enableColumnResize: true,
        enableColumnReordering: true,
        enableSorting: false,
        showColumnMenu: false,
        showFilter: false,
        columnDefs: [
          {field: 'name', displayName: messageService.get("label.periods")},
          {field: 'stringStartDate', displayName: messageService.get("period.header.startDate")},
          {field: 'stringEndDate', displayName: messageService.get("period.header.endDate")},
          {field: 'rnrStatus', displayName: messageService.get("label.rnr.status") },
          {field: '', displayName: '', cellTemplate: getPeriodSpecificButton('row.entity.activeForRnr')}
        ]
      };

      $scope.$watch("error", function (errorMsg) {
        $timeout(function () {
          if (errorMsg) {
            document.getElementById('saveSuccessMsgDiv').scrollIntoView();
          }
        });
      });

      $scope.facilityOptionMessage = function () {
        return optionMessage($scope.facilities, messageService.get("label.select.facility"));
      };

      $scope.programOptionMessage = function () {
        return optionMessage($scope.programs, messageService.get("label.select.program"));
      };

      $scope.loadPeriods = function () {
        $scope.periodGridData = [];
        if (!($scope.selectedProgram && $scope.selectedProgram.id && $scope.selectedFacilityId)) {
          $scope.error = "";
          return;
        }
        var url = OpenlmisServerURL + '/requisition/api/processingPeriods/search?programId=' +
            $scope.selectedProgram.id + '&facilityId=' + $scope.selectedFacilityId +
            '&access_token=' + localStorageService.get(localStorageKeys.ACCESS_TOKEN);

        $http({ // TODO change to resource PeriodsForProgramAndFacility.get
            method: 'GET',
            url: url,
            headers: {
                "Content-Type": "application/json"
            }
        }).success(function(data) {
           $scope.error = "";
           $scope.isEmergency = data.is_emergency;
           createPeriodWithRnrStatus(data.periods, data.rnr_list);
        }).error(function(data) {
            if (data.data.error === 'error.current.rnr.already.post.submit') {
              $scope.error = $scope.selectedType !== "0" ? messageService.get("msg.no.rnr.awaiting.authorization") :
                messageService.get("msg.rnr.current.period.already.submitted");
              return;
            }
            $scope.error = data.data.error;
        });
      };

      $scope.initRnr = function (selectedPeriod) {
        var data = {selectedType: $scope.selectedType, selectedProgram: $scope.selectedProgram, selectedFacilityId: $scope.selectedFacilityId, isNavigatedBack: true},
            url = OpenlmisServerURL + '/requisition/requisitions/' + selectedPeriod.rnrId +
                            '?access_token=' + localStorageService.get(localStorageKeys.ACCESS_TOKEN);

        navigateBackService.setData(data);
        $scope.error = "";

          if (selectedPeriod.rnrId) {

            $http({ // TODO change to resource Requisition.get
                method: 'GET',
                url: url,
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function(data) {
               $scope.$parent.rnrData = data;
               // TODO go to create Rnr
            }).error(function(data) {
                $scope.error = data.data.error ? data.data.error : messageService.get("error.requisition.not.exist");
            });
          } else {

            $http({ // TODO change to resource Requisition.save
                method: 'PUT',
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    facility: $scope.selectedFacilityId,
                    program: $scope.selectedProgram.id,
                    processingPeriod: selectedPeriod.id,
                    emergency: $scope.selectedRnrType.emergency
                }
            }).success(function(data) {
               $scope.$parent.rnrData = data;
                // TODO go to create Rnr
            }).error(function(data) {
                $scope.error = data.data.error ? data.data.error : messageService.get("error.requisition.not.exist");
            });
          }
      };
})();
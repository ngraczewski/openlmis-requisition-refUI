/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

(function(){
  "use strict";

  angular.module("openlmis-auth")
    .controller("LoginController", LoginController);

  LoginController.$inject = ['$scope', 'LoginService', 'localStorageService', 'messageService'];

  function LoginController($scope, LoginService, localStorageService, messageService) {
    var FORGOT_PASSWORD = "/public/pages/forgot-password.html";

    var validateLoginForm = function() {
      if ($scope.username === undefined || $scope.username.trim() === '') {
        $scope.loginError = messageService.get("error.login.username");
        return false;
      }
      if ($scope.password === undefined) {
        $scope.loginError = messageService.get("error.login.password");
        return false;
      }
      return true;
    };

    $scope.doLogin = function() {
      if (!validateLoginForm()) {
        return;
      }

      $scope.disableSignInButton = true;
      LoginService.login($scope.username, $scope.password)
      .then(function(){
        $scope.$emit('auth.login');
      })
      .catch(function(){
        //$scope.loginError = messageService.get("user.authentication.error");
        $scope.loginError = messageService.get("user.login.error");
      })
      .finally(function(){
        $scope.disableSignInButton = false;
        $scope.password = undefined;
      });
    };

    $scope.goToForgotPassword = function() {
      window.location = FORGOT_PASSWORD;
    };

    function getRights(rightList) {
      var rights = [];
      if (!rightList) return rights;
      $.each(rightList, function(index, right) {
        rights.push({
          name: right.name,
          type: right.type
        });
      });
      return JSON.stringify(rights);
    }
  }
}());
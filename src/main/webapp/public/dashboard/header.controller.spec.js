/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe("HeaderController", function() {
  beforeEach(module('openlmis-dashboard'));
  beforeEach(module('ui.directives'));

  var scope, loginConfig, window, localStorageService, httpBackend, $state;

  beforeEach(inject(function($rootScope, $controller, _localStorageService_, _$httpBackend_, _$state_, LoginService, $q) {
    $state = _$state_;
    spyOn($state, 'reload');

    httpBackend = _$httpBackend_;
    loginConfig = {
      a: {},
      b: {}
    };
    scope = $rootScope.$new();
    window = {};
    localStorageService = _localStorageService_;
    access_token = '4b06a35c-9684-4f8c-b9d0-ce2c6cd685de';
    spyOn(localStorageService, 'get').andReturn(access_token);
    spyOn(localStorageService, 'remove');
    $controller('HeaderController', {
      $scope: scope,
      localStorageService: localStorageService,
      loginConfig: loginConfig,
      $window: window
    });

    spyOn(LoginService, 'logout').andReturn($q.when());
  }));

  it('should set login config in scope', function() {
    expect(scope.loginConfig).toEqual(loginConfig);
  });

  it('should navigate to login page when user logs out', function() {

    scope.logout();
    scope.$apply();
    
    // Page state is on login page
    expect($state.reload).toHaveBeenCalled();
  });
});
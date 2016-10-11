/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
ddescribe("NavigationController", function() {

  var scope, NavigationCtrl;

  beforeEach(module('openlmis-dashboard'));

  beforeEach(module(function($stateProvider){
      $stateProvider
      .state('test', {
        url: '^/foo/',
        showInNavigation: true
      })
      .state('test.sub', {
        url: 'bar',
        showInNavigation: true
      })
      .state('dont-test', {
        url: '^/bar/',
        showInNavigation: false
      })
      .state('test-alt', {
        url: '^/bar/',
        showInNavigation: true
      });
    }));

  beforeEach(inject(function($rootScope, $controller, _localStorageService_) {
    scope = $rootScope.$new();
    localStorageService = _localStorageService_;

    NavigationCtrl = $controller('NavigationController', {
      $scope: scope
    });
    
  }));

  it('Gathers ui-router states', function(){

    expect(NavigationCtrl.navigation).toEqual(['test', 'test-alt']); 
  });

});
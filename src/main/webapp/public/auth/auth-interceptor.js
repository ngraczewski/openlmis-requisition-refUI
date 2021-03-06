/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

 (function(){
    "use strict";

    angular.module('openlmis-auth')
        .run(authStateChangeInjector);

    authStateChangeInjector.$inject = ['$rootScope', '$state', 'AuthorizationService'];
    function authStateChangeInjector($rootScope, $state, AuthorizationService){
        //$rootScope.$on('$viewContentLoading', redirectAuthState);
        $rootScope.$on('$stateChangeStart', redirectAuthState);

        function redirectAuthState(event, toState, toParams, fromState, fromParams){
            if(!AuthorizationService.isAuthenticated() && toState.name.indexOf('auth') != 0){
                // if not authenticated and not on login page
                event.preventDefault();
                $state.go('auth.login');
            } else if(AuthorizationService.isAuthenticated() && toState.name.indexOf('auth') == 0) {
                // if authenticated and on login page
                event.preventDefault();
                $state.go('home');
            }
        }

        $rootScope.$on('auth.login', function(){
            $state.go('home');
        });
    }

})();
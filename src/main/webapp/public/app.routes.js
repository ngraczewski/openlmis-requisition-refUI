(function() {

  "use strict";

  angular.module('openlmis').config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routes($stateProvider, $urlRouterProvider) {

    $stateProvider.state('app', {
        abstract: true,
        views: {
          'header@': { 
            controller: 'HeaderController',
            templateUrl: 'header/header.html'
          },
          'navigation@': { 
            controller: 'NavigationController',
            templateUrl: 'navigation/navigation.html' 
          },
          '': { 
            template: '<div ui-view></div>' 
          }
        }
    }).state('app.home', {
        url: '/home',
        templateUrl: 'home.html'
    })
    .state('app.rnr.init', {
        url: '/rnr/init',
        templateUrl: 'pages/logistics/rnr/partials/create/init.html',
        controller: 'InitiateRnrController'
    });

    $urlRouterProvider.otherwise("/home");

  }

})();
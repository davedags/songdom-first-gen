'use strict';

angular.module('dagsApp', [
  'ngResource',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'SignupCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  }).run(function($rootScope, $http) {

	  /**
	   *  Assign any data/objects needed in any view here 
	   */

      $http({
	  method: 'GET', 
	  url: '/api/getauth'
      }).
	  success(function(data, status, headers, config) {
	      if (data.user_id) {
		  $rootScope.authUser = data;
	      } else {
		  $rootScope.authUser = '';
	      }
	  }).
	  error(function(data, status, headers, config) {
	      $rootScope.authUser = '';
	  })
      
 });

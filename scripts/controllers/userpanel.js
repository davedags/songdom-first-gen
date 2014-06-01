'use strict';

angular.module('dagsApp')
    .controller('UserPanelCtrl', function ($scope, $rootScope, $http, $location) {
      if ($scope.authUser) {
	  $scope.showLogout = true;
      } else {
	  $scope.showLogin = true;
      }

      $scope.logout = function() {
	  $http({
	      method: 'POST', 
	      url: '/api/logout',
	  }).
	      success(function(data, status, headers, config) {
		  $scope.authUser = '';
		  $rootScope.authUser = '';
		  return $location.path('/');
	      }).
	      error(function(data, status, headers, config) {
		  
	      })
      }
    })

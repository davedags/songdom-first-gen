'use strict';

angular.module('dagsApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $http, $location) {
	$scope.login = function() {
	    var data = 'email=' + $scope.email + '&password=' + $scope.password;
	    $http({
		method: 'POST', 
		url: '/api/login',
		data:  data,
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).
		success(function(data, status, headers, config) {
		    if (data.user_id) {
			$scope.authUser = data;
			$rootScope.authUser = data;
			$scope.loginMessage= '';
			return $location.path('/');
		    } else {
			$scope.authUser = '';
			$rootScope.authUser = '';
			$scope.loginMessage = 'Incorrect Email or Password';
		    }
		}).
		error(function(data, status, headers, config) {
		    $scope.authUser = '';
		    $rootScope.authUser = '';
		    $scope.loginMessage = 'Incorrect Email or Password';
		})
	}
	
    })

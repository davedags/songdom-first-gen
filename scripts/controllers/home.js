'use strict';

angular.module('dagsApp')
	.directive('focusInput', function($timeout){
			return function(scope, element, attr){
				// Whenever the `focus-input` statement changes this callback function will be executed.
				scope.$watch(attr.focusInput, function(value){
						// If the `focus-input` statement evaluates to `true`
						// then use jQuery to set focus on the element.
						if (value){
							$timeout(function(){
									element.select();
								});
						}
					});
			};
    })
  .controller('HomeCtrl', function ($scope, $rootScope, $http) {
			$scope.searchQuery = $scope.searchQuery || '';
			$scope.response = $scope.response || '';

			if (!$rootScope.gotFaves) {
				$rootScope.gotFaves = true;
				$http({
						method: 'GET', 
							url: '/api/favorites'
							}).
					success(function(data, status, headers, config) {
							$scope.favorites = data;
						}).
					error(function(data, status, headers, config) {
							// or server returns response with an error status.
					});
				$scope.gotFaves = true;
			}
			
              $scope.runSearch = function() {		  
				$scope.response = '';
				var params = {'q': $scope.searchQuery};
				$http({
						method: 'GET', 
							url: '/api/search',
							'params':  params
							}).
				success(function(data, status, headers, config) {
						$scope.response = {};
						if (data.url) {
							$scope.response.lyrics = data;
						} else {
							$scope.response.error = true;
						}
						
						// this callback will be called asynchronously
						// when the response is available
					}).
				error(function(data, status, headers, config) {
							$scope.response.lyrics = {
								'url': '',
								'error': true,
								'lyrics': []
							};

						// or server returns response with an error status.
					});
								
			}


			$scope.showSuggestion = function(url, $event) {
				var params = {
					'q': url,
					'context': 'suggestion'
				};
				$http({
						method: 'GET', 
							url: '/api/search',
							'params':  params
							}).
				success(function(data, status, headers, config) {
						if (!$scope.response.lyrics) {
							$scope.response = {};

							$scope.response.lyrics = {
								'url': '',
								'error': true,
								'lyrics': []
							};
						}
						$scope.response.lyrics.lyrics = '';
						if (data.lyrics) {
							$scope.response.lyrics.lyrics = data.lyrics;
						} else {
							$scope.response.error = true;
							$scope.response.lyrics = {};
						}
					}).
				error(function(data, status, headers, config) {
						$scope.response.lyrics = {
							'url': '',
							'error': true,
							'lyrics': []
						};
						// or server returns response with an error status.
					});

				$event.preventDefault();
			}

			$scope.favorite = function(favorite, $event) {
				var params = {
					'song_id': favorite
				};
				$http({
						method: 'GET', 
							url: '/api/favorite',
							'params':  params
							}).
				success(function(data, status, headers, config) {
						console.log(data);
					}).
				error(function(data, status, headers, config) {
						// or server returns response with an error status.
					});

				$event.preventDefault();
			}
			
			$scope.clearSearch = function($event) {
				$scope.searchQuery = '';
				$scope.response = '';
				$event.preventDefault();
			}

			$scope.dismissSuggestions = function($event) {
				$event.preventDefault();
			}
		})

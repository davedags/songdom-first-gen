'use strict';

angular.module('dagsApp')
    .controller('SignupCtrl', function ($scope, $rootScope, UserService, $location) {

	window.fbAsyncInit = function() {
	    FB.init({
		appId      : '248414791983381', //Songdom

		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	    });

	    FB.Event.subscribe('auth.authResponseChange', function(response) {		
		if (response.status === 'connected') {
		    //already connected should be show alert message or redirect and login

		    var promise;
		    $scope.user = new UserService();	
		    var user_data = FB.api('/me',function(user_data) { 
			$scope.user.email = user_data.email;
			$scope.user.fullname = user_data.name;
			$scope.user.password = '1234';
			$scope.user.$save();

			promise = $scope.user.$save();
			promise.then(function(user) {
			    $rootScope.authUser = {
				'user_id': user.user_id,
				'email': user.email,
				'fullname': user.fullname
			    };
			    return $location.path('/');
			});			
		    });   
		}
	    });
	};

	// Load the SDK asynchronously
	(function(d){
	    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];	    
	    if (d.getElementById(id)) {return;}
	    js = d.createElement('script'); js.id = id; js.async = true;
	    js.src = "//connect.facebook.net/en_US/all.js";
	    ref.parentNode.insertBefore(js, ref);
	}(document));

	// Here we run a very simple test of the Graph API after login is successful. 
	// This testAPI() function is only called in those cases. 
	function testAPI() {
	    console.log('Welcome!  Fetching your information.... ');
	    FB.api('/me', function(response) {
		console.log('Good to see you, ' + response.name + '.');
	    });
	}

	
	$scope.user = new UserService();

	$scope.signup = function () {
            var promise;
            promise = $scope.user.$save();
            promise.then(function(user) {
		$rootScope.authUser = {
		    'user_id': user.user_id,
		    'email': user.email,
		    'fullname': user.fullname
		};
                return $location.path('/');
            })
        }
	
	
    })

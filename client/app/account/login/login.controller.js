'use strict';

angular.module('webstormProjectsApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = Auth.getCurrentUser().name;
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    //TODO: https://api.twitter.com/oauth/authorize?oauth_token=trioyQAAAAAAfAHxAAABTpfCP8k is where the app should go, instead it's going to
    //https://api.twitter.com/oauth/authenticate?oauth_token=GL3qIwAAAAAAgoTvAAABTpfEnuk
    // and only...
    // GET /auth/twitter/callback?oauth_token=qJrllwAAAAAAgoTvAAABTpfDeyw&oauth_verifier=xIM9b01iiNeenv5pHGA9KRzl0XKDqfvP 302 1004ms - 58b
  });

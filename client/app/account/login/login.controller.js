'use strict';

angular.module('webstormProjectsApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
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

    $scope.modal =  {
      dismissable: true,
      title: 'Login',
      text: 'Oops! You forgot to login!',
      buttons: [{text: 'Cancel'}, {text: 'Twitter Login'/*, click: $scope.loginOauth('twitter')*/}]
    };



  });

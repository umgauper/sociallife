'use strict';

angular.module('webstormProjectsApp')
  .controller('MainCtrl', function ($scope, $http) {

      $scope.search = function() {

        // get data via yelp's search API

        var url = 'http://api.yelp.com/v2/search?term=bar&location=';
            url = url + $scope.user.location; // will need to turn spaces btwn words into '+' for two or three word places

        $http.get(url).success(function(data) {

            console.log(data);

        });


      }

  });

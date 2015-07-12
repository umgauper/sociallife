'use strict';

angular.module('webstormProjectsApp')
  .controller('MainCtrl', function ($scope, $http) {

      $scope.search = function() {

        // get data via yelp's search API

        $http.get('api/datas') //later we'll send location as parameter as {location: $scope.user.location};

          .success(function(data) {
            $scope.bars = data.businesses; //the business array
          });


      }

  });

'use strict';

angular.module('webstormProjectsApp')
  .controller('MainCtrl', function ($scope, $http) {

      //$scope.location = '';

      $scope.user = 'Test User 1'; //later after Twitter auth working, change to Auth.getCurrentUser()

      $scope.search = function() {

        // get data from api/places

        $http.get('api/places/' + $scope.location.toLowerCase());

        // get data via yelp's search API

        $http.get('api/datas/' + $scope.location)

          .success(function(data) {
            $scope.bars = data.businesses; //the business array
          });


      };

      $scope.addMe = function(location, place) {
        location = location.toLowerCase();
        $http.post('api/places', {location: location, place: place, users: [$scope.user]});
      };

  });

'use strict';

angular.module('webstormProjectsApp')
  .controller('MainCtrl', function ($scope, $http) {

      //$scope.location = '';

      $scope.user = 'Test User 1'; //later after Twitter auth working, change to Auth.getCurrentUser()

      $scope.search = function() {

        // get data from api/places

        $http.get('api/places/' + $scope.location.toLowerCase())

          .success(function (data) {
            $scope.places_data = data;

            $http.get('api/datas/' + $scope.location)

              .success(function (data) {
                $scope.bars = data.businesses; //the business array

                $scope.bars.forEach(function(el) {
                  el.user_count = $scope.countUsers(el.name);
                });
              })
          });

      };

      $scope.addMe = function(location, place, index) {
        location = location.toLowerCase();

        //check if place already exists in the database

        $http.get('api/places/' + location + '/' + place)

          .success(function(data) {
            if(data.length > 0) { // if place exists in database

              // PUT request to update existing place object in db

            } else {
              // post new object for place to db
              $http.post('api/places', {location: location, place: place, users: [$scope.user]})

                .success(function() {
                  console.log($scope.bars[index]); //working

                  //update model for place.user_count;
                  $scope.bars[index].user_count++;
                });
            }
          });
      };

      $scope.countUsers = function(place) {
        var place_name = place;

        var place_obj = $scope.places_data.filter(function(el) {
          return el.place === place
        })[0];

        if(place_obj) return place_obj.users.length;
        return 0
      };
  });

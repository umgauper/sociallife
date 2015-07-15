'use strict';

angular.module('webstormProjectsApp')
  .controller('MainCtrl', function ($scope, $http) {

      $scope.isGoingArr = [];
      $scope.user = 'Test User 1'; //later after Twitter auth working, change to Auth.getCurrentUser()

      $scope.search = function() {

        $scope.isGoingArr = [];
        // get data from api/places

        $http.get('api/places/' + $scope.location.toLowerCase())
          .success(function (data) {
            $scope.places_data = data;

            $http.get('api/datas/' + $scope.location)

              .success(function (data) {
                $scope.bars = data.businesses; //the business array

                $scope.bars.forEach(function(el) {
                  el.user_count = $scope.countUsers(el.name);
                  $scope.isGoingArr.push($scope.isGoing(el.name));
                });

                $scope.cssVar = 'searchBarUp';
                $scope.cssVar2 = 'resultsUp';
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

              //make sure user isn't already in the users array (shouldn't be able to click Add Me if they are, but this is extra good...

              $http.put('api/places/' + data[0]._id, {user: $scope.user})

                .success(function(data) {
                  $scope.bars[index].user_count++;
                  $scope.isGoingArr[index] = true;

                });
            } else {
              // post new object for place to db
              $http.post('api/places', {location: location, place: place, users: [$scope.user]})

                .success(function() {
                  //update model for place.user_count;
                  $scope.bars[index].user_count++;
                  $scope.isGoingArr[index] = true;
                });
            }
          });
      };

      $scope.removeMe = function(location, place, index) {
        $http.get('api/places/' + location.toLowerCase() + '/' + place)
          .success(function(data) {
            $http.put('api/places/' + data[0]._id + '/' + $scope.user)
              .success(function() {
                //update model for place.user_count
                $scope.bars[index].user_count--;
                $scope.isGoingArr[index] = false;

              })
          })
      };

      $scope.countUsers = function(place) {
        var place_name = place;

        var place_obj = $scope.places_data.filter(function(el) {
          return el.place === place
        })[0];

        if(place_obj) return place_obj.users.length;
        return 0
      };

      $scope.isGoing = function(place) {
        //go through $scope.places data, return object that matches place...then check if $scope.user is in users array.

        var place_obj = $scope.places_data.filter(function(el) {
          return el.place === place
        });

        if(!place_obj[0]) {
          return false;
        } else {
          var users = place_obj[0].users;
          return users.indexOf($scope.user) !== -1
        }
    }
  });

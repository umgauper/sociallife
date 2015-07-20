'use strict';

angular.module('sociallifeApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $modal) {

      $scope.isGoingArr = [];

      $scope.openLogin = function() {
        $modal.open({
            templateUrl: 'components/modal/modal.html',
            controller: 'LoginCtrl'
          });
      };

      $scope.search = function() {
        // get data from api/places

        $http.get('api/places/' + $scope.location.toLowerCase())
          .success(function (data) {
            $scope.places_data = data;

            $http.get('api/datas/' + $scope.location)

              .success(function (data) {
                $scope.isGoingArr = [];
                 //the business array
                data.businesses.forEach(function(el) {
                  el.user_count = $scope.countUsers(el.name);
                  $scope.isGoingArr.push($scope.isGoing(el.name));
                });

                $scope.bars = data.businesses;
                $scope.cssVar = 'searchBarUp';
                $scope.cssVar2 = 'resultsUp';
              })
          });
      };

      $scope.addMe = function(location, place, index) {
        console.log(Auth.getCurrentUser().name);

        $scope.user = Auth.getCurrentUser().name;

        location = location.toLowerCase();

        if(!Auth.getCurrentUser().name) {
          $scope.openLogin();
        } else {
          //check if place already exists in the database
          $http.get('api/places/' + location + '/' + place)
            .success(function (data) {
              if (data.length > 0) { // if place exists in database
                $http.put('api/places/' + data[0]._id, {user: $scope.user})
                  .success(function (data) {
                    $scope.bars[index].user_count++;
                    $scope.isGoingArr[index] = true;
                  });
              } else {
                // if not, post new object for place to db
                $http.post('api/places', {location: location, place: place, users: [$scope.user]})
                  .success(function () {
                    //update model for place.user_count;
                    $scope.bars[index].user_count++;
                    $scope.isGoingArr[index] = true;
                  });
              }
            });
        }
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

        var place_obj = $scope.places_data.filter(function(el) {
          return el.place === place
        });

        if(!place_obj[0]) {
          return false;
        } else {
          var users = place_obj[0].users;
          return users.indexOf(Auth.getCurrentUser().name) !== -1
        }
    }
  });

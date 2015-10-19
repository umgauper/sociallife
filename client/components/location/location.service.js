angular.module('sociallifeApp')
  .service('saveLocation', function () {
    var savedLocation = '';

    return {
      getLocation: function () {
        return savedLocation;
      },
      setLocation: function(value) {
        savedLocation = value;
      }
    };
  });

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var module = angular.module('annoyingApp', ['ionic'])

// http://angularjstutorial.blogspot.ca/2012/12/angularjs-with-input-file-directive.html#.WqB10ujwbIU
// use this to fix the problem where you can't bind an input that accepts files
// -------------------------------------------------------------------
module.directive('file', function(){
  return {
      scope: {
          file: '='
      },
      link: function(scope, el, attrs){
          el.bind('change', function(event){
              var files = event.target.files;
              alert(files);
              scope.file = files[0] ? files[0] : undefined;
              alert(scope.file);
              scope.$apply();
          });
      }
  };
});
// -------------------------------------------------------------------

module.controller('setupFormCtrl', function($scope, $http) {
  $scope.model = {};
  $scope.model.isTimerSet = false;
  $scope.model.timerStatus = "Timer is off!";

  $scope.start = function() {
    $scope.model.timerStatus = "Timer is set!";
    $scope.model.isTimerSet = true;
  };

  $scope.stop = function() {
    $scope.model.timerStatus = "Timer is off!";
    $scope.model.isTimerSet = false;
  };

  $scope.isTimerSet = function() {
    if (!$scope.model.isTimerSet) {
      return "red";
    }
    else {
      return "green";
    }
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

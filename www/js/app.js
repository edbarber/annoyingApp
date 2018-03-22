
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var module = angular.module('annoyingApp', ['ionic'])

var error = false;

// http://angularjstutorial.blogspot.ca/2012/12/angularjs-with-input-file-directive.html#.WqB10ujwbIU
// use this to fix the problem where you can't bind an input that accepts files
// -------------------------------------------------------------------
module.directive('file', function() {
  return {
      scope: {
          file: '='
      },
      link: function(scope, el, attrs) {
        el.bind('change', function(event) {
          var files = event.target.files;
          scope.file = files[0] ? files[0] : undefined;

          if (scope.file == undefined) {
            error = true;
            return;
          }

          error = scope.file.type == "audio/wav" || scope.file.type == "audio/mp3" ? false : true;
          scope.$apply();
        });
      }
  };
});
// -------------------------------------------------------------------

module.controller('setupFormCtrl', function($scope, $http) {  
  $scope.model = {};
  $scope.model.timerStatus = "Timer is off!";

  var reader = registerReader();
  var isPlaying = false;
  var currentSound = undefined;
  var timeoutHandle = undefined;
  var isTimerSet = false;

  function registerReader() {
    var reader = new FileReader();
    reader.onload = function(e) {
      if (isPlaying) {
        var soundSrc = e.target.result;
        currentSound = new Audio(soundSrc);
        
        currentSound.play();
        stopTimer();
        $scope.$apply();
      }
      else if (currentSound != undefined) {
        // a bit of a hack fix to force the sound off as stop refuses to work
        currentSound.pause();
        currentSound.currentTime = 0; 
      }
    }

    return reader;
  }

  function stopSound(sound) {
    if (sound != undefined) {
      isPlaying = false;
      reader.readAsDataURL(sound);
    }
  }

  function cancelScheduledSound() {
    if (timeoutHandle != undefined) {
      clearTimeout(timeoutHandle);
    }
  }

  function calculateMilliseconds(startTime, endTime) {
    return (endTime - startTime) / 1000 * 1000;
  }

  function checkAppropriateTime(startTime, endTime) {
    if (startTime == undefined || endTime == undefined) {
      return false;
    }

    var currDate = new Date();
    startTime = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 
      startTime.getHours(), startTime.getMinutes(), startTime.getSeconds(), 
      startTime.getMilliseconds());
    endTime = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 
      endTime.getHours(), endTime.getMinutes(), endTime.getSeconds(), 
      endTime.getMilliseconds());

    if (currDate > startTime || currDate > endTime) {
      return false;
    }

    return true;
  }

  $scope.start = function() {
    if (error || $scope.model.annoyingSound == undefined) {
      stopTimer();
      $scope.model.timerStatus = "Please specify a valid file!";
      
      return;
    }

    var startTime = $scope.model.startTime;
    var endTime = $scope.model.endTime;
    
    if (!checkAppropriateTime(startTime, endTime)) {
      stopTimer();
      $scope.model.timerStatus = "Please specify a start and end time greater than the current time!";

      return;
    }

    $scope.model.timerStatus = "Timer is set!";
    isTimerSet = true;

    cancelScheduledSound();      // make sure we don't have leaked timeout handlers

    // a bit of a "hack" fix to force the date so we don't have incorrect years and whatnot
    // ------------------------------------------------------------------
    var tempCurrDate = new Date();
    var currDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), tempCurrDate.getHours(), tempCurrDate.getMinutes(), 
      tempCurrDate.getSeconds(), tempCurrDate.getMilliseconds());
    // ------------------------------------------------------------------
    
    var millisecDiff = Math.random() * 
      calculateMilliseconds(startTime, endTime) +
      calculateMilliseconds(currDate, startTime);

    timeoutHandle = setTimeout(function() {
      if (error || $scope.model.annoyingSound == undefined) {
        $scope.model.timerStatus = "Please specify a valid file!";
        $scope.$apply();
        
        return; // don't bother executing the rest if sound doesn't exist
      }
      
      stopSound($scope.model.annoyingSound);       // in case sound is playing

      isPlaying = true;
      reader = registerReader();
    }, millisecDiff);
  };

  $scope.stop = function() {
    stopTimer();
    stopSound($scope.model.annoyingSound);
  };

  function stopTimer() {
    $scope.model.timerStatus = "Timer is off!";
    isTimerSet = false;

    cancelScheduledSound();
  }

  $scope.timerStatusColor = function() {
    if (!isTimerSet || error) {
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

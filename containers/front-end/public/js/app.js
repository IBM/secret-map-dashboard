"use strict";
// Declare app level module which depends on filters, and services

var app = angular.module("dashBoardApp", []);
  
app.controller("mapCtrl", function($scope, $http){
  $http.get("http://169.46.74.117/get_events")
    .then(function(res) {
      $scope.map = res.data[0].map;
      $scope.beacons = res.data[0].beacons;
    });
});

app.controller("dashboardCtrl", function($scope, $http){
  $http.get("http://169.46.74.117/get_events")
    .then(function(res) {
        $scope.conferenceTitle = res.data[0].eventDescription + " " + res.data[0].location + " Conference";
        $scope.calories = 10000;
        $scope.steps = 23000;
        $scope.participants = 240;
        $scope.totalDistance = 52;
        $scope.fitCoins = 750;
    });
});

angular.forEach(["x", "y", "width", "height"], function(name) {
  var ngName = "ng" + name[0].toUpperCase() + name.slice(1);
  app.directive(ngName, function() {
    return function(scope, element, attrs) {
      attrs.$observe(ngName, function(value) {
        attrs.$set(name, value*10); 
      });
    };
  });
});

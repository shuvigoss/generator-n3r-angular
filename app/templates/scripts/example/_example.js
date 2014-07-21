define(["angular", "config"], function (angular, config) {
    "use strict";
    angular.module("exampleModule", [], function () {})
    .controller("exampleController", ["$scope", function($scope){
        $scope.say = "hello angular! hello asiainfo N3!";
    }]);
});
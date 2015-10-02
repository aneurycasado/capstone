var app = angular.module('TowerDefense', ['ui.router']);
app.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});


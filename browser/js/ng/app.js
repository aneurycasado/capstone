var angular = require('angular');
var app = angular.module('TowerDefense', [require('ui.router')]);
app.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});


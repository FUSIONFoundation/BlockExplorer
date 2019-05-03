import angular from 'angular';
import navController from './controllers/controller.js';

angular
    .module('myApp.nav', [])
    .controller('navController', navController);

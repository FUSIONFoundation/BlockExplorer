import angular from 'angular';
import dashboardController from './controllers/controller.js';

angular
  .module('myApp.dashboard', [])
  .controller('dashboardController', dashboardController);

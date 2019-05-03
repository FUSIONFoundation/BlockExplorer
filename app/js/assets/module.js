import angular from 'angular';
import assetsController from './controllers/controller.js';

angular
  .module('myApp.assets', [])
  .controller('assetsController', assetsController);

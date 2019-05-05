import angular from 'angular';
import addressesController from './controllers/controller.js';

angular
  .module('myApp.addresses', [])
  .controller('addressesController', addressesController);

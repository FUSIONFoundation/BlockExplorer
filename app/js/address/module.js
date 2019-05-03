import angular from 'angular';
import addressController from './controllers/controller.js';

angular
  .module('myApp.address', [])
  .controller('addressController', addressController);

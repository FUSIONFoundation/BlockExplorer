import angular from 'angular';
import transactionController from './controllers/controller.js';

angular
  .module('myApp.transaction', [])
  .controller('transactionController', transactionController);

import angular from 'angular';
import transactionsController from './controllers/controller.js';

angular
  .module('myApp.transactions', [])
  .controller('transactionsController', transactionsController);

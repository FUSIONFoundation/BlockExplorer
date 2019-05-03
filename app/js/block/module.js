import angular from 'angular';
import blockController from './controllers/controller.js';

angular
  .module('myApp.block', [])
  .controller('blockController', blockController);

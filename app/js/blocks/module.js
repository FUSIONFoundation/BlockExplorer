import angular from 'angular';
import blocksController from './controllers/controller.js';

angular
  .module('myApp.blocks', [])
  .controller('blocksController', blocksController);

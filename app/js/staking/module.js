import angular from 'angular';
import stakingController from './controllers/controller.js';

angular
  .module('myApp.staking', [])
  .controller('stakingController', stakingController);

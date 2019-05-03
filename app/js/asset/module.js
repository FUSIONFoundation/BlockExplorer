import angular from 'angular';
import assetController from './controllers/controller.js';

angular
    .module('myApp.asset', [])
    .controller('assetController', assetController);

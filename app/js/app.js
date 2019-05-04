import angular from 'angular';
import 'angular-ui-router';
import 'angular-material';
import configRouter from './config.js';
import './dashboard/module.js';
import './block/module.js';
import './blocks/module.js';
import './transaction/module.js';
import './asset/module.js';
import './assets/module.js';
import './address/module.js';
import './nav/module.js';
import './staking/module.js';
import './transactions/module.js';
import BigNumber from 'bignumber.js';
window.BigNumber = BigNumber;
import moment from 'moment';
window.moment = moment;
import numeral from 'numeral';
window.numeral = numeral;
import {format, render, cancel, register} from 'timeago.js';
window.format = format;
let Web3 = require('web3');
let web3FusionExtend = require('web3-fusion-extend');
let web3 = new Web3();
web3 = web3FusionExtend.extend(web3);
window.web3 = web3;
let utils = require('./utils/utils.js');
window.utils = utils;

let dependencies = [
    'ui.router',
    'ngMaterial',
    'myApp.dashboard',
    'myApp.block',
    'myApp.transaction',
    'myApp.transactions',
    'myApp.asset',
    'myApp.assets',
    'myApp.nav',
    'myApp.address',
    'myApp.blocks',
    'myApp.staking'
];

angular
    .module('myApp', dependencies)
    .config(configRouter)
    .filter('startFrom', function() {
    return function (input, start) {
        if (typeof input === 'undefined') {
            return;
        } else {
            start = +start; //parse to int
            return input.slice(start);
        }
    };
});

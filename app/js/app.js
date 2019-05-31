import angular from 'angular';

require('babel-polyfill');
window.allAssets = [];
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
import './addresses/module.js';
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
let provider;
provider = new Web3.providers.WebsocketProvider('wss://gatewaypsn2w.fusionnetwork.io:10001');
let web3 = new Web3(provider);
web3 = web3FusionExtend.extend(web3);
window.web3 = web3;

function keepWeb3Alive() {
    console.log(`Keep Web3 alive!`)
    provider = new Web3.providers.WebsocketProvider('wss://gatewaypsn2w.fusionnetwork.io:10001');

    provider.on('connect', function () {
        window.web3._isConnected = true;
        console.log(`Web3 connection = true`)
    });
    provider.on('error', function (err) {
        provider.disconnect();
        console.log(`Web3 connection = false`)
    });
    provider.on('end', function (err) {
        web3._isConnected = false;
        console.log('web3 connection error ', err);
        console.log('will try to reconnect');
        setTimeout(keepWeb3Alive(), 2);
    });
    web3 = new Web3(provider);
    web3 = window.web3FusionExtend.extend(web3);
    window.web3 = web3;
}

keepWeb3Alive();
let utils = require('./utils/utils.js');
window.utils = utils;

window.months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

window.getServer = function () {
    return 'https://api.fusionnetwork.io/'
}

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
    'myApp.staking',
    'myApp.addresses'
];

angular
    .module('myApp', dependencies)
    .config(configRouter)
    .filter('startFrom', function () {
        return function (input, start) {
            if (typeof input === 'undefined') {
                return;
            } else {
                start = +start; //parse to int
                return input.slice(start);
            }
        };
    });

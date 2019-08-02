import angular from 'angular';
let angularTranslate = require('angular-translate');
let marked = require('./utils/customMarked');
window.marked = marked;
require('babel-polyfill');
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
let $http = angular.injector(["ng"]).get("$http");


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
provider = new Web3.providers.WebsocketProvider('wss://mainnetpublicgateway1.fusionnetwork.io:10001');
let web3 = new Web3(provider);
web3 = web3FusionExtend.extend(web3);
window.web3 = web3;

function keepWeb3Alive() {
    // console.log(`Keep Web3 alive!`)
    let nu = localStorage.getItem(window.cookieName)
    let data = nu ? JSON.parse(nu) : {}
    if (data.chain == '') {
        provider = new Web3.providers.WebsocketProvider('wss://mainnetpublicgateway1.fusionnetwork.io:10001');
    } else if (data.chain == 'mainnet'){
        provider = new Web3.providers.WebsocketProvider('wss://mainnetpublicgateway1.fusionnetwork.io:10001');
    } else if(data.chain == 'testnet'){
        provider = new Web3.providers.WebsocketProvider('wss://testnetpublicgateway1.fusionnetwork.io:10001');
    }
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
let cookieName = 'apiCookieLanguage';
window.cookieName = cookieName;
let apiServer = localStorage.getItem(window.cookieName)
let data = apiServer ? JSON.parse(apiServer) : null

// Initialize cookie if there is non
if (data === null) {
    let data = {
        'chain': 'mainnet',
        'language' : 'gb'
    }
    localStorage.setItem(window.cookieName, JSON.stringify(data));
}


window.getServer = function () {
    let nu = localStorage.getItem(window.cookieName);
    let data = nu ? JSON.parse(nu) : {}
    if (data.chain == '') {
        return 'https://api.fusionnetwork.io/'
    } else if (data.chain == 'mainnet'){
        return 'https://api.fusionnetwork.io/'
    } else if(data.chain == 'testnet'){
        return 'https://testnetapi.fusionnetwork.io/'
    }
}

window.allAssets = {
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff': {
        CanChange: false,
        Decimals: 18,
        Description: 'https://fusion.org',
        ID:'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        Name: 'Fusion',
        Owner: '0x0000000000000000000000000000000000000000',
        Symbol: 'FSN',
        Total: 8.192e+25
    }
};
window.getAsset = async function (asset_id) {
    let data = {};
    if(window.allAssets[asset_id] !== undefined){
        data = window.allAssets[asset_id];
    } else {
        await $http.get(`${window.getServer()}assets/${asset_id}`).then(function (r) {
            window.allAssets[asset_id] = JSON.parse(r.data[0].data);
            data = JSON.parse(r.data[0].data);
        });
    }
    return data;
};

window.copyToClipboard = function (text) {
    let clipboardAvailable;
    if (clipboardAvailable === undefined) {
        clipboardAvailable =
            typeof document.queryCommandSupported === "function" &&
            document.queryCommandSupported("copy");
    }
    let success = false;
    const body = document.body;

    if (body) {
        // add the text to a hidden node
        const node = document.createElement("span");
        node.textContent = text;
        node.style.opacity = "0";
        node.style.position = "absolute";
        node.style.whiteSpace = "pre-wrap";
        body.appendChild(node);

        // select the text
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.addRange(range);

        // attempt to copy
        try {
            document.execCommand("copy");
            success = true;
        } catch (e) {
        }

        // remove selection and node
        selection.removeAllRanges();
        body.removeChild(node);
    }

    return success;
};


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
    'myApp.addresses',
    'pascalprecht.translate'
];

let gb = require('./translations/gb.js')
let nl = require('./translations/nl.js')
let cn = require('./translations/cn.js')
let ru = require('./translations/ru.js')
let de = require('./translations/de.js')

let nu = localStorage.getItem(window.cookieName)
nu = JSON.parse(nu);
!nu.language ? window.currentLanguage = 'gb' : window.currentLanguage = nu.language;

console.log(window.currentLanguage);
angular
    .module('myApp', dependencies)
    .config(configRouter)
    .config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('gb', gb);
        $translateProvider.translations('nl', nl);
        $translateProvider.translations('cn', cn);
        $translateProvider.translations('ru', ru);
        $translateProvider.translations('de', de);
        $translateProvider.preferredLanguage(window.currentLanguage);
        $translateProvider.fallbackLanguage('gb');
    }])
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

let configRouter = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard/dashboard.html',
            controller: 'dashboardController as dashboardController'
        })
        .state('block', {
            url: '/block/:blocknumber',
            templateUrl: 'templates/block/block.html',
            controller: 'blockController as blockController'
        })
        .state('transaction', {
            url: '/transaction/:transactionId',
            templateUrl: 'templates/transaction/transaction.html',
            controller: 'transactionController as transactionController'
        })
        .state('asset', {
            url: '/asset/:asset_id',
            templateUrl: 'templates/asset/asset.html',
            controller: 'assetController as assetController'
        })
        .state('assets', {
            url: '/assets',
            templateUrl: 'templates/assets/assets.html',
            controller: 'assetsController as assetsController'
        })
        .state('addresses', {
            url: '/addresses',
            templateUrl: 'templates/addresses/addresses.html',
            controller: 'addressesController as addressesController'
        })
        .state('staking', {
            url: '/staking',
            templateUrl: 'templates/staking/staking.html',
            controller: 'stakingController as stakingController'
        })
        .state('blocks', {
            url: '/blocks',
            templateUrl: 'templates/blocks/blocks.html',
            controller: 'blocksController as blocksController'
        })
        .state('transactions', {
            url: '/transactions',
            templateUrl: 'templates/transactions/transactions.html',
            controller: 'transactionsController as transactionsController'
        })
        .state('address', {
            url: '/address/:address',
            templateUrl: 'templates/address/address.html',
            controller: 'addressController as addressController'
        });

    $urlRouterProvider.otherwise('dashboard');
};

configRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

export default configRouter;

let blockController = function ($http, $scope, $stateParams) {
    let block = $stateParams.blocknumber;
    $scope.blockNumber = parseInt(block);
    $scope.blockData = {};
    $scope.globalData = {};
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.transactionsInBlock = [];

    $scope.returnDateString = function (posixtime, position) {
        let time = new Date(parseInt(posixtime) * 1000);
        if (posixtime == 18446744073709552000 && position == "End") {
            return "Forever";
        }
        if (position == "Start") {
            if (posixtime == 0) {
                return "Now";
            }
            // if(posixtime < time && position == 'Start'){return 'Now';}
        }
        let tMonth = time.getUTCMonth();
        let tDay = time.getUTCDate();
        let tYear = time.getUTCFullYear();

        return window.months[tMonth] + " " + tDay + ", " + tYear;
    };

    $scope.getBlock = function () {
        $http.get(`${window.getServer()}blocks/${block}`).then(function (r) {
            let data = JSON.parse(r.data[0].block);
            $scope.getAllTransactions(data.transactions);
            data.timestamp = moment(new Date(data.timestamp * 1000)).format('MMMM Do YYYY, h:mm:ss A');
            $scope.$eval(function () {
                $scope.blockData = data;
            });
        });
    };

    $scope.getAllTransactions = function (transactions){
        for(let transaction in transactions) {
            $http.get(`${window.getServer()}transactions/${transactions[transaction]}`).then(function (r) {
                let transactionSave = {};
                let data = r.data[0];
                let extraData = JSON.parse(data.data);

                if(data.fusionCommand == 'GenAssetFunc'){
                    transactionSave = {
                        txid : transactions[transaction],
                        timeStamp: format(data.timeStamp * 1000),
                        date: moment(transactions[transaction].timeStamp).format('ll'),
                        block: data.height,
                        from: data.fromAddress,
                        type: 'Create Asset',
                        asset: `${extraData.Name} (${extraData.Symbol})`,
                        assetId: extraData.AssetID,
                        amount : 200
                    };
                    $scope.transactionsInBlock.push(transactionSave);
                }
                if(data.fusionCommand == 'BuyTicketFunc'){
                    transactionSave = {
                        txid : transactions[transaction],
                        timeStamp: format(data.timeStamp * 1000),
                        date: moment(transactions[transaction].timeStamp).format('ll'),
                        block: data.height,
                        from: data.fromAddress,
                        type: 'Buy Ticket',
                        asset: '5000 FSN',
                        amount : 5000
                    };
                    $scope.transactionsInBlock.push(transactionSave);
                }
                if(data.fusionCommand == 'TimeLockToTimeLock'){
                    transactionSave = {
                        txid : transactions[transaction],
                        timeStamp: format(data.timeStamp * 1000),
                        date: moment(transactions[transaction].timeStamp).format('ll'),
                        asset: extraData.AssetID,
                        block: data.height,
                        from: data.fromAddress,
                        to: extraData.To,
                        type: 'Time Lock to Time Lock',
                        start : extraData.StartTime,
                        end : extraData.EndTime,
                        amount : extraData.Value,
                        assetId: extraData.AssetID,
                    };
                    $scope.transactionsInBlock.push(transactionSave);
                }
                if(data.fusionCommand == 'AssetToTimeLock'){
                    // console.log(extraData);
                    transactionSave = {
                        txid : transactions[transaction],
                        timeStamp: format(data.timeStamp * 1000),
                        date: moment(transactions[transaction].timeStamp).format('ll'),
                        asset: extraData.AssetID,
                        block: data.height,
                        from: data.fromAddress,
                        to: extraData.To,
                        type: 'Asset To Time Lock',
                        start : $scope.returnDateString(extraData.StartTime, 'Start'),
                        end : $scope.returnDateString(extraData.EndTime, 'End'),
                        amount : extraData.Value
                    };
                    $scope.transactionsInBlock.push(transactionSave);
                }
                if(data.fusionCommand == 'GenNotationFunc'){
                    transactionSave = {
                        txid : transactions[transaction],
                        timeStamp: format(data.timeStamp * 1000),
                        date: moment(transactions[transaction].timeStamp).format('ll'),
                        asset: extraData.AssetID,
                        block: data.height,
                        type: 'SAN Generation',
                    };
                    $scope.transactionsInBlock.push(transactionSave);
                }
                if(data.fusionCommand == 'SendAssetFunc'){
                    transactionSave = {
                        txid : transactions[transaction],
                        timeStamp: format(data.timeStamp * 1000),
                        date: moment(transactions[transaction].timeStamp).format('ll'),
                        asset: extraData.AssetID,
                        block: data.height,
                        type: 'Send Asset',
                    };
                    $scope.transactionsInBlock.push(transactionSave);
                }
            });
        }
    };


    $scope.getGlobalData = function () {
        $http.get(`${window.getServer()}fsnprice`).then(function (r) {
            let globalInfo = r.data;
            let globalData = {
                totalTransactions: globalInfo.totalTransactions,
                totalAddresses: globalInfo.totalAddresses,
                totalAssets: globalInfo.totalAssets,
                maxBlock: globalInfo.maxBlock,
            };
            $scope.$eval(function () {
                $scope.globalData = globalData;
            });
        });
    };

    $scope.getBlock();
    $scope.getGlobalData();
};

export default blockController;

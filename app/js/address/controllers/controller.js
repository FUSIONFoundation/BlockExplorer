let addressController = function ($http, $scope, $stateParams) {
    let address = $stateParams.address;
    $scope.address = address;
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.addressData = {};
    $scope.allBalances = [];
    $scope.verifiedAssets = {};
    $scope.assetsTab = true;
    $scope.allTransactions = {};
    $scope.processTransactions = [];


    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.endPage = Math.ceil($scope.processTransactions.length / $scope.pageSize);
    $scope.shownRows = 10;


    $scope.$watch('processTransactions', function () {
        if (typeof $scope.processTransactions === 'undefined') {
            return;
        }
        if ($scope.currentPage == 0) {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
                console.log($scope.shownRows);
            });
        }
        let shownRows = 0;
        if (($scope.currentPage + 1) * $scope.pageSize > ($scope.addressData.numberOfTransactions / 10)) {
            shownRows = $scope.addressData.numberOfTransactions / 10;
        } else {
            shownRows = ($scope.currentPage + 1) * $scope.pageSize;
        }
        $scope.$eval(function () {
            $scope.shownRows = shownRows;
        });
    });

    $scope.nextPage = function () {
        if ($scope.currentPage !== $scope.processTransactions - 1) {
            $scope.$eval(function () {
                $scope.currentPage = $scope.currentPage + 1;
            });
        }
        if (($scope.currentPage + 1) * $scope.pageSize > ($scope.addressData.numberOfTransactions / 10)) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.addressData.numberOfTransactions / 10;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
    };

    $scope.firstPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = 0;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > ($scope.addressData.numberOfTransactions / 10)) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.addressData.numberOfTransactions / 10
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
    };

    $scope.lastPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = $scope.endPage - 1;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > ($scope.addressData.numberOfTransactions / 10)) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.addressData.numberOfTransactions / 10;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
    };

    $scope.previousPage = function () {
        if ($scope.currentPage !== 0) {
            $scope.$eval(function () {
                $scope.currentPage = $scope.currentPage - 1;
            });
        }
        if (($scope.currentPage + 1) * $scope.pageSize > ($scope.addressData.numberOfTransactions / 10)) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.addressData.numberOfTransactions / 10;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
    };


    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.getAddress = function () {
        $http.get('https://api.fusionnetwork.io/assets/verified').then(function (r) {
            $scope.verifiedAssets = r.data;
        });
        $http.get(`https://api.fusionnetwork.io/search/${address}`).then(function (r) {
            let info = r.data.address[0];
            let balanceInfo = JSON.parse(r.data.address[0].balanceInfo);
            let fsnBalance = new BigNumber(info.fsnBalance.toString());
            let formattedBalance = fsnBalance.div($scope.countDecimals('18').toString());

            let globalData = {
                notation: info.san,
                assetsHeld: info.assetsHeld,
                fsnBalance: formattedBalance.toString(),
                numberOfTransactions: info.numberOfTransactions

            };

            let allBalances = [];
            let balances = balanceInfo.balances;
            for (let asset in balances) {
                let verifiedImage = '';
                let hasImage = false;
                let verifiedAsset = false;
                for (let a in $scope.verifiedAssets) {
                    if (asset == $scope.verifiedAssets[a].assetID) {
                        // Set matched image name
                        verifiedImage = $scope.verifiedAssets[a].image;
                        hasImage = true;
                        verifiedAsset = true;
                    }
                }
                $http.get(`https://api.fusionnetwork.io/assets/${asset}`).then(function (r) {
                    if (asset == '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
                        let data = {
                            assetName: 'FUSION (FSN)',
                            assetSymbol: 'FSN',
                            assetId: asset,
                            assetType: 'Fusion',
                            quantity: formattedBalance.toString(),
                            holdings: '',
                            verified: true,
                            hasImage: true,
                            verifiedImage: 'EFSN_LIGHT.svg'
                        };
                        allBalances.push(data);
                        return;
                    } else {
                        let assetData = r.data[0];
                        let assetExtraData = JSON.parse(r.data[0].data);
                        let amount = new BigNumber(balances[asset].toString());
                        let formattedBalance = amount.div($scope.countDecimals(assetExtraData.Decimals.toString()).toString());
                        let data = {
                            assetName: assetData.commandExtra2,
                            assetSymbol: assetExtraData.Symbol,
                            assetId: asset,
                            assetType: 'Fusion',
                            quantity: formattedBalance.toString(),
                            holdings: '',
                            verified: verifiedAsset,
                            hasImage: hasImage,
                            verifiedImage: verifiedImage
                        };
                        allBalances.push(data);
                    }
                });
            }

            $scope.$eval(function () {
                $scope.addressData = globalData;
                $scope.allBalances = allBalances;
                $scope.getTransactions();
            });
        });
    };

    $scope.$watch('currentPage', function(){
        $scope.getTransactions();
    })

    $scope.getTransactions = function () {
        // let page = Math.ceil($scope.addressData.numberOfTransactions / 100);
            $http.get(`https://api.fusionnetwork.io/transactions/all?&page=${$scope.currentPage}&address=${address}&size=10`).then(function (r) {
                let transactions = r.data;
                for (let transaction in transactions) {
                        $scope.processTransaction(transactions[transaction].hash);
                }
            });
    };

    $scope.processTransaction = function (transactionHash) {
        $http.get(`https://api.fusionnetwork.io/transactions/${transactionHash}`).then(function (r) {
            let transactionSave = {};
            let data = r.data[0];
            let extraData = JSON.parse(data.data);
            if (data.fusionCommand == 'GenAssetFunc') {
                transactionSave = {
                    txid: transactionHash,
                    timeStamp: format(data.timeStamp * 1000),
                    date: moment(data.timeStamp * 1000).format('ll'),
                    block: data.height,
                    from: data.fromAddress,
                    type: 'Create Asset',
                    asset: `${extraData.Name} (${extraData.Symbol})`,
                    assetId: extraData.AssetID,
                    amount: 200
                };
                $scope.processTransactions.push(transactionSave);
            }
            if (data.fusionCommand == 'BuyTicketFunc') {
                transactionSave = {
                    txid: transactionHash,
                    timeStamp: format(data.timeStamp * 1000),
                    date: moment(data.timeStamp * 1000).format('ll'),
                    block: data.height,
                    from: data.fromAddress,
                    type: 'Buy Ticket',
                    asset: '200 FSN',
                    amount: 200
                };
                $scope.processTransactions.push(transactionSave);
            }
            if (data.fusionCommand == 'SendAssetFunc') {
                transactionSave = {
                    txid: transactionHash,
                    timeStamp: format(data.timeStamp * 1000),
                    date: moment(data.timeStamp * 1000).format('ll'),
                    block: data.height,
                    from: data.fromAddress,
                    type: 'Send Asset',
                    asset: '',
                    amount: 200
                };
                $scope.processTransactions.push(transactionSave);
            }
            if (data.fusionCommand == 'TimeLockToTimeLock') {
                transactionSave = {
                    txid: transactionHash,
                    timeStamp: format(data.timeStamp * 1000),
                    date: moment(data.timeStamp * 1000).format('ll'),
                    asset: extraData.AssetID,
                    block: data.height,
                    from: data.fromAddress,
                    to: extraData.To,
                    type: 'Time Lock to Time Lock',
                    start: extraData.StartTime,
                    end: extraData.EndTime,
                    amount: extraData.Value,
                    assetId: extraData.AssetID,
                };
                $scope.processTransactions.push(transactionSave);
            }
            if (data.fusionCommand == 'AssetToTimeLock') {
                transactionSave = {
                    txid: transactionHash,
                    timeStamp: format(data.timeStamp * 1000),
                    date: moment(data.timeStamp * 1000).format('ll'),
                    asset: extraData.AssetID,
                    block: data.height,
                    from: data.fromAddress,
                    to: extraData.To,
                    type: 'Asset To Time Lock',
                    start: extraData.StartTime,
                    end: extraData.EndTime,
                    amount: extraData.Value
                };
                $scope.processTransactions.push(transactionSave);
            }
            if (data.fusionCommand == 'GenNotationFunc') {
                transactionSave = {
                    txid: transactionHash,
                    timeStamp: format(data.timeStamp * 1000),
                    date: moment(data.timeStamp * 1000).format('ll'),
                    asset: extraData.AssetID,
                    block: data.height,
                    type: 'SAN Generation',
                };
                $scope.processTransactions.push(transactionSave);
            }
            // let page = Math.ceil($scope.addressData.numberOfTransactions / 100);

            $scope.endPage = Math.ceil($scope.addressData.numberOfTransactions / 10);
            $scope.processTransactions.length < 10 ? $scope.shownRows = $scope.processTransactions.length : $scope.shownRows = 10;
        });
    };

    $scope.getAddress();
};

export default addressController;

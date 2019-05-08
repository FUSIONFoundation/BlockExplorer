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
    $scope.loading = true;


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
        $scope.getTransactions($scope.currentPage);
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
        $scope.getTransactions($scope.currentPage);
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
        $scope.getTransactions($scope.currentPage);
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
                $scope.getTransactions(0);
            });
        });
    };

    $scope.getTransactions = function (page) {
        $scope.loading = true;
        let transactionSave = [];
        $http.get(`http://api.fusionnetwork.io/transactions/all?address=${address}&sort=desc&page=${page}&size=10&field=height&returnTickets=notickets`).then(function (r) {
            // console.log(r.data);
            if (r.data.length === 0 || r.data === []) {
                $scope.currentPage = 0;
                $scope.getTransactions(0);
            }
            let transactions = r.data;
            for (let transaction in transactions) {
                let extraData = JSON.parse(transactions[transaction].data);
                let inout = $scope.returnInAndOut(address, transactions[transaction].commandExtra3, '');
                let data = {
                    txid: transactions[transaction].hash,
                    timeStamp: format(transactions[transaction].timeStamp * 1000),
                    date: moment(transactions[transaction].timeStamp * 1000).format('ll'),
                    block: transactions[transaction].height,
                    from: transactions[transaction].fromAddress,
                    type: window.utils.returnCommand(transactions[transaction].fusionCommand),
                    asset: '',
                    inout: inout,
                    assetId: extraData.AssetID,
                    amount: 200
                };       
                let asset = '';
                if(extraData.AssetID !== undefined){
                    let amount = new BigNumber(extraData.Value.toString());
                    let amountFinal = amount.div($scope.countDecimals(window.allAssets[extraData.AssetID].Decimals));
                    data.asset = window.allAssets[extraData.AssetID].Symbol;
                    data.amount = amountFinal.toString()
                }
                if(extraData.StartTime && extraData.EndTime){
                    data.startTimeString = $scope.returnDateString(extraData.StartTime,'Start');
                    data.endTimeString = $scope.returnDateString(extraData.EndTime,'End');
                }
                if(data.type == 'Make Swap'){
                    data.FromAsset = window.allAssets[extraData.FromAssetID].Symbol;
                    data.ToAsset = window.allAssets[extraData.ToAssetID].Symbol;
                }
                if(data.type == 'Take Swap'){
                    
                }
                transactionSave.push(data);
           
            }
            $scope.$eval(function () {
                $scope.processTransactions = transactionSave;
            });
            $scope.loading = false;

        });
    };

    $scope.returnInAndOut = function (input, address, type) {
        if (input == address) {
            return 'IN';
        } else {
            return 'OUT';
        }
        if (type) {
            if (type == 'TimeLockToAsset') {
                if (input == web3.fsn.consts.FSNToken) {
                    return 'IN';
                } else {
                    return 'OUT';
                }
            }
        }
    };
    $scope.getAssets = async function () {
        try {
            await web3.fsn.allAssets().then(function(r){
                window.allAssets = r;
                return $scope.getAddress();
            })
        } catch (err) {
            console.log(err);
        }
    }

    $scope.getAssets();
};

export default addressController;

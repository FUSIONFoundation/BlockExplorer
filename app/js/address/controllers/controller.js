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
    $scope.allTimeLockBalances = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.endPage = Math.ceil($scope.processTransactions.length / $scope.pageSize);
    $scope.shownRows = 10;
    $scope.notAnAddress = false;
    $scope.allTimeLockBalances = [];
    $scope.copyToClipboard = window.copyToClipboard;
    let transactionSave = [];


    if(!window.web3.utils.isAddress(address)){
        $scope.notAnAddress = true;
        return;
    }

    $scope.hasNoTimeLockBalance = true;

    $scope.$watch('processTransactions', function () {
        if (typeof $scope.processTransactions === 'undefined') {
            return;
        }
        if ($scope.currentPage == 0) {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
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
    $scope.firstPage = async function () {
        transactionSave = [];
        $scope.$applyAsync(function(){
            $scope.processTransactions = [];
        });

        $scope.$eval(function () {
            $scope.currentPage = 0;
        });
        await $scope.getTransactions($scope.currentPage);
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

    $scope.currentPageTL = 0;
    $scope.pageSizeTL = 10;
    $scope.endPageTL = Math.ceil($scope.processTransactions.length / $scope.pageSize);
    $scope.shownRowsTL = 10;

    $scope.nextPageTL = function () {
        if ($scope.currentPageTL+1 !== $scope.endPageTL) {
            $scope.$eval(function () {
                $scope.currentPageTL = $scope.currentPageTL + 1;
            });
        }
        if (($scope.currentPageTL + 1) * $scope.pageSizeTL > ($scope.allTimeLockBalances.length / 10)) {
            $scope.$eval(function () {
                $scope.shownRowsTL = $scope.addressData.numberOfTransactions / 10;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRowsTL = ($scope.currentPageTL + 1) * $scope.pageSizeTL;
            });
        }
    };
    $scope.firstPageTL = function () {
        $scope.$eval(function () {
            $scope.currentPageTL = 0;
        });
        if (($scope.currentPageTL + 1) * $scope.pageSizeTL > ($scope.allTimeLockBalances.length / 10)) {
            $scope.$eval(function () {
                $scope.shownRowsTL = $scope.allTimeLockBalances.length / 10
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRowsTL = ($scope.currentPageTL + 1) * $scope.pageSizeTL;
            });
        }
    };
    $scope.lastPageTL = function () {
        $scope.$eval(function () {
            $scope.currentPageTL = $scope.endPageTL - 1;
        });
        if (($scope.currentPageTL + 1) * $scope.pageSizeTL > ($scope.allTimeLockBalances.length / 10)) {
            $scope.$eval(function () {
                $scope.shownRowsTL = $scope.allTimeLockBalances.length / 10;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRowsTL = ($scope.currentPageTL + 1) * $scope.pageSizeTL;
            });
        }
    };
    $scope.previousPageTL = function () {
        if ($scope.currentPageTL !== 0) {
            $scope.$eval(function () {
                $scope.currentPageTL = $scope.currentPageTL - 1;
            });
        }
        if (($scope.currentPageTL + 1) * $scope.pageSizeTL > ($scope.allTimeLockBalances.length / 10)) {
            $scope.$eval(function () {
                $scope.shownRowsTL = $scope.allTimeLockBalances.length / 10;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRowsTL = ($scope.currentPageTL + 1) * $scope.pageSizeTL;
            });
        }
    };

    $scope.hideTicketValue = true;
    $scope.hideTickets = async function (){
        transactionSave = []
        $scope.$eval(function(){
            $scope.processTransactions = [];
        });
        $scope.firstPageTL();
        await $scope.getTransactions(0);
    }

 $scope.allTimeLockBalances = [];

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
        $http.get(`${window.getServer()}assets/verified`).then(function (r) {
            $scope.verifiedAssets = r.data;
        });
        $http.get(`${window.getServer()}search/${address}`).then(function (r) {
            if(!r.data.address){
                console.log('No data for this address');
                $scope.notAnAddress = true;
                return;
            }
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
                $http.get(`${window.getServer()}assets/${asset}`).then(function (r) {
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
                        };0x135bd526d33b757457ad4d6389ece1bab5bb2360
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

    $scope.getTransactions = async function (page) {
        $scope.loading = true;
        $scope.processTransactions = [];
        let s = '';
        if($scope.hideTicketValue === true){
            s = 'notickets'
        } else if ($scope.hideTicketValue === false){
            s = 'all'
        }
        await $http.get(`${window.getServer()}transactions/all?address=${address}&sort=desc&page=${page}&size=10&field=height&returnTickets=${s}`).then(function (r) {
            if (r.data.length === 0 || r.data === []) {
                if($scope.addressData.numberOfTransactions != 0){
                    return console.log('Address only has ticket transactions.')
                }
                $scope.currentPage = 0;
                $scope.getTransactions(0);
            }
            let transactions = r.data;
            for (let transaction in transactions) {
              $scope.processTx(transactions,transaction);
            }
            $scope.$eval(function () {
                $scope.processTransactions = transactionSave;
            });
            $scope.loading = false;
            $scope.getTimeLockBalances();
        });
    };

    $scope.getTimeLockBalances = async function (){
        let timeLockBalances = [];
        $http.get(`${window.getServer()}balances/${address}`).then(function (r) {
            let assets = JSON.parse(r.data[0].balanceInfo).timeLockBalances;
            if(Object.keys(assets).length !== 0){
                $scope.hasNoTimeLockBalance = false;
            } else{
                return;
            }
            for (let asset in assets){
                for (let i = 0; i < assets[asset]["Items"].length; i++) {
                    let startTimePosix = $scope.returnDateString(assets[asset]["Items"][i]["StartTime"],'Start');
                    let endTimePosix = $scope.returnDateString(assets[asset]["Items"][i]["EndTime"],'End');
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
                    if (asset == '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
                        verifiedImage = 'EFSN_LIGHT.svg';
                        hasImage = true;
                        verifiedAsset = true;
                    }
                       let assetData = {};
                       window.getAsset(asset).then(function(r){
                            assetData = r;
                           let amount = new BigNumber(assets[asset]["Items"][i]["Value"]);
                           let amountFinal = amount.div($scope.countDecimals(assetData["Decimals"]));
                           let data = {
                               asset_id : asset,
                               asset_name : assetData["Name"],
                               asset_symbol :  assetData["Symbol"],
                               startTime : startTimePosix,
                               endTime : endTimePosix,
                               amount : amountFinal.toString(),
                               verified: verifiedAsset,
                               hasImage: hasImage,
                               verifiedImage: verifiedImage
                           }

                           timeLockBalances.push(data);

                           $scope.$eval(function(){
                               $scope.allTimeLockBalances = timeLockBalances;
                           })
                        });
                }

            }
            $scope.endPageTL = Math.ceil($scope.allTimeLockBalances.length / $scope.pageSizeTL);

        });
    };

    $scope.processTx = async function (transactions,transaction){
        if(transactionSave.length == 10){
            transactionSave = [];
        }
            let extraData = JSON.parse(transactions[transaction].data);
            let inout = $scope.returnInAndOut(address, transactions[transaction].commandExtra3, '');
            let data = {
                txid: transactions[transaction].hash,
                timeStamp: format(transactions[transaction].timeStamp * 1000),
                date: moment(transactions[transaction].timeStamp * 1000).format('ll'),
                block: transactions[transaction].height,
                from: transactions[transaction].fromAddress,
                to: transactions[transaction].commandExtra3,
                type: window.utils.returnCommand(transactions[transaction].fusionCommand),
                asset: '',
                inout: inout,
                assetId: extraData.AssetID,
                amount: 200
            };
            let asset = '';
            try {
                if (extraData.AssetID !== undefined && extraData.Value) {
                    let extraDataGetAsset = {};
                    await window.getAsset(extraData.AssetID).then(function(r){
                        extraDataGetAsset = r;
                    })
                    let amount = new BigNumber(extraData.Value.toString());
                    let amountFinal = amount.div($scope.countDecimals(extraDataGetAsset.Decimals));
                    data.asset = extraDataGetAsset.Symbol;
                    data.amount = amountFinal.toString()
                }
                if (extraData.StartTime && extraData.EndTime) {
                    data.startTimeString = $scope.returnDateString(extraData.StartTime, 'Start');
                    data.endTimeString = $scope.returnDateString(extraData.EndTime, 'End');
                }
                if (data.type == 'Make Swap') {
                    let fromGetAsset = {};
                    await window.getAsset(extraData.FromAssetID).then(function(r){
                        fromGetAsset = r;
                    })
                    let toGetAsset = {};
                    await window.getAsset(extraData.ToAssetID).then(function(r){
                        toGetAsset = r;
                    })
                    data.FromAsset = fromGetAsset.Symbol;
                    data.ToAsset = toGetAsset.Symbol;
                }
                if (data.type == 'Take Swap') {

                }
                if(data.type == 'Create Asset'){
                    // console.log(extraData);
                    data.asset = `${extraData.Name} (${extraData.Symbol})`;
                    data.asset_id = extraData.AssetID;
                }
            } catch (err){
                // console.log(err);
            }
            transactionSave.push(data);
    }

    $scope.returnInAndOut = function (input, address, type) {
        if(address) {
            if (input.toLowerCase() == address.toLowerCase()) {
                return 'IN';
            } else {
                return 'OUT';
            }
        }

        if (type) {
            if (type == 'TimeLockToAsset') {
                if (input.toLowerCase() == web3.fsn.consts.FSNToken.toLowerCase()) {
                    return 'IN';
                } else {
                    return 'OUT';
                }
            }
        }
    };

    $scope.getAddress();
};

export default addressController;

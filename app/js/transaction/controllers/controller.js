import BigNumber from 'bignumber.js';

let transactionController = function ($http, $scope, $stateParams) {
    let transactionHash = $stateParams.transactionId;
    $scope.transactionData = {};
    $scope.copyToClipboard = window.copyToClipboard;

    $scope.USDValue = 'loading';
    $scope.tokenPrice = 'loading';


    $scope.getFiatValue = async function (input) {
        let z = 0;
        await $http.get(`${window.getServer()}fsnprice`).then(function (r) {
            z = r.data.priceInfo.price
            let tokenPrice = new BigNumber(z);
            let totalTokens = new BigNumber(input);
            let usdVal = totalTokens.times(tokenPrice);
            $scope.USDValue = window.numeral(usdVal).format('$0,0.00');
            $scope.tokenPrice = window.numeral(r.data.priceInfo.price).format('$0,0.00');
        });
    };

    $scope.returnDateString = function (posixtime, position) {
        let time = new Date(parseInt(posixtime) * 1000);
        if (posixtime == 18446744073709552000 && position == 'End') {
            return 'Forever';
        }
        if (position == 'Start') {
            if (posixtime == 0) {
                return 'Now';
            }
            // if(posixtime < time && position == 'Start'){return 'Now';}
        }
        let tMonth = time.getUTCMonth();
        let tDay = time.getUTCDate();
        let tYear = time.getUTCFullYear();

        return window.months[tMonth] + ' ' + tDay + ', ' + tYear;
    };


    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.countDown = 5;

    $scope.countDownFunc = function () {
        let counter = 5;
        const intv = setInterval(function () {
            $scope.$apply(function () {
                $scope.countDown = counter;
            })
            counter--
            if (counter === 0) return clearInterval(intv);
        }, 1000);
        if (counter === 0) return clearInterval(intv);
    }

    $scope.getTransaction = async function () {
        let tx = '';
        let txExtraData = {};
        let txExtraData2 = {};
        let txTransactionData = {};
        let data = {};
        await $http.get(`${window.getServer()}transactions/${transactionHash}`).then(function (r) {
                tx = r.data[0];
                console.log(tx);
                if (tx === undefined) {
                    $scope.countDownFunc();
                    console.log('Transaction not found, will retry in 5s..');
                    let url = window.getServer();
                    let fallBackURL = '';
                    if (url === 'https://api.fusionnetwork.io/') {
                        fallBackURL = 'https://testnetapi.fusionnetwork.io/';
                    } else if (url === 'https://testnetapi.fusionnetwork.io/') {
                        fallBackURL = 'https://api.fusionnetwork.io';
                    }
                    $http.get(`${fallBackURL}transactions/${transactionHash}`).then(function (r) {
                        tx = r.data[0];
                        if (tx !== undefined) {
                            console.log('THIS TRANSACTION IS ON A DIFFERENT NET!')
                            let nu = localStorage.getItem(window.cookieName)
                            nu = JSON.parse(nu);
                            nu.chain = fallBackURL == 'https://api.fusionnetwork.io/' ? 'mainnet': 'testnet';
                            localStorage.setItem(window.cookieName, JSON.stringify(nu));
                            window.location.reload();
                        }
                    });
                    setTimeout(function () {
                        console.log('Last check: ' + new Date);
                        $scope.getTransaction()
                    }, 5000);
                    return;
                }
                txExtraData = JSON.parse(r.data[0].receipt);
                txExtraData2 = JSON.parse(r.data[0].data);
                txTransactionData = JSON.parse(r.data[0].transaction);
                data = {
                    from: tx.fromAddress,
                    to: tx.commandExtra3,
                    asset: '',
                    status: txExtraData.status,
                    transactionType: utils.returnCommand(tx.fusionCommand),
                    hash: tx.hash,
                    block: tx.height,
                    age: `${format(tx.timeStamp * 1000)} (${moment(tx.timeStamp * 1000).format('MMMM Do YYYY, h:mm:ss A')})`,
                    gasUsed: parseInt(txExtraData.gasUsed, 16),
                    nonce: parseInt(txTransactionData.nonce, 16),
                    inputData: txTransactionData.input
                };
            }
        );

        if (data.transactionType == 'Send Asset' ||
            data.transactionType == 'Time Lock To Asset' ||
            data.transactionType == 'Asset To Time Lock' ||
            data.transactionType == 'Time Lock To Time Lock') {
            let asset = {};
            await window.getAsset(txExtraData2.AssetID).then(function (r) {
                asset = r;
            });
            let amount = new BigNumber(txExtraData2.Value.toString());
            let amountFinal = amount.div($scope.countDecimals(asset['Decimals']));
            $scope.getFiatValue(amountFinal.toString());
            data.asset_id = txExtraData2.AssetID;
            data.asset_symbol = `${asset['Symbol']}`;
            data.amount = amountFinal.toString();
            data.asset = `${asset['Name']} (${asset['Symbol']})`;
            if (txExtraData2.StartTime) {
                data.timelock = `${$scope.returnDateString(txExtraData2.StartTime, 'Start')} - ${$scope.returnDateString(txExtraData2.EndTime, 'End')}`;
            }
        }
        if (data.transactionType == 'Create Asset') {
            data.asset = `${txExtraData2['Name']} (${txExtraData2['Symbol']})`;
            data.asset_id = txExtraData2.AssetID;
            // console.log(data);
        }
        if (data.transactionType == 'Take Swap') {
            console.log('take swap');
            let d;
            let fromAsset;
            let toAsset;
            let url;
            if (txExtraData2.Deleted) {
                url = 'swaps';
            } else if (!txExtraData2.Deleted) {
                url = 'swaps2';
            }
            await $http.get(`${window.getServer()}${url}/${txExtraData2.SwapID}`).then(function (r) {
                d = JSON.parse(r.data[0].data);
            });
            console.log(txExtraData2);
            console.log(d);
            await window.getAsset(d.FromAssetID).then(function (r) {
                fromAsset = r;
            });
            await window.getAsset(d.ToAssetID).then(function (r) {
                toAsset = r;
            })
            data.swap = true;
            data.fromSwap = fromAsset.Symbol;
            data.toSwap = toAsset.Symbol;
        }
        if (data.transactionType == 'Make Swap') {
            // console.log(txExtraData2);
            let fromAsset = {};
            let toAsset = {};
            await window.getAsset(txExtraData2.FromAssetID).then(function (r) {
                fromAsset = r;
                // console.log(fromAsset);
            });
            await window.getAsset(txExtraData2.ToAssetID).then(function (r) {
                toAsset = r;
                // console.log(toAsset);
            })
            data.swap = true;
            data.fromSwap = fromAsset.Symbol;
            data.toSwap = toAsset.Symbol;
        }
        if (!data.transactionType) {
            data.transactionType = 'Send Asset';
            await web3.eth.getTransaction(`${transactionHash}`).then(function (r) {
                let amount = new BigNumber(r.value.toString());
                let amountFinal = amount.div($scope.countDecimals(18));
                $scope.getFiatValue(amountFinal.toString());
                data.asset_id = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
                data.asset_symbol = 'FSN';
                data.amount = amountFinal.toString();
                data.asset = 'Fusion';
                data.to = r.to;
            })
        }
        $scope.$applyAsync(function () {
            $scope.transactionData = data;
            console.log($scope.transactionData);
        });

    };

    $scope.getTransaction();
};

export default transactionController;

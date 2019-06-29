import BigNumber from 'bignumber.js';

let transactionController = function ($http, $scope, $stateParams) {
    let transactionHash = $stateParams.transactionId;
    $scope.transactionData = {};

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

    $scope.getTransaction = async function () {
        let tx = '';
        let txExtraData = {};
        let txExtraData2 = {};
        let txTransactionData = {};
        let data = {};
        await $http.get(`${window.getServer()}transactions/${transactionHash}`).then(function (r) {
            tx = r.data[0];
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
                age: `${format(tx.timeStamp * 1000)} (${moment(tx.timeStamp * 1000).format('ll')})`,
                gasUsed: parseInt(txExtraData.gasUsed, 16),
                nonce: parseInt(txTransactionData.nonce, 16),
                inputData: txTransactionData.input
            };
        });

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
            console.log(data);
        }
        if (data.transactionType == 'Make Swap') {
            console.log(txExtraData2);
            let fromAsset = {};
            let toAsset = {};
            await window.getAsset(txExtraData2.FromAssetID).then(function (r) {
                fromAsset = r;
                console.log(fromAsset);
            });
            await window.getAsset(txExtraData2.ToAssetID).then(function (r) {
                toAsset = r;
                console.log(toAsset);
            })
            data.swap = true;
            data.fromSwap = fromAsset.Symbol;
            data.toSwap = toAsset.Symbol;
        }
        $scope.$apply(function () {
            $scope.transactionData = data;
        });
    };

    $scope.getTransaction();
};

export default transactionController;

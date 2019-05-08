import BigNumber from "bignumber.js";

let transactionController = function ($http, $scope, $stateParams) {
    let transactionHash = $stateParams.transactionId;
    $scope.transactionData = {};

    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.getTransaction = function () {
        $http.get(`https://api.fusionnetwork.io/transactions/${transactionHash}`).then(function (r) {
            let tx = r.data[0];
            let txExtraData = JSON.parse(r.data[0].receipt);
            let txExtraData2 = JSON.parse(r.data[0].data);
            console.log(txExtraData2);
            let txTransactionData = JSON.parse(r.data[0].transaction);
            let data = {
                from : tx.fromAddress,
                to : tx.commandExtra3,
                asset : '',
                status : txExtraData.status,
                transactionType : utils.returnCommand(tx.fusionCommand),
                hash : tx.hash,
                block : tx.height,
                age : `${format(tx.timeStamp * 1000)} (${moment(tx.timeStamp * 1000).format('ll')})`,
                gasUsed : txExtraData.gasUsed,
                nonce : txTransactionData.nonce,
                inputData : txTransactionData.input
            };
            if(data.transactionType == 'Send Asset' || data.transactionType == 'Time Lock To Asset'){
                let amount = new BigNumber(txExtraData2.Value.toString());
                let amountFinal = amount.div($scope.countDecimals(window.allAssets[txExtraData2.AssetID].Decimals));
                data.asset_id = txExtraData2.AssetID;
                data.asset_symbol = `${window.allAssets[txExtraData2.AssetID].Symbol}`
                data.amount = amountFinal.toString();
                data.asset = `${window.allAssets[txExtraData2.AssetID].Name} (${window.allAssets[txExtraData2.AssetID].Symbol})`;
            }
            $scope.$eval(function(){
                $scope.transactionData = data;
            });
        });
    };

    $scope.getAssets = async function () {
        try {
            await web3.fsn.allAssets().then(function(r){
                window.allAssets = r;
                return $scope.getTransaction();
            })
        } catch (err) {
            console.log(err);
        }
    }

    $scope.getAssets();
};

export default transactionController;
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
                from : tx.fromAddress,
                to : tx.commandExtra3,
                asset : '',
                status : txExtraData.status,
                transactionType : utils.returnCommand(tx.fusionCommand),
                hash : tx.hash,
                block : tx.height,
                age : `${format(tx.timeStamp * 1000)} (${moment(tx.timeStamp * 1000).format('ll')})`,
                gasUsed : parseInt(txExtraData.gasUsed,16),
                nonce : parseInt(txTransactionData.nonce,16),
                inputData : txTransactionData.input
            };
        });

        if(data.transactionType == 'Send Asset' || data.transactionType == 'Time Lock To Asset'){
            let asset = {};
            await window.getAsset(txExtraData2.AssetID).then(function(r){
                asset = r;
            });

            let amount = new BigNumber(txExtraData2.Value.toString());
            let amountFinal = amount.div($scope.countDecimals(asset["Decimals"]));
            data.asset_id = txExtraData2.AssetID;
            data.asset_symbol = `${asset["Symbol"]}`;
            data.amount = amountFinal.toString();
            data.asset = `${asset["Name"]} (${asset["Symbol"]})`;
        }
        $scope.$apply(function(){
            $scope.transactionData = data;
        });
    };

    $scope.getTransaction();
};

export default transactionController;

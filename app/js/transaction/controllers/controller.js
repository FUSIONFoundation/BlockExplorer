let transactionController = function ($http, $scope, $stateParams) {
    let transactionHash = $stateParams.transactionId;
    $scope.transactionData = {};

    $scope.getTransaction = function () {
        $http.get(`https://api.fusionnetwork.io/transactions/${transactionHash}`).then(function (r) {
            let tx = r.data[0];
            let txExtraData = JSON.parse(r.data[0].receipt);
            let txTransactionData = JSON.parse(r.data[0].transaction);
            let data = {
                from : tx.fromAddress,
                to : txExtraData.to,
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
            $scope.$eval(function(){
                $scope.transactionData = data;
            });
        });
    };

    $scope.getTransaction();

};

export default transactionController;
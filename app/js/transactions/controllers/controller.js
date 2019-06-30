let transactionsController = function ($http, $scope) {
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.transactions = [];
    $scope.loading = true;
    $scope.currentPage = 0;
    $scope.pageSize = 20;
    $scope.shownRows = 20;


    $scope.nextPage = function () {
        if ($scope.currentPage !== $scope.allAssets - 1) {
            $scope.$eval(function () {
                $scope.currentPage = $scope.currentPage + 1;
            });
        }
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalTransactions) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalTransactions;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getTransactions($scope.currentPage);
    };

    $scope.firstPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = 0;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalTransactions) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalTransactions;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getTransactions($scope.currentPage);
    };

    $scope.lastPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = $scope.endPage - 1;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalTransactions) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalTransactions;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getTransactions($scope.currentPage);
    };

    $scope.previousPage = function () {
        if ($scope.currentPage !== 0) {
            $scope.$eval(function () {
                $scope.currentPage = $scope.currentPage - 1;
            });
        }
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalTransactions) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalTransactions;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getTransactions($scope.currentPage);
    };


    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.getTransactions = function (page) {
        $scope.loading = true;
        let transactions = {};
        let displayTransactions = [];
        $http.get(`${window.getServer()}transactions/all?sort=desc&page=${page}&size=20&field=height&returnTickets=onlytickets`).then(function (r) {
            transactions = r.data;
            // console.log(transactions);
            for (let transaction in transactions) {
                let transactionExtraData = JSON.parse(transactions[transaction].receipt);
                let a = window.BigNumber(transactionExtraData.cumulativeGasUsed.toString());
                let fees = a.div($scope.countDecimals(9));
                let data = {
                    txid : transactions[transaction].hash,
                    block : transactions[transaction].height,
                    age : window.format(transactions[transaction].timeStamp * 1000),
                    type : window.utils.returnCommand(transactions[transaction].fusionCommand),
                    assets : '',
                    fees : fees,
                }
                // console.log(transactions[transaction]);
                displayTransactions.push(data);
                $scope.transactions = displayTransactions;
            }

        }).then(function(){
            $scope.loading = false;
        });
    }

    $http.get(`${window.getServer()}fsnprice`).then(function (r) {
        $scope.totalTransactions = r.data.totalTransactions;
        $scope.endPage = Math.ceil($scope.totalTransactions / $scope.pageSize);
    });


    $scope.getTransactions(0);

};

export default transactionsController;

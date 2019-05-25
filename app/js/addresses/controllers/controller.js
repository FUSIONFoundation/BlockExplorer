let blocksController = function ($http, $scope) {
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.addresses = [];
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
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalAddresses) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalAddresses;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getAddresses($scope.currentPage);
    };

    $scope.firstPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = 0;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalAddresses) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalAddresses;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getAddresses($scope.currentPage);
    };

    $scope.lastPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = $scope.endPage - 1;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalAddresses) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalAddresses;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getAddresses($scope.currentPage);
    };

    $scope.previousPage = function () {
        if ($scope.currentPage !== 0) {
            $scope.$eval(function () {
                $scope.currentPage = $scope.currentPage - 1;
            });
        }
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.totalAddresses) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.totalAddresses;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getAddresses($scope.currentPage);
    };


    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.getAddresses = function (page) {
        $scope.loading = true;
        let addresses = {};
        let displayAddresses = [];
        $http.get(`${window.getServer()}balances/all?sort=desc&page=${page}&size=20&field=fsnBalance`).then(function (r) {
            addresses = r.data;
            for (let address in addresses) {
                console.log(addresses[address]);
                let amount = new BigNumber(addresses[address].fsnBalance.toString());
                let amountFinal = amount.div($scope.countDecimals(18));
                let data = {
                    address : addresses[address]._id,
                    san : addresses[address].san,
                    fsnBalance : amountFinal.toString(),
                    transactions : addresses[address].numberOfTransactions,
                    assets : addresses[address].assetsHeld,
                    rewards : addresses[address].rewardEarn
                };
                displayAddresses.push(data);
                $scope.addresses = displayAddresses;
            }

        }).then(function(){
            $scope.loading = false;
        });
    }

    $http.get(`${window.getServer()}fsnprice`).then(function (r) {
        $scope.totalAddresses = r.data.totalAddresses;
        $scope.endPage = Math.ceil($scope.totalAddresses / $scope.pageSize);
    });


    $scope.getAddresses(0);

};

export default blocksController;

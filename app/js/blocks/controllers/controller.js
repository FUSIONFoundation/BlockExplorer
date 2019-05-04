let blocksController = function ($http, $scope) {
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.blocks = [];
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
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.maxBlock) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.maxBlock;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getBlocks($scope.currentPage);
    };

    $scope.firstPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = 0;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.maxBlock) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.maxBlock;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getBlocks($scope.currentPage);
    };

    $scope.lastPage = function () {
        $scope.$eval(function () {
            $scope.currentPage = $scope.endPage - 1;
        });
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.maxBlock) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.maxBlock;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getBlocks($scope.currentPage);
    };

    $scope.previousPage = function () {
        if ($scope.currentPage !== 0) {
            $scope.$eval(function () {
                $scope.currentPage = $scope.currentPage - 1;
            });
        }
        if (($scope.currentPage + 1) * $scope.pageSize > $scope.maxBlock) {
            $scope.$eval(function () {
                $scope.shownRows = $scope.maxBlock;
            });
        } else {
            $scope.$eval(function () {
                $scope.shownRows = ($scope.currentPage + 1) * $scope.pageSize;
            });
        }
        $scope.getBlocks($scope.currentPage);
    };


    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.getBlocks = function (page) {
        $scope.loading = true;
        let blocks = {};
        let displayBlocks = [];
        $http.get(`https://api.fusionnetwork.io/blocks/all?sort=desc&page=${page}&size=20&field=height`).then(function (r) {
            blocks = r.data;
            console.log(blocks);
            for (let block in blocks) {
                let blocksExtraData = JSON.parse(blocks[block].block);
                let data = {
                    block: blocks[block].height,
                    age: window.format(blocksExtraData.timestamp * 1000),
                    transactions: blocks[block].numberOfTransactions,
                    miner: blocksExtraData.miner,
                    gasUsed: blocksExtraData.gasUsed,
                    gasLimit: blocksExtraData.gasLimit
                }
                displayBlocks.push(data);
                $scope.blocks = displayBlocks;
            }

        }).then(function(){
            $scope.loading = false;
        });
    }

    $http.get('https://api.fusionnetwork.io/fsnprice').then(function (r) {
        $scope.maxBlock = r.data.maxBlock;
        $scope.endPage = Math.ceil($scope.maxBlock / $scope.pageSize);
    });


    $scope.getBlocks(0);

};

export default blocksController;

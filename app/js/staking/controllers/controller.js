let blockController = function ($http, $scope) {

    $scope.realTimeStatus = false;
    $scope.walletAddressSaved = localStorage.getItem('stakingAddress');
    $scope.walletAddress = $scope.walletAddressSaved;
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');

    $scope.$watch('walletAddressSaved', function () {
        if ($scope.walletAddressSaved !== '' || $scope.walletAddressSaved === undefined) {
            $scope.getStakingInfo($scope.walletAddressSaved);
        }
    })

    $scope.saveCookie = function () {
        console.log(window.web3.utils.isAddress($scope.walletAddress))
        if (window.web3.utils.isAddress($scope.walletAddress)) {
            localStorage.setItem('stakingAddress', $scope.walletAddress);
            $scope.walletAddressSaved = $scope.walletAddress;
            $scope.getStakingInfo($scope.walletAddress);
        }
    };

    $scope.deleteCookie = function () {
        $scope.walletAddressSaved = '';
        $scope.walletAddress = '';
        localStorage.setItem('stakingAddress', '')
    };

    $scope.getStakingInfo = function (walletAddress) {
        if (!walletAddress) {
            return
        }
        try {
            let data = {};
            let ticketsData;
            let tickets = {};
            $http.get(`https://api.fusionnetwork.io/balances/${walletAddress}`).then(function (r) {
                data = r.data;
                if (data.length === 0) {
                    $scope.$eval(function () {
                        $scope.stakingRewardsEarned = 0;
                        $scope.totalTickets = 0;
                    })
                }

                if (data.length > 0) {
                    ticketsData = JSON.parse(data[0].balanceInfo);
                    tickets = Object.keys(ticketsData.tickets);

                    $scope.stakingRewardsEarned = data[0].rewardEarn;
                    $scope.totalTickets = tickets.length;
                }
                $scope.lastUpdated = moment(new Date().getTime()).format('LTS');

            });
        } catch (err) {
            console.log(err)
        }
    };
};

export default blockController;

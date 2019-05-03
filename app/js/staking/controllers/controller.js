let blockController = function ($http, $scope) {

    $scope.realTimeStatus = false;
    $scope.walletAddressSaved = localStorage.getItem('stakingAddress');
    $scope.walletAddress = $scope.walletAddressSaved;

    console.log($scope.walletAddressSaved);

    $scope.$watch('realTimeStatus', function(){
        if($scope.realTimeStatus !== undefined){
            console.log($scope.realTimeStatus);
        }
    });

    $scope.saveCookie = function (){
        console.log(window.web3.utils.isAddress($scope.walletAddress))
        if(window.web3.utils.isAddress($scope.walletAddress)){
            localStorage.setItem('stakingAddress', $scope.walletAddress);
            $scope.walletAddressSaved = $scope.walletAddress;
            $scope.getStakingInfo($scope.walletAddress);
        }
    };

    $scope.deleteCookie = function(){
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
                data = r.data
            })

            if (data.length === 0) {
                $scope.$eval(function () {
                    $scope.stakingRewardsEarned = 0;
                    $scope.totalTickets = 0;
                })
            }

            if (data.length > 0) {
                ticketsData = JSON.parse(data[0].balanceInfo);
                tickets = Object.keys(ticketsData.tickets);

                $scope.$eval(function () {
                    $scope.stakingRewardsEarned = data[0].rewardEarn;
                    $scope.totalTickets = tickets.length;
                })
            }
        } catch (err) {
            console.log(err)
        }
    };
    $scope.getStakingInfo();
};

export default blockController;

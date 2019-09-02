let blockController = function ($http, $scope) {

    $scope.realTimeStatus = false;
    $scope.walletAddressSaved = localStorage.getItem('stakingAddress');
    if ($scope.walletAddressSaved == null) {
        $scope.walletAddressSaved = '';
    }
    ;
    $scope.walletAddress = $scope.walletAddressSaved;
    $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
    $scope.activeTickets = [];

    $scope.$watch('walletAddressSaved', function () {
        if ($scope.walletAddressSaved !== '' || $scope.walletAddressSaved === undefined) {
            $scope.getStakingInfo($scope.walletAddressSaved);
        }
    });

    $scope.getProbabilty = async function () {
        console.log('Checking probability');
        let t = 0;
        await web3.fsn.totalNumberOfTickets().then(function (tickets) {
            t = tickets;
        });
        $scope.$applyAsync(function () {
            $scope.totalNumberOfTicketsOnChain = t;
            $scope.stakingProbability = ($scope.totalTickets  / t * 100).toFixed(2);
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

    $scope.saveCookie = async function () {
        if (window.web3.utils.isAddress($scope.walletAddress)) {
            localStorage.setItem('stakingAddress', $scope.walletAddress);
            $scope.walletAddressSaved = $scope.walletAddress;
            $scope.getStakingInfo($scope.walletAddress);
        } else if (!window.web3.utils.isAddress($scope.walletAddress)) {
            await window.web3.fsn.getAddressByNotation(parseInt($scope.walletAddress)).then(function (r) {
                localStorage.setItem('stakingAddress', r);
                $scope.walletAddressSaved = r;
                $scope.getStakingInfo(r);
                $scope.getLastMinedBlocks(r);
            })
        }
    };

    $scope.deleteCookie = function () {
        $scope.walletAddressSaved = '';
        $scope.walletAddress = '';
        localStorage.setItem('stakingAddress', '')
    };

    $scope.getStakingInfo = async function (walletAddress) {
        if (!walletAddress) {
            return
        }
        try {
            let data = {};
            let ticketsData;
            let tickets = {};
            await $http.get(`${window.getServer()}balances/${walletAddress}`).then(function (r) {
                data = r.data;
                console.log(data);
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
                $scope.getActiveTickets(walletAddress);
                $scope.lastUpdated = moment(new Date().getTime()).format('LTS');
            });

            $scope.getProbabilty();

        } catch (err) {
            // console.log(err)
        }
    };
    $scope.getActiveTickets = async function (walletAddress) {
        $scope.activeTickets = [];
        let activeTickets = [];
        if (!walletAddress) {
            return
        }
        try {
            await window.web3.fsn.allTicketsByAddress(walletAddress).then(function (tickets) {
                for (let ticket in tickets) {
                    let data = {
                        block: tickets[ticket].Height,
                        timespan: `${$scope.returnDateString(tickets[ticket].StartTime, 'Start')} - ${$scope.returnDateString(tickets[ticket].ExpireTime, 'End')}`,
                        value: '5000 FSN',
                    }
                    activeTickets.push(data);
                }
                $scope.$apply(function () {
                    $scope.activeTickets = activeTickets;
                })
            });
        } catch (err) {
            // console.log(err)
        }
        $scope.getLastMinedBlocks(walletAddress);
    };

    $scope.allLastMinedBlocks = [];
    $scope.getLastMinedBlocks = async (walletAddress) => {
        let minedBlocks = [];
        await $http.get(`${window.getServer()}blocks/all?address=${walletAddress}&sort=desc&page=0&size=40&field=height}`).then(function (r) {
            let blocks = r.data;
            for (let block in blocks){
                let data = {
                    hash: blocks[block].hash,
                    time: moment(blocks[block].timeStamp * 1000).format('MMMM Do YYYY, h:mm:ss A'),
                    ago: format(blocks[block].timeStamp * 1000),
                    block: blocks[block].height
                }
                minedBlocks.push(data)
            }

            $scope.$eval(function(){
                $scope.allLastMinedBlocks = minedBlocks;
            })
        });
    }
};

export default blockController;

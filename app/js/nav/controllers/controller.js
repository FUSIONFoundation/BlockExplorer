let navController = function ($http, $scope, $location) {
    $scope.$location = $location;
    $scope.showNav = false;
    $scope.currentChain = 'Mainnet';

    let nu = localStorage.getItem(window.cookieName)
    let data = nu ? JSON.parse(nu) : {};
    if (data.chain == 'mainnet') {
        $scope.currentChain = 'Mainnet';
    } else if (data.chain == 'testnet') {
        $scope.currentChain = 'Testnet';
    } else if (data.chain == '') {
        $scope.currentChain = 'Mainnet';
    }

    $scope.setCurrentChain = function (chain) {
        if (chain == 'mainnet') {
            let data = {
                'chain': 'mainnet'
            }
            localStorage.setItem(window.cookieName, JSON.stringify(data));
            window.location.reload();
        } else if (chain == 'testnet') {
            let data = {
                'chain': 'testnet'
            }
            localStorage.setItem(window.cookieName, JSON.stringify(data));
            window.location.reload();
        }

    };
    $scope.search = function () {
        let input = $scope.globalSearch;
        let reg = new RegExp('^[0-9]*$');
        if (reg.test(input)) {
            window.location.href = `./#!/block/${input}`;
        } else if (input.indexOf('0x') == 0 && input.length == 42 && web3.utils.isAddress($scope.globalSearch)) {
            window.location.href = `./#!/address/${input}`;
        } else if (input.indexOf('0x') == 0 && input.length == 66) {
            window.location.href = `./#!/transaction/${input}`;
        }
    }
};

export default navController;
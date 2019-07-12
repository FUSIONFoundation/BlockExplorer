let navController = function ($http, $scope, $location, $window) {
        $scope.$location = $location;
        $scope.showNav = false;
        $scope.currentChain = 'Mainnet';
        $scope.currentLanguage = window.currentLanguage;

        let nu = localStorage.getItem(window.cookieName)
        let data = nu ? JSON.parse(nu) : {};
        if (data.chain == 'mainnet') {
            $scope.currentChain = 'Mainnet';
        } else if (data.chain == 'testnet') {
            $scope.currentChain = 'Testnet';
        } else if (data.chain == '') {
            $scope.currentChain = 'Mainnet';
        }

        $scope.setCurrentLanguage = function (code) {
            console.log(`Changed language to ${code}`);
            window.currentLanguage = code;
            let nu = localStorage.getItem(window.cookieName)
            nu = JSON.parse(nu);
            nu.language = code;
            localStorage.setItem(window.cookieName, JSON.stringify(nu));
            $window.location.reload();
        }

        $scope.setCurrentChain = function (chain) {
            let nu = localStorage.getItem(window.cookieName)
            nu = JSON.parse(nu);
            nu.chain = chain;
            localStorage.setItem(window.cookieName, JSON.stringify(nu));
            window.location.reload();
        };

        $scope.search = async function () {
            let input = $scope.globalSearch;
            console.log(input);
            let reg = new RegExp('^[0-9]*$');
            if (reg.test(input)) {
                try {
                    await web3.fsn.getAddressByNotation(parseInt(input)).then(function (r) {
                        if (web3.utils.isAddress(r)) {
                            window.location.href = `./#!/address/${r}`;
                        }
                    })
                } catch (err) {
                    window.location.href = `./#!/block/${input}`;
                }
            } else if (input.indexOf('0x') == 0 && input.length == 42 && web3.utils.isAddress($scope.globalSearch)) {
                window.location.href = `./#!/address/${input}`;
            } else if (input.indexOf('0x') == 0 && input.length == 66) {
                window.location.href = `./#!/transaction/${input}`;
            }
            $scope.globalSearch = '';
        }
    }
;

export default navController;

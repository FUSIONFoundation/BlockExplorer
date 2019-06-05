let navController = function ($http, $scope, $location) {
    $scope.$location = $location;
    $scope.showNav = false;

    $scope.search = function (){
        let input = $scope.globalSearch;
        let reg = new RegExp('^[0-9]*$');
        if(reg.test(input)){
            window.location.href = `./#!/block/${input}`;
        }else if(input.indexOf('0x') == 0 && input.length == 42 && web3.utils.isAddress($scope.globalSearch)){
                window.location.href = `./#!/address/${input}`;
        } else if (input.indexOf('0x') == 0 && input.length == 66){
                window.location.href = `./#!/transaction/${input}`;
        }
    }
};

export default navController;
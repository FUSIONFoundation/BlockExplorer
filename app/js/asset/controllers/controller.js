let assetController = function ($http, $scope, $stateParams) {
    let assetId = $stateParams.asset_id;

    $scope.assetData = {};

    $scope.countDecimals = function (decimals) {
        let returnDecimals = '1';
        for (let i = 0; i < decimals; i++) {
            returnDecimals += '0';
        }
        return parseInt(returnDecimals);
    };

    $scope.getAsset = function () {
        $http.get('https://api.fusionnetwork.io/assets/verified').then(function (r) {
            $scope.verifiedAssets = r.data;
        });
        $http.get(`https://api.fusionnetwork.io/assets/${assetId}`).then(function (r) {
            let verifiedImage = '';
            let hasImage = false;
            let verifiedAsset = false;
            for (let a in $scope.verifiedAssets) {
                if (assetId == $scope.verifiedAssets[a].assetID) {
                    // Set matched image name
                    verifiedImage = $scope.verifiedAssets[a].image;
                    hasImage = true;
                    verifiedAsset = true;
                }
            }
            let asset = r.data[0];
            let extraAssetData = JSON.parse(r.data[0].data);
            let totalSupply = new window.BigNumber(extraAssetData.Total.toString());
            let totalSupplyFormatted = totalSupply.div($scope.countDecimals(parseInt(extraAssetData.Decimals).toString()));
            let data = {
                assetId: extraAssetData.AssetID,
                assetName: extraAssetData.Name,
                assetSymbol: extraAssetData.Symbol,
                assetType: 'Issued on FUSION',
                decimals: extraAssetData.Decimals,
                totalSupply: totalSupplyFormatted.toString(),
                issuer: asset.fromAddress,
                issueHeight: asset.height,
                changeableSupply: extraAssetData.CanChange,
                hasImage : hasImage,
                verifiedImage : verifiedImage,
                verified : verifiedAsset,
            };
            console.log(data);
            $scope.$eval(function () {
                $scope.assetData = data;
            });
        });
    };

    $scope.getAsset();

};

export default assetController;
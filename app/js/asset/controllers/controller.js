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

    $scope.getVerifiedAssets = function () {
        $http.get(`${window.getServer()}assets/verified`).then(function (r) {
            $scope.verifiedAssets = r.data;
        });
    };

    $scope.getAsset = function () {
        if (assetId === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
            let verifiedImage = 'EFSN_LIGHT.svg';
            let hasImage = true;
            let verifiedAsset = true;
            let totalSupply = new window.BigNumber('81920000000000000000000000');
            let totalSupplyFormatted = totalSupply.div('1000000000000000000');
            let data = {
                assetId: assetId,
                assetName: 'Fusion',
                assetSymbol: 'FSN',
                assetType: 'Issued on FUSION',
                decimals: 18,
                totalSupply: totalSupplyFormatted.toString(),
                issuer: 'Coinbase',
                issueHeight: 'Genesis Block',
                changeableSupply: false,
                hasImage: hasImage,
                verifiedImage: verifiedImage,
                verified: verifiedAsset
            };
            console.log(data);
            $scope.$eval(function () {
                $scope.assetData = data;
            });
            return;
        }
        $http.get(`${window.getServer()}assets/${assetId}`).then(function (r) {
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
                hasImage: hasImage,
                verifiedImage: verifiedImage,
                verified: verifiedAsset,
            };
            console.log(data);
            $scope.$eval(function () {
                $scope.assetData = data;
            });
        });
    };

    $scope.getVerifiedAssets();
    $scope.getAsset();

};

export default assetController;

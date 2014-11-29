BallotApp.controller('ballotViewController', function ($scope, ballot, $ionicNavBarDelegate, $stateParams) {
    $scope.ballot = ballot;
    $scope.owns = !!$stateParams.owns;

    $scope.back = function () {
        $ionicNavBarDelegate.back()
    };
    $scope.afterDelete = function(promise){
        promise.then(function(){
            $scope.back()
        })
    }

});
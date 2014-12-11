BallotApp.controller('ballotViewController', function ($scope, ballot, $ionicNavBarDelegate) {
    $scope.ballot = ballot;
    $scope.back = function () {
        $ionicNavBarDelegate.back()
    };
    $scope.afterDelete = function (promise) {
        promise.then(function () {
            $scope.back()
        })
    };
});
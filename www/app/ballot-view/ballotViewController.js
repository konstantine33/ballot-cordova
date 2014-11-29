BallotApp.controller('ballotViewController', function ($scope, ballot, $ionicNavBarDelegate, $stateParams, $state) {
    $scope.ballot = ballot;

    $scope.action_button = "Back";
    $scope.action = function () {
        $ionicNavBarDelegate.back()
    };

    if ($stateParams.action === "vote") {
        $scope.action = function () {
            $state.go('vote')
        };
        $scope.action_button = "Continue";
    };

    $scope.back = $ionicNavBarDelegate.back
});
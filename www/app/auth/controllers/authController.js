BallotApp.controller('authController', function ($state, Authenticate, $ionicLoading, $timeout) {
    $ionicLoading.show();

    Authenticate()
        .then(function () {
            $ionicLoading.hide();
            $state.go('vote');
        })
});
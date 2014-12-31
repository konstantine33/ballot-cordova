BallotApp.controller('indexController', function ($state, Authenticate, $ionicLoading, $ionicPlatform) {
    $ionicLoading.show();
    Authenticate()
        .then(function () {
            $ionicLoading.hide();
            $state.go('vote');
        })

});
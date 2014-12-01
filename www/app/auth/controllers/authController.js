BallotApp.controller('authController', function ($state, Authenticate, $ionicLoading, $ionicPlatform) {
    $ionicLoading.show();

    $ionicPlatform.ready(function(){
        Authenticate()
            .then(function () {
                $ionicLoading.hide();
                $state.go('vote');
            })
    })
});
BallotApp.controller('appController', function ($state, Authenticate, $window, $ionicPlatform, $timeout) {

    function doneLoading (){
        $state.go('vote');
        $ionicPlatform.ready(function(){
            if($window.navigator.splashscreen){
                $timeout(function(){
                    $window.navigator.splashscreen.hide();
                }, 1000)
            }
        });
    }

    Authenticate()
        .then(function () {
            doneLoading()
        })

});
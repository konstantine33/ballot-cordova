BallotApp.controller('appController', function ($state, Authenticate, $window, $ionicPlatform) {

    function doneLoading (){
        $state.go('vote');
        $ionicPlatform.ready(function(){

            if($window.navigator.splashscreen){
                $window.navigator.splashscreen.hide();
            }

        });
    }

    Authenticate()
        .then(function () {
            doneLoading()
        })

});
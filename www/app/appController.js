BallotApp.controller('appController', function ($state, Authenticate, $window, $ionicPlatform, $timeout, CurrentAccount, $scope, $rootScope, BackButtonHack) {

    $scope.backButtonControls = BackButtonHack.controls;
    $scope.doneCheckingAccount = false;
    $scope.showIntro = false;

    function hideSplash (){
        $ionicPlatform.ready(function(){
            if($window.navigator.splashscreen){
                $timeout(function(){
                    $window.navigator.splashscreen.hide();
                }, 600)
            }
        });
    }


    function goToVote() {
        $scope.showIntro = false;
        $state.go('vote');
    }

    Authenticate()
        .then(function () {
            return CurrentAccount.init();
        })
        .then(function(){
            hideSplash();
            $scope.doneCheckingAccount = true;
            if(CurrentAccount.get('viewedIntro') && CurrentAccount.get('agreedToTerms')){
                goToVote();
            }else {
                $scope.goToIntro();
            }
        });


    $scope.goToIntro = function(){
        $scope.showIntro = true;
        var off = $rootScope.$on('finishedIntro', function(){
            goToVote();
            off();
        })
    };

});
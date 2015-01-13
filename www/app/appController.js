BallotApp.controller('appController', function ($state, Authenticate, $window, $ionicPlatform, $timeout, Account, $scope, $rootScope) {

    $scope.hasCheckedIntro = false;
    $scope.isShowingIntro = false;

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
        $scope.isShowingIntro = false;
        $state.go('vote');
    }

    $scope.viewIntro = function(){
        $scope.isShowingIntro = true;
        var off = $rootScope.$on('finishedIntro', function(){
            goToVote();
            off();
        })
    };

    Authenticate()
        .then(function () {
            hideSplash();
            return Account.checkIfViewedIntro();
        })
        .then(function(viewedIntro){

            $scope.hasCheckedIntro = true;
            if(viewedIntro){
                goToVote();
            }else {
                $scope.viewIntro()
            }
        })

});
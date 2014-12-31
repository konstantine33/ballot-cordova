BallotApp.controller('appController', function ($state, Authenticate, $ionicLoading, $timeout, $scope) {
    $scope.loading = true;
    $ionicLoading.show();

    function doneLoading (){
        $ionicLoading.hide();
        $scope.loading = false;
        $state.go('vote');
    }

    Authenticate()
        .then(function () {
            doneLoading()
        })

});
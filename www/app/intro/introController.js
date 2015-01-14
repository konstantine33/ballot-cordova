BallotApp.controller('introController', function($scope, Account, $state, $rootScope){

    $scope.show_help = false;

    $scope.showHelp= function(){
        $scope.show_help = true;
    };

    $scope.finishIntro = function(){
        Account.hasViewedIntro();
        $rootScope.$emit('finishedIntro')
    };
});
BallotApp.controller('introController', function($scope, Account, $state, $rootScope){
    $scope.finishIntro = function(){
         Account.hasViewedIntro();
         $rootScope.$emit('finishedIntro')
     }
});
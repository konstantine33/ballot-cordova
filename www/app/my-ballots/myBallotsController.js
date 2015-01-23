BallotApp.controller('myBallotsController', function($scope, Ballot, BackButtonHack){
    $scope.ballots = [];
    $scope.loaded = false;
    $scope.hasMore = true;
    $scope.ballot = null;
    var query = Ballot.queryOwn();

    $scope.getMore = function(){
        query.next()
            .then(function(results){
                $scope.loaded = true;
                $scope.hasMore = !!results.length;
                $scope.ballots = $scope.ballots.concat(results);
                $scope.$broadcast('scroll.infiniteScrollComplete')
            });
    };

    $scope.selectBallot = function(ballot){
        $scope.ballot = ballot;
        BackButtonHack.showBack();
    };

    $scope.deselectBallot = function(){
        $scope.ballot = null;
        BackButtonHack.hideBack();
    };

    BackButtonHack.registerBackFunction($scope.deselectBallot);
    BackButtonHack.resetOnScopeDestroy($scope);
});
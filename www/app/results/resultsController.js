BallotApp.controller('resultsController', function($scope, Ballot){
    $scope.ballots = [];
    $scope.loaded = false;
    $scope.hasMore = true;
    $scope.ballot = null;
    var query = Ballot.queryResponded();

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
    };

    $scope.deselectBallot = function(){
        $scope.ballot = null;
    }

});
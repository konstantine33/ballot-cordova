BallotApp.controller('resultsController', function($scope, Ballot){
    $scope.ballots = [];
    $scope.loaded = false;
    var query = Ballot.queryResponded();

    $scope.getMore = function(){
        query.next()
            .then(function(results){
                $scope.loaded = true;
                $scope.ballots = $scope.ballots.concat(results);
            });
    }

    $scope.getMore()
});
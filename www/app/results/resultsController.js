BallotApp.controller('resultsController', function($scope, Ballot){
    $scope.ballots = [];
    var query = Ballot.queryResponded();

    $scope.getMore = function(){
        query.next()
            .then(function(results){
                $scope.ballots = $scope.ballots.concat(results);
            });
    }

    $scope.getMore()
});
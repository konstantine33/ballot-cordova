BallotApp.controller('myBallotsController', function($scope, Ballot){
    $scope.ballots = [];
    var query = Ballot.queryOwn()

    $scope.getMore = function(){
        query.next()
            .then(function(results){
                $scope.ballots = $scope.ballots.concat(results);
            });
    }

    $scope.getMore()
});
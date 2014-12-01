BallotApp.controller('myBallotsController', function($scope, Ballot){
    $scope.ballots = [];
    $scope.loaded = false;
    var query = Ballot.queryOwn();

    $scope.getMore = function(){
        query.next()
            .then(function(results){
                $scope.loaded = true;
                $scope.ballots = $scope.ballots.concat(results);
            });
    };

    $scope.getMore();

    $scope.confirmClose = function($event, ballot){
        $event.stopPropagation();
        $event.preventDefault();
        ballot.confirmClose()
    }
});
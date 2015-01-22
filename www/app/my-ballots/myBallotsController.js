BallotApp.controller('myBallotsController', function($scope, Ballot){
    $scope.ballots = [];
    $scope.loaded = false;
    $scope.hasMore = true;
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
});
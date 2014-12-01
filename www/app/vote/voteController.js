BallotApp.controller('voteController', function ($scope, Ballot, $rootScope) {
    $scope.newBallotsEvent = "NewBallotsEvent";
    Ballot.recommend(5)
        .then(function (ballots) {
            $scope.loaded = true;
            $rootScope.$emit($scope.newBallotsEvent, {ballots: ballots});
        });
});
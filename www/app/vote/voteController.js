BallotApp.controller('voteController', function ($scope, Ballot, $state) {
    Ballot.recommend(1)
        .then(function (ballot) {
            $scope.ballot = ballot[0];
        });

    $scope.responseType = Ballot.responseType;
    $scope.respond = function (response) {
        $scope.ballot.respond(response)
            .then(function () {
                $state.go('ballot', {ballot_id: $scope.ballot.getId()})
            })
    }
});
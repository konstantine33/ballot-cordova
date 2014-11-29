BallotApp.controller('voteController', function ($scope, Ballot, $window, $state) {
    $scope.loaded = false;
    Ballot.recommend(1)
        .then(function (ballot) {
            $scope.loaded= true;
            $scope.ballot = ballot[0];
        });

    $scope.responseType = Ballot.responseType;
    $scope.respond = function (response) {
        $scope.ballot.respond(response)
            .then(function () {
                $state.go('ballot', {ballot_id: $scope.ballot.getId(), action: "vote"})
            })
    };


    var cards = [].slice.call(document.querySelectorAll('#ballot li'));
    var stack = $window.gajus.Swing.Stack({
        isThrowOut: function(offset, element, confidence){
            return confidence > 0.35
        },
        throwOutDistance: function(){
            return $window.innerWidth;
        }
    });

    cards.forEach(function(targetElement){
        stack.createCard(targetElement)
    });

    stack.on('throwoutleft', function(){
       $scope.respond($scope.responseType.NO)
    });

    stack.on('throwoutright', function(){
        $scope.respond($scope.responseType.YES)
    });


});
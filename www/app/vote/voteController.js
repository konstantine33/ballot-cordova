BallotApp.controller('voteController', function ($scope, Ballot, $rootScope, LocalNotifications) {

    LocalNotifications.registerPermission()
        .then(function(){
            return LocalNotifications.setNewPollsNotification();
        });

    $scope.newBallotsEvent = "NewBallotsEvent";
    $scope.getBallotsEvent = "GetBallotsEvent";

    function getBallots() {
        Ballot.recommend(50)
            .then(function (ballots) {
                $scope.loaded = true;
                $rootScope.$emit($scope.newBallotsEvent, {ballots: ballots});
            });
    }
    getBallots();

    var off = $rootScope.$on($scope.getBallotsEvent, function(){
        getBallots()
    });

    $scope.$on("$destroy", function(){
        off();
    });

});
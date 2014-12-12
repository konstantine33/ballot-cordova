BallotApp.controller('createBallotController', function ($scope, Ballot, $window, $state, BusyManager) {
    $scope.maxQuestionLength = 140;
    $scope.maxAnswerLength = 20;
    $scope.busy_id = "create_button";
    $scope.form_data = {
        question: "",
        left_answer: Ballot.defaultAnswers.LEFT_RESPONSE,
        right_answer: Ballot.defaultAnswers.RIGHT_RESPONSE,
        error: ''
    };



    $scope.done = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$scope.form_data.question) {
            $scope.form_data.error = "Please enter a question";
            var off = $scope.$watch('form_data.question', function (newVal) {
                if (newVal) {
                    $scope.form_data.error = '';
                    off()
                }
            });
            return;
        }
        $scope.form_data.error = '';

        var promise = Ballot.create($scope.form_data.question, $scope.form_data.left_answer, $scope.form_data.right_answer);
        BusyManager.manageRequest(promise, $scope.busy_id);
        promise.then(function (b) {
            $state.go('my_ballots')
        })
    }
});
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

    var validateRequiredField = function (field, help_text) {
        if (!$scope.form_data[field]) {
            $scope.form_data.error = help_text;
            var off = $scope.$watch('form_data.' + field, function (newVal) {
                if (newVal) {
                    $scope.form_data.error = '';
                    off()
                }
            });
            return false;
        }

        return true;
    };

    $scope.done = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (validateRequiredField('question', "Please enter a question")
            && validateRequiredField('left_answer', "Please enter a left-side answer choice")
            && validateRequiredField('right_answer', "Please enter a right-side answer choice")) {

            $scope.form_data.error = '';

            var promise = Ballot.create($scope.form_data.question, $scope.form_data.left_answer, $scope.form_data.right_answer);
            BusyManager.manageRequest(promise, $scope.busy_id);
            promise.then(function (b) {
                $state.go('my_ballots')
            })
        }
    }
});
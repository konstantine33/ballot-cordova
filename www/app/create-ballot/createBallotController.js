BallotApp.controller('createBallotController', function($scope, Ballot, $window, $state, BallotError){
    $scope.maxQuestionLength = 140;
    $scope.form_data = {
        question: "",
        close_opt: 0,
        error: ''
    };

    $scope.close_options = [
        {
            title: "1 day",
            value: 1
        },
        {
            title: "3 days",
            value: 3
        },
        {
            title: "1 week",
            value: 7
        },
        {
            title: "2 weeks",
            value: 14
        },
        {
            title: "Manually",
            value: 0
        }
    ];

    $scope.done = function(){

        if(!$scope.form_data.question){
            $scope.form_data.error = "Please enter a question";
            var off = $scope.$watch('form_data.question', function(newVal){
                if(newVal){
                    $scope.form_data.error = '';
                    off()
                }
            });
            return;
        }
        $scope.form_data.error = '';

        var data = {
            question: $scope.form_data.question
        };

        if($scope.form_data.close_opt){
            data.end_time = $window.moment().add($scope.form_data.close_opt, 'days').toDate()
        }


        Ballot.create(data).then(function(b){
            $state.go('ballot', {ballot_id: b.getId()})
        }, function(e){
            BallotError(e)
        })
    }
});
BallotApp.controller('settingsController', function ($scope, CurrentAccount, BusyManager, $state) {
    $scope.form_data = {
        username: CurrentAccount.data.username,
        error: ''
    };
    $scope.busy_id = "create_button";
    $scope.maxUsernameLength = 40;

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

    $scope.save = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (validateRequiredField('username', "Please enter a username")) {
            $scope.form_data.error = '';

            var promise = CurrentAccount.updateUsername($scope.form_data.username);
            BusyManager.manageRequest(promise, $scope.busy_id);
            promise.then(function (b) {
                $state.go('vote')
            })

        }
    }
});
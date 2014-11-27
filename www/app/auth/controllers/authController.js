BallotApp.controller('authController', function ($state, $rootScope, Authenticate) {
    Authenticate()
        .then(function () {
            $state.go('ballot')
        })
});
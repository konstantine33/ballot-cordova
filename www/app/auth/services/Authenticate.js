BallotApp.factory('Authenticate', function ($q, $http, $window, BallotError, SERVER_URL, $rootScope) {
    function authenticate() {
        var deferred = $q.defer();

        //REMOVE BELOW
        var authenticator = "test1234567890";
        //var authenticator;

        //Android only
        if ($window.device && $window.device.uuid) {
            authenticator = $window.device.uuid
        }

        $http.post(SERVER_URL + '/auth', {authenticator: authenticator})
            .success(function (user) {
                $rootScope.user = user;
                deferred.resolve(user)
            })
            .error(function (error) {
                BallotError(error, {deferred: deferred});
            });

        return deferred.promise;
    }

    return authenticate;
});
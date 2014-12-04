BallotApp.factory('Authenticate', function ($q, $http, $window, BallotError, SERVER_URL, BallotToken) {
    var BALLOT_KEYCHAIN = "ballot_account_id";
    var BALLOT_SERVICE_NAME = "com.getballot";

    function makeid(count) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < count; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    function authenticate() {
        var deferred = $q.defer();
        var authenticator;

        //Android only
        if ($window.device && $window.device.uuid) {
            if ($window.device.platform === "Android" && $window.device.uuid) {
                authenticator = $window.device.uuid;
                deferred.resolve();

            } else if ($window.device.platform === "iOS" && $window.Keychain) {
                var keychain = new Keychain();

                function setValue(){
                    var new_id = makeid(25);
                    keychain.setForKey(function () {
                        authenticator = new_id;
                        return deferred.resolve();
                    }, function(e){
                        return deferred.reject('Unable to set keychain value')
                    }, BALLOT_KEYCHAIN, BALLOT_SERVICE_NAME, new_id)
                }


                keychain.getForKey(function (value) {
                    if (value) {
                        console.log('got value ' + value)
                        authenticator = value;
                        return deferred.resolve();
                    } else {
                        setValue()
                    }

                }, function () {
                    console.log('did not get value')
                    setValue()
                }, BALLOT_KEYCHAIN, BALLOT_SERVICE_NAME)

            }
        } else {
            authenticator = "test1234567890";
            deferred.resolve();
        }

        return deferred.promise.then(function(){
            return $http.post(SERVER_URL + '/auth', {authenticator: authenticator})
                .success(function (data) {
                    BallotToken.store(data.token);
                    deferred.resolve()
                })
                .error(function (error) {
                    BallotToken.del();
                    BallotError(error, {deferred: deferred});
                });
        }, function(e){
            BallotError(e);
        });

    }

    return authenticate
});
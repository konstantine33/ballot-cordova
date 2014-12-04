BallotApp.factory('Authenticate', function ($q, $http, $window, BallotError, SERVER_URL, BallotToken) {
    var BALLOT_KEYCHAIN = "ballot_account_id";
    var BALLOT_SERVICE_NAME = "BallotApp";

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
                        authenticator = value;
                        return deferred.resolve();
                    } else {
                        setValue()
                    }

                }, function () {
                    setValue()
                }, BALLOT_KEYCHAIN, BALLOT_SERVICE_NAME)

            }
        } else {
            authenticator = "test1234567890";
            deferred.resolve();
        }

        return deferred.promise.then(function(){
            return $http.post(SERVER_URL + '/auth', {authenticator: authenticator})
                .then(function(response){
                    BallotToken.store(response.data.token);
                }, function(e){
                    BallotToken.del();
                    return $q.reject(e);
                })
        }, function(e){
            BallotError(e);
        });

    }

    return authenticate
});
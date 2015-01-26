BallotApp.factory('Authenticate', function ($q, $http, $window, SERVER_URL, BallotToken, $ionicPlatform) {
    var TALLY_KEYCHAIN = "tally_authenticator";
    var TALLY_SERVICE_NAME = "com.tallyhere.tally";

    function makeid(count) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < count; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    /** Checks for Android uuid or creates & sets/gets iOS keychain value
     Then uses that value to login with the server. Once successful, a token is stored.

     Returns: Promsie
     */
    function login() {
        var deferred = $q.defer();
        var authenticator;

        $ionicPlatform.ready(function () {
            if ($window.device && $window.device.platform === "Android" && $window.device.uuid) {
                authenticator = $window.device.uuid;
                deferred.resolve();

            } else if ($window.device && $window.device.platform === "iOS" && $window.Keychain) {
                var keychain = new Keychain();

                function setValue() {
                    var new_id = makeid(25);
                    keychain.setForKey(function () {
                        authenticator = new_id;
                        return deferred.resolve();
                    }, function (e) {
                        return deferred.reject('Unable to set keychain value')
                    }, TALLY_KEYCHAIN, TALLY_SERVICE_NAME, new_id);

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
                }, TALLY_KEYCHAIN, TALLY_SERVICE_NAME)

            } else {
                //For development
                //authenticator = "test1234567890";
                authenticator = makeid(25);
                deferred.resolve();
            }
        });


        return deferred.promise.then(function () {
            return $http.post(SERVER_URL + '/auth', {authenticator: authenticator})
                .then(function (response) {
                    BallotToken.store(response.data.token);
                }, function (e) {
                    BallotToken.del();
                    return $q.reject(e);
                })
        });
    }

    //Authenticates if necessary
    function authenticate() {
        if(!BallotToken.get()){
            return login();
        }else {
            return $http.post(SERVER_URL + '/check-auth').catch(function(){
                return login();
            })
        }
    }

    return authenticate
});
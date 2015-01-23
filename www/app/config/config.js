BallotApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $window, BallotToken) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = BallotToken.get();

                if(token){
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function(error){


                //If it is some error that we cant recover from, then display errors
                console.log(error);
                var message = "An error has occurred. Please exit and restart Ballot.";
                if(error.status === 0){
                    message = "Internet connection was lost. Please connect to the internet then restart Ballot."
                }

                if(error.status === 503 || error.status === 403){
                    message = error.data;
                }

                if(error.status === 410 || error.data === "UpgradeClient"){
                    message = "A new version of the app is available! Please check the app store for an update."
                }

                //If error is due to lack of authorization, then don't alert, but pass
                //error back for handling by Request which will re-auth
                if(error.status !== 401 && error.data !== "NOT_AUTHENTICATED"){
                    alert(message);
                }

                return $q.reject(error)
            }
        };
    });
})

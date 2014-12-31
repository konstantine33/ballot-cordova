BallotApp.config(function ($httpProvider, $provide) {
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
            }
        };
    });
})

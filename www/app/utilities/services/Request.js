/**
 * Wrapper around $http used to make API calls within "authenticated" areas. It will automatically refresh the token and
 * re-send request if the server says authentication token failed
 *
 * NOTE:
 * .success and .fail methods are not available
 */

BallotApp.factory('Request', function($http, $q, Authenticate){
    function Request(config){
        return $http(config).then(function(response){
            return response
        }, function(error){

            //If error is due to lack of authorization or accidentally cleared out token, then just authenticate and try again
            if(error.status === 401 && error.data === "NOT_AUTHENTICATED"){
                return Authenticate().then(function(){
                    return $http(config)
                })
            }

            //If it is some other error that we cant recover, then display errors
            console.log(error);
            var message = "An error has occurred. Please exit and restart Ballot.";
            if(error.status === 0){
                message = "Internet connection was lost. Please connect to the internet then restart Ballot."
            }

            //TODO: Build an error handling system at some point. This is just a hack for now
            if(error.data && error.data.indexOf && !!~error.data.indexOf('characters long')){
                message = error.data;
            }
            alert(message);

            return $q.reject(error)
        })
    }

    //Generate shortcut methods
    var no_data_methods = ["GET", "HEAD", "JSONP", "DELETE"];
    var data_methods = ["POST", "PUT", "PATCH"];

    angular.forEach(no_data_methods, function(method){
        Request[method.toLowerCase()] = function(url, config){
            config = config || {};
            config.url = url;
            config.method = method;
            return Request(config);
        }
    });

    angular.forEach(data_methods, function(method){
        Request[method.toLowerCase()] = function(url, data, config){
            config = config || {};
            config.url = url;
            config.data = data;
            config.method = method;
            return Request(config);
        }
    });

    return Request;
});
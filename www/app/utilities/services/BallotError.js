BallotApp.factory('BallotError', function($q){
    return function BallotError(error, options){
        options = options || {alert: false, promise: true};
        options.alert = angular.isDefined(options.alert) ? true : !!options.alert;
        options.promise = angular.isDefined(options.promise) ? true : !!options.promise;

        console.error(error);

        if(options.alert){
            alert("An error has occurred. Please exit and restart Ballot.")
        }
        if(options.deferred && options.deferred.reject){
            return options.deferred.reject(error)
        }
        if(options.promise){
            return $q.reject(error)
        }

        return error;
    }
});
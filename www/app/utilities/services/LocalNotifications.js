BallotApp.factory('LocalNotifications', function($ionicPlatform, $q, $window){

    /**
     * Promisify's a local notification's function. It will check for ready, check for the plugin availability, and then call the function the deferred object.
     * @param func_to_call
     */
    var promisify = function(func_to_call){
        var deferred = $q.defer();
        $ionicPlatform.ready(function(){
            if(!$window.plugin || !$window.plugin.notification){
                deferred.resolve(false)
            }

            if(angular.isFunction(func_to_call)){
                func_to_call(deferred)
            }
        });

        return deferred.promise;
    };

    function LocalNotifications(){
    }
    LocalNotifications.prototype.hasPermission = function(){
        var fnc = function(deferred){
            $window.plugin.notification.local.hasPermission(function (granted) {
                deferred.resolve(granted);
            });
        };

        return promisify(fnc);
    };

    LocalNotifications.prototype.registerPermission = function(){
        var fnc = function(deferred){
            $window.plugin.notification.local.registerPermission(function (granted) {
                deferred.resolve(granted);
            });
        };

        return this.hasPermission()
            .then(function(result){
                if(!result){
                    return promisify(fnc);
                }
            })

    };

    LocalNotifications.prototype.add = function(data){
        var fnc = function(deferred){
            $window.plugin.notification.local.add(data, function (result) {
                deferred.resolve(result);
            });
        };

        return promisify(fnc);
    };

    LocalNotifications.prototype.setNewPollsNotification = function(){
        var date = new Date();
        date.setDate(date.getDate() + 2);
        return this.add({
            id: 'new_polls_notification',
            date: date,
            title: "Tally",
            message: "There are new polls waiting for you to answer!",
            repeat: "weekly"
        })
    };

    var localNotifications = new LocalNotifications();
    return localNotifications;
});
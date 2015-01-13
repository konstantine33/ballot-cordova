BallotApp.factory('LocalNotifications', function ($ionicPlatform, $q, $window) {

    /**
     * Promisify's a local notification's function. It will check for ready, check for the plugin availability, and then call the function the deferred object.
     * @param func_to_call - will be called with a deferred object
     */
    var promisify = function (func_to_call) {
        var deferred = $q.defer();
        $ionicPlatform.ready(function () {
            if ($window.plugin && !$window.plugin.notification && angular.isFunction(func_to_call)) {
                return func_to_call(deferred)
            }

            deferred.resolve(false)
        });

        return deferred.promise;
    };

    function LocalNotifications() {
    }

    LocalNotifications.prototype.hasPermission = function () {
        var fnc = function (deferred) {
            $window.plugin.notification.local.hasPermission(function (granted) {
                deferred.resolve(granted);
            });
        };

        return promisify(fnc);
    };

    LocalNotifications.prototype.registerPermission = function () {
        var fnc = function (deferred) {
            $window.plugin.notification.local.registerPermission(function (granted) {
                deferred.resolve(granted);
            });
        };

        return this.hasPermission()
            .then(function (result) {
                if (!result) {
                    return promisify(fnc);
                }

                return result;
            })

    };

    LocalNotifications.prototype.add = function (data) {
        var fnc = function (deferred) {
            $window.plugin.notification.local.add(data, function (result) {
                deferred.resolve(result);
            });
        };

        return promisify(fnc);
    };


    //Makes sure there's permission then sets a new polls notification
    LocalNotifications.prototype.setNewPollsNotification = function () {
        var self = this;
        return this.registerPermission()
            .then(function (granted) {
                if (granted) {
                    var date = new Date();
                    date.setDate(date.getDate() + 2);
                    //date.setMinutes(date.getMinutes() + 1);
                    return self.add({
                        id: 'new_polls_notification',
                        date: date,
                        title: "Tally",
                        message: "There are new polls waiting for you to answer!",
                        repeat: "weekly"
                    })
                }
            })
    };

    var localNotifications = new LocalNotifications();
    return localNotifications;
});
var LWBusy = angular.module('LWBusy', []);

LWBusy.factory('BusyManager', function($rootScope, $q){
    var events = {
        LOADING: "lwBusyLoading",
        SUCCESS: "lwBusySuccess",
        ERROR: "lwBusyError"
    };

    var emit = function(event, busy_id){
        $rootScope.$emit(event, {busy_id: busy_id})
    };

    var manageRequest = function(promise, busy_id){
        emit(events.LOADING, busy_id);
        return promise.then(function(results){
            emit(events.SUCCESS, busy_id);
            return results;
        }, function(error){
            emit(events.ERROR, busy_id);
            return $q.reject(error);
        })
    };

    var listen = function(event, busy_id, handler, off_scope){
        var off = $rootScope.$on(event, function(event, args){
            if(args.busy_id === busy_id){
                if(angular.isFunction(handler)){
                    handler();
                }
            }
        });

        if(off_scope){
           off_scope.$on('$destroy', function(){
               off()
           })
        }else {
            return off;
        }
    };



    return {
        events: events,
        manageRequest: manageRequest,
        listen: listen
    }
});

/**
 * Makes a button to automatically disable and show a "loading" status message when triggered by an event
 *
 * CSS Depencencies: ionic framework
 *
 * Usage
 * ------------
 * HTML:
 * <button busy-button='Saving...' busy-id='buttonId' ng-click="save()">Save Changes</button>
 *
 */
LWBusy.directive('busyButton', function (BusyManager) {
    return {
        scope: {
            busyButton: "@", //String
            busyId: '=' //Variable that's bound to a string
        },
        link: function (scope, elem, attr) {
            var defaultText = elem.html();
            var btnHtml = '<i class="icon ion-loading-c"></i> ' + scope.busyButton;
            var showLoading = function(){
                attr.$set('disabled', true);
                elem.html(btnHtml)
            };
            var resetButton = function(){
                attr.$set('disabled', false);
                elem.html(defaultText);
            };

            BusyManager.listen(BusyManager.events.LOADING, scope.busyId, showLoading, scope);
            BusyManager.listen(BusyManager.events.SUCCESS, scope.busyId, resetButton, scope);
            BusyManager.listen(BusyManager.events.ERROR, scope.busyId, resetButton, scope);
        }
    };
});
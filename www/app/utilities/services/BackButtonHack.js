BallotApp.factory("BackButtonHack", function(){
    var controls = {
        showBack: false,
        backFunction: angular.noop
    };

    var reset = function(){
        controls.showBack = false;
        controls.backFunction = angular.noop;
    };

    return {
        showBack: function(){
            controls.showBack = true;
        },
        hideBack: function(){
            controls.showBack = false;
        },
        registerBackFunction: function(func){
            controls.backFunction = func;
        },
        reset: reset,
        resetOnScopeDestroy: function(scope){
            scope.$on('$destroy', reset)
        },
        controls: controls
    }
});
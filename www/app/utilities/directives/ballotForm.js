BallotApp.directive('bMaxlength', function(){

    return {
        scope: {
            ngModel: "=",
            bMaxlength: "="
        },
        link: function(scope, elem, attrs){
            scope.max = parseInt(scope.bMaxlength, 10) || 0;
            if(scope.max){
                scope.$watch('ngModel', function(newVal){
                    scope.ngModel = newVal.slice(0,scope.max)
                })
            }
        }
    }
});

BallotApp.directive('noCarriageReturn', function(){
    return {
        link: function(scope, elem, attrs){
            elem.on('keydown', function(e){
                if(e.which == 13) {
                    e.preventDefault();
                }
            })
        }
    }
});


//Goes on an element that wraps the element you are trying to prevent the ghost click
BallotApp.directive('preventGhostClick', function($timeout){
    var class_name = 'prevent-ghost-click';
    return {
        link: function(scope, elem, attrs){
            elem.addClass(class_name);
            $timeout(function(){
                elem.removeClass(class_name)
            }, 350)
        }
    }
})
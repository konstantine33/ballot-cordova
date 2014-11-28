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
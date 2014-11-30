BallotApp.factory('BallotPresenter', function($ionicActionSheet){
    return {
        confirmClose: function(closeCallback){
            var self = this;
            var hideSheet = $ionicActionSheet.show({
                titleText: "Are you sure you want to close this ballot?",
                cancelText: "Cancel",
                destructiveText: "Close Ballot",
                destructiveButtonClicked: function(){
                    var promise = self.close();
                    if(angular.isFunction(closeCallback)){
                        closeCallback(promise)
                    }
                    return true;
                }
            })
        },
        confirmDelete: function(deleteCallback){
            var self = this;
            var hideSheet = $ionicActionSheet.show({
                titleText: "Are you sure you want to delete this ballot?",
                cancelText: "Cancel",
                destructiveText: "Delete Ballot",
                destructiveButtonClicked: function(){
                    var promise = self.destroy();
                    if(angular.isFunction(deleteCallback)){
                        deleteCallback(promise)
                    }
                    return true;
                }
            })
        },
        noPercent: function(){
            if(!this.get('response_count')){
                return 0;
            }
            return this.get('no_count') / this.get('response_count') * 100
        },
        yesPercent: function(){
            if(!this.get('response_count')){
                return 0;
            }
            return this.get('yes_count') / this.get('response_count') * 100
        }
    }
});
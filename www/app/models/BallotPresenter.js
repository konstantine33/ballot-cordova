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
        getAnswerTitle: function(value){
            return this.get('answers')[value].title
        },
        getAnswerCount: function(value){
            return this.get('answers')[value].votes
        },
        getAnswerPercent: function(value, round){
            if(!this.get('answer_count')){
                return 0;
            }
            var perc = this.getAnswerCount(value) / this.get('answer_count') * 100;
            return round ? Math.round(perc) : perc;
        }
    }
});
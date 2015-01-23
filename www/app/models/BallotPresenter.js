BallotApp.factory('BallotPresenter', function($ionicActionSheet){
    return {
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
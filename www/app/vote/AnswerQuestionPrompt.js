BallotApp.factory('AnswerQuestionPrompt', function($ionicPopup){
    var showPopup = function(){
        return $ionicPopup.alert({
            title: '<div class="text-xlarge">Have a poll question?<br><br>Post it by tapping <i class="text-royal icon ion-plus-circled text-xxlarge"></i></div>',
            okType: "button-royal"
        })
    };


    return {
        show: showPopup
    }
});
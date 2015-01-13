BallotApp.factory('Account', function (SERVER_URL, Request) {
    function Account(){
    }
    Account.url = SERVER_URL + "/accounts";

    Account.checkIfViewedIntro = function(){
        return Request.get(Account.url + "/viewed-intro")
            .then(function(response){
                return response.data.viewedIntro;
            })
    };

    Account.hasViewedIntro = function(){
        return Request.post(Account.url + "/viewed-intro")
    };

    return Account
});
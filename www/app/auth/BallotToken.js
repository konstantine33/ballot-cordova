BallotApp.factory('BallotToken', function($window){
    function getToken(){
        return $window.localStorage.ballot_token
    }

    function storeToken(token){
        $window.localStorage.ballot_token = token;
    }

    function deleteToken(){
        delete $window.localStorage.ballot_token;
    }

    return {
        get: getToken,
        store: storeToken,
        del: deleteToken
    }
})
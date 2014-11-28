BallotApp.factory('BallotToken', function($window){
    function getToken(){
        return $window.sessionStorage.ballot_token
    }

    function storeToken(token){
        $window.sessionStorage.ballot_token = token;
    }

    function deleteToken(){
        delete $window.sessionStorage.ballot_token;
    }

    return {
        get: getToken,
        store: storeToken,
        del: deleteToken
    }
})
BallotApp.factory('BallotToken', function($window){
    function getToken(){
        return $window.localStorage.tally_token
    }

    function storeToken(token){
        $window.localStorage.tally_token = token;
    }

    function deleteToken(){
        delete $window.localStorage.tally_token;
    }

    return {
        get: getToken,
        store: storeToken,
        del: deleteToken
    }
})
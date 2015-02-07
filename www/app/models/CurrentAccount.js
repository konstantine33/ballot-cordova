/**
 * Note: Cached statistics should not be replied upon for accuracy because this model is not synced with server
 */

BallotApp.factory('CurrentAccount', function (SERVER_URL, Request) {
    var url =  SERVER_URL + "/current-account";
    var currentAccount = new CurrentAccount();

    function CurrentAccount(){
        this.url = url;
        this.data = {};
    }

    //This needs to be called manually in applicationController after authentication is done.
    CurrentAccount.prototype.init = function(){
        var self = this;

        return Request.get(self.url)
            .then(function(response){
                self.data = response.data || {};
                return self
            })
    };

    CurrentAccount.prototype.get = function (key) {
        return this.data[key]
    };

    CurrentAccount.prototype.update = function(newData){
        var self = this;
        return Request.post(self.url, newData)
            .then(function(){
                angular.extend(self.data, newData)
            })
    };

    CurrentAccount.prototype.completedIntroRequirements = function(){
        return this.update({viewedIntro: true, agreedToTerms: true})
    };

    CurrentAccount.prototype.updateUsername = function(username){
        return this.update({username: username})
    };

    CurrentAccount.prototype.shouldDisplayAddQuestionPrompt = function(){
        return !this.get('viewedAddQuestionPrompt')
    };
    CurrentAccount.prototype.hasViewedAddQuestionPrompt = function(){
        return this.update({viewedAddQuestionPrompt: true})
    };

    return currentAccount
});
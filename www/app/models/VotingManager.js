BallotApp.factory('VotingManager', function($q){
    function VotingManager(){
        this.pending = {};
    }

    VotingManager.prototype.setPending = function(ballot_id){
        this.pending[ballot_id] = true;
    };

    VotingManager.prototype.removePending = function(ballot_id){
        delete this.pending[ballot_id];
    };

    VotingManager.prototype.getPending = function(){
        var self = this;
        return Object.keys(self.pending);
    };

    VotingManager.prototype.wrapPromise = function(promise, ballot_id){
        var self = this;
        this.setPending(ballot_id);
        return promise.then(function(data){
            self.removePending(ballot_id);
            return data;
        }, function(error){
            self.removePending(ballot_id);
            return $q.reject(error)
        })
    };

    var manager = new VotingManager();

    return manager;
});
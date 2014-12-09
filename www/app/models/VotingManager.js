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

    VotingManager.prototype.removeAllPending = function(){
        this.pending = {};
    };

    var manager = new VotingManager();

    return manager;
});
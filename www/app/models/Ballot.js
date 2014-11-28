BallotApp.factory('Ballot', function(SERVER_URL, $http, $q, APIQuery){
   function Ballot(data){
       this.data = data || {};
       this.url = Ballot.url + "/" + this.data._id;
   }

    Ballot.prototype.get = function(key){
        return this.data[key]
    };

    Ballot.prototype.close = function(){
        return $http.post(this.url, {closed: true}).then(function(response){return response.data})
    };

    Ballot.prototype.destroy = function(){
        if(this.get('closed')){
            return $q.reject('You cannot delete a closed ballot.')
        }
        return $http.delete(this.url).then(function(response){return response.data})

    };

    Ballot.prototype.respond = function(value){
        if(this.get('closed')){
            return $q.reject('You cannot respond to a closed ballot.')
        }

        return $http.post(this.url + "/respond", {response: value}).then(function(response){return response.data})
    };

    /////////////////////////////////////
    //STATIC METHODS
    /////////////////////////////////////

    Ballot.url = SERVER_URL + "/ballot";

    ///////////QUERY METHODS - Responds with a QUERY object that must be executed manually

    //Responds with a QUERY object that you have to execute
    Ballot.queryOwn = function(config){
        return APIQuery.init(Ballot, config, Ballot.url)
    };

    Ballot.queryResponded = function(config){
        return APIQuery.init(Ballot, config, Ballot.url + "/responded")
    };

    //////////Additional static methods

    //Responds with a promise that resolves to the model
    Ballot.findById = function(id){
        return Ballot.queryOwn({
            query_type: "findOne",
            params: {
                _id: id
            }
        }).next()
    };

    Ballot.recommend = function(){
        return $http.get(Ballot.url + "/rec").then(function(response){return new Ballot(response.data)})
    };

    Ballot.create = function(data){
        data = data || {};
        var ballot_data = {};
        if(!data.question){
            return $q.reject('Must include question')
        }
        ballot_data.question = data.question;
        ballot_data.end_time = data.end_time;

        return $http.post(Ballot.url, ballot_data).then(function(response){
            if(response.data){
                return new Ballot(response.data)}
            }
        )
    };

    Ballot.responseType = {
        YES: "YES",
        NO: "NO",
        SKIP: "SKIP",
        FLAG: "FLAG"
    };

    return Ballot
});
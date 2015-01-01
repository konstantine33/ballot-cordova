BallotApp.factory('Ballot', function (SERVER_URL, Request, $q, APIQuery, BallotPresenter, VotingManager) {
    function Ballot(data) {
        this.data = data || {};
        this.url = Ballot.url + "/" + this.data._id;
    }

    Ballot.prototype.get = function (key) {
        return this.data[key]
    };

    Ballot.prototype.getId = function () {
        return this.data._id
    };

    //Ballot.prototype.close = function () {
    //    this.data.closed = true;
    //    this.data.closed_on = new Date();
    //    return Request.post(this.url + "/close").then(function (response) {
    //        return response.data
    //    })
    //};

    Ballot.prototype.destroy = function () {
        if (this.get('closed')) {
            return $q.reject('You cannot delete a closed ballot.')
        }
        return Request.delete(this.url).then(function (response) {
            return response.data
        })

    };

    Ballot.prototype.cacheVote = function(value){
        var answer = this.get('answers')[value];
        if(!answer){
            throw Error('Answer value doesn\'t exist')
        }

        answer.votes ++;
        this.data.answer_count ++;
    };

    Ballot.prototype.respond = function (value) {
        var self = this;
        //Cache in response value
        switch (value) {
            case Ballot.responseType.SKIP:
                this.data.skip_count++;
                break;
            case Ballot.responseType.FLAG:
                this.data.flag_count++;
                break;
            default:
                try {
                    self.cacheVote(value);
                }catch(e){
                    return $q.reject('Invalid response type')
                }
        }

        var promise = Request.post(this.url + "/respond", {response: value});

        return promise.then(function (response) {
            return response.data
        })
    };

    Ballot.prototype.refresh = function () {
        var self = this;
        return Request.get(this.url).then(function (response) {
            self.data = response.data;
        })
    };

    angular.extend(Ballot.prototype, BallotPresenter);

    /////////////////////////////////////
    //STATIC METHODS
    /////////////////////////////////////

    Ballot.url = SERVER_URL + "/ballot";

    ///////////QUERY METHODS - Responds with a QUERY object that must be executed manually

    //Responds with a QUERY object that you have to execute
    Ballot.queryOwn = function (config) {
        return APIQuery.init(Ballot, config, Ballot.url)
    };

    Ballot.queryResponded = function (config) {
        return APIQuery.init(Ballot, config, Ballot.url + "/responded")
    };

    //////////Additional static methods

    //Responds with a promise that resolves to the model
    Ballot.findById = function (id) {
        return Request.get(Ballot.url + "/" + id).then(function (result) {
            return new Ballot(result.data)
        })
    };

    Ballot.recommend = function (count) {
        return Request.get(Ballot.url + "/rec", {
            params: {
                limit: count,
                exclude: JSON.stringify(VotingManager.getPending())
            }
        })
            .then(function (response) {
                return response.data.map(function (ballot) {
                    return new Ballot(ballot);
                });
            })
    };

    Ballot.create = function (question, left_answer, right_answer) {
        if (!question) {
            return $q.reject('Must include question')
        }

        var ballot_data = {};
        ballot_data.question = question;
        ballot_data.left_answer = left_answer;
        ballot_data.right_answer = right_answer;


        return Request.post(Ballot.url, ballot_data).then(function (response) {
                if (response.data) {
                    return new Ballot(response.data)
                }
            }
        )
    };

    Ballot.responseType = {
        LEFT_RESPONSE: 0,
        RIGHT_RESPONSE: 1,
        SKIP: "SKIP",
        FLAG: "FLAG"
    };

    Ballot.defaultAnswers = {
        LEFT_RESPONSE: "No",
        RIGHT_RESPONSE: "Yes"
    };

    return Ballot
});
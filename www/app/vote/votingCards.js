BallotApp.directive('votingCards', function ($compile, $rootScope, Ballot, $window, VotingManager, $interval, CurrentAccount, AnswerQuestionPrompt) {
    var voting_card_template = '<li voting-card class="vote-card"></li>';
    var results_card_template = '<li results-card class="vote-card"></li>';

    function RecurringEmitter() {
        this.off = null;
        this.emitting = false;
    }

    RecurringEmitter.prototype.emit = function(eventName){
        if(!this.emitting){
            this.emitting = true;
            this.off = $interval(function(){
                $rootScope.$emit(eventName)
            }, 5000)
        }
    };

    RecurringEmitter.prototype.stop = function(){
        $interval.cancel(this.off);
        this.off = null;
        this.emitting = false;
    };

    return {
        scope: {
            newBallotsEvent: "=", //string indicating what the new ballot event is named
            getBallotsEvent: "="
        },
        templateUrl: 'app/vote/cardStack.html',
        replace: true,
        restrict: "AE",
        link: function (scope, elem, attr) {
            scope.loaded = false;
            scope.ballots = [];
            scope.current_card = null;
            scope.responseType = Ballot.responseType;
            scope.respondedInSession = 0;

            var recurring_emitter = new RecurringEmitter();
            var list_parent = elem.find('ul');
            var stack = $window.gajus.Swing.Stack({
                isThrowOut: function (offset, element, confidence) {
                    return confidence > 0.3
                },
                throwOutDistance: function () {
                    return $window.innerWidth * 1.5;
                }
            });
            stack.on('throwoutleft', function (e) {
                scope.current_card.action(scope.responseType.LEFT_RESPONSE);
            });

            stack.on('throwoutright', function (e) {
                scope.current_card.action(scope.responseType.RIGHT_RESPONSE);
            });

            //Receives new data
            var off = $rootScope.$on(scope.newBallotsEvent, function (event, args) {
                args.ballots.forEach(function (b) {
                    if (b) {
                        scope.ballots.push(b);
                        VotingManager.setPending(b.getId())
                    }
                });

                scope.loaded = true;

                //sets a new card if there isnt a current card and there are available cards to set
                if(!scope.current_card && scope.ballots.length){
                    setNewVotingCard()
                }

                //if there isn't a current card and there are no new cards, then start trying to retrieve cards
                else if (!scope.current_card && !scope.ballots.length){
                    recurring_emitter.emit(scope.getBallotsEvent);
                }

                //Make sure the event emitter has stopped
                else {
                    recurring_emitter.stop();
                }

            });

            scope.$on('$destroy', function () {
                VotingManager.removeAllPending();
                recurring_emitter.stop();
                off();
            });

            //////////////// Voting Card Behavior

            function VotingCard(ballot, card_template, stack, actionFnc) {
                var self = this;
                this.ballot = ballot;
                this.action = function () {
                    actionFnc.apply(self, arguments)
                };

                var newScope = scope.$new();
                newScope.ballot = ballot;
                newScope.action = function (response) {
                    self.action(response);
                };

                this.scope = newScope;
                this.elem = $compile(card_template)(newScope);
                this.card = stack.createCard(this.elem[0]);
            }

            VotingCard.prototype.attach = function (parent) {
                parent.append(this.elem)
            };
            VotingCard.prototype.destroy = function () {
                this.card.destroy();
                this.elem.remove();
                this.scope.$destroy(); // For some reason elem.remove() is not destroying the scope.. So we will destroy it manually otherwise there'll be a memory leak
            };

            function setNewVotingCard() {
                if (scope.current_card) {
                    scope.current_card.destroy();
                    scope.current_card = null;
                }

                var actionFnc = function (response) {
                    var self = this;
                    this.ballot.respond(response).finally(function(){
                        VotingManager.removePending(self.ballot.getId());
                    });

                    ////////// Display add question prompt if its has not been displayed before & respondedInSession === 4
                    // I am making this === and not > in case server hasn't responded by next time a question is responded to
                    scope.respondedInSession ++;
                    if(scope.respondedInSession === 4 && CurrentAccount.shouldDisplayAddQuestionPrompt()){
                        AnswerQuestionPrompt.show();
                        CurrentAccount.hasViewedAddQuestionPrompt()
                    }
                    ///////////


                    if(response === Ballot.responseType.SKIP || response === Ballot.responseType.FLAG){
                        setNewVotingCard();
                    }else {
                        setNewResultsCard();
                    }
                };

                if (scope.ballots.length) {
                    scope.current_card = new VotingCard(scope.ballots.shift(), voting_card_template, stack, actionFnc);
                    scope.current_card.attach(list_parent);
                }

                //load more ballots if there are less than 2 ballots in the cache
                if(scope.ballots.length < 2){
                    $rootScope.$emit(scope.getBallotsEvent)
                }

                //Speeds up the digest cycle.
                if(!scope.$$phase && !scope.$root.$$phase){
                    scope.$apply();
                }

            }

            function setNewResultsCard() {
                var actionFnc = function () {
                    setNewVotingCard();
                };

                scope.current_card.destroy();
                scope.current_card = new VotingCard(scope.current_card.ballot, results_card_template, stack, actionFnc);
                scope.current_card.attach(list_parent);
            }
        }
    }
});

BallotApp.directive('votingCard', function () {
    return {
        templateUrl: 'app/vote/voteCard.html',
        link: function (scope, elem, attr) {

        }
    }
});

BallotApp.directive('resultsCard', function () {
    return {
        templateUrl: 'app/vote/resultsCard.html',
        link: function (scope, elem, attr) {

        }
    }
});
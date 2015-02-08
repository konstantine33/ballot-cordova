BallotApp.directive('votingCards', function ($compile, $rootScope, Ballot, $window, VotingManager, $interval, CurrentAccount, AnswerQuestionPrompt) {
    var voting_card_template = '<li voting-card class="vote-card"></li>';
    var results_card_template = '<li results-card class="vote-card"></li>';

    function RecurringEmitter() {
        this.off = null;
        this.emitting = false;
    }

    RecurringEmitter.prototype.emit = function (eventName) {
        if (!this.emitting) {
            this.emitting = true;
            this.off = $interval(function () {
                $rootScope.$emit(eventName)
            }, 5000)
        }
    };

    RecurringEmitter.prototype.stop = function () {
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
                if (!scope.current_card && scope.ballots.length) {
                    setNewVotingCard()
                }

                //if there isn't a current card and there are no new cards, then start trying to retrieve cards
                else if (!scope.current_card && !scope.ballots.length) {
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

            var makeCard = function (ballot, card_template) {
                var newScope = scope.$new();
                newScope.ballot = ballot;
                return $compile(card_template)(newScope);
            };

            scope.$on('nextCard', function(event, args){
                console.log("RECEIVED")

                event.stopPropagation()
                ////////// Display add question prompt if its has not been displayed before & respondedInSession === 4
                // I am making this === and not > in case server hasn't responded by next time a question is responded to
                scope.respondedInSession++;
                if (scope.respondedInSession === 4 && CurrentAccount.shouldDisplayAddQuestionPrompt()) {
                    AnswerQuestionPrompt.show();
                    CurrentAccount.hasViewedAddQuestionPrompt()
                }

                if (args.card === "ballotCard") {
                    setNewVotingCard();
                } else {
                    setNewResultsCard();
                }
            });

            function setNewVotingCard() {
                if (scope.current_card) {
                    scope.current_card.scope().$destroy();
                    scope.current_card.remove();
                    delete scope.current_ballot;
                }

                if (scope.ballots.length) {
                    scope.current_ballot = scope.ballots.shift();
                    scope.current_card = makeCard(scope.current_ballot, voting_card_template);
                    list_parent.append(scope.current_card);
                }

                //load more ballots if there are less than 2 ballots in the cache
                if (scope.ballots.length < 2) {
                    $rootScope.$emit(scope.getBallotsEvent)
                }

            }

            function setNewResultsCard() {
                scope.current_card.remove();
                scope.current_card = makeCard(scope.current_ballot, results_card_template);
                list_parent.append(scope.current_card);
            }
        }
    }
});

BallotApp.directive('votingCard', function (VotingManager, Ballot) {
    return {
        templateUrl: 'app/vote/voteCard.html',
        link: function (scope, elem, attr) {
            scope.action = function (response) {
                scope.ballot.respond(response).finally(function () {
                    VotingManager.removePending(scope.ballot.getId());
                });

                var nextCard = response === Ballot.responseType.SKIP || response === Ballot.responseType.FLAG ? "ballotCard" : "resultsCard"

                scope.$broadcast("nextCard", {card: nextCard})
            }
        }
    }
});

BallotApp.directive('resultsCard', function () {
    return {
        templateUrl: 'app/vote/resultsCard.html',
        link: function (scope, elem, attr) {

            scope.action = function () {
                scope.$broadcast("nextCard", {card: "ballotCard"})
            }
        }
    }
});
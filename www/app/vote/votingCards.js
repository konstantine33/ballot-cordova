BallotApp.directive('votingCards', function ($compile, $rootScope, Ballot, $window, VotingManager, $interval, CurrentAccount, AnswerQuestionPrompt) {
    var voting_card_template = '<li voting-card class="vote-card" ng-if="!!ballot && currentView === \'voting\'"></li>';
    var results_card_template = '<li results-card class="vote-card" ng-if="!!ballot && currentView === \'results\'"></li>';

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
            scope.ballots = [];
            scope.ballot = null;
            scope.currentView = "loading";
            scope.responseType = Ballot.responseType;
            scope.respondedInSession = 0;

            var recurring_emitter = new RecurringEmitter();
            var list_parent = elem.find('ul');

            var votingCardScope = scope.$new();
            var votingCard = $compile(voting_card_template)(votingCardScope);

            var resultsCardScope = scope.$new();
            var resultsCard = $compile(results_card_template)(resultsCardScope);

            list_parent.append(votingCard);
            list_parent.append(resultsCard);

            //Receives new data
            var off = $rootScope.$on(scope.newBallotsEvent, function (event, args) {
                args.ballots.forEach(function (b) {
                    if (b) {
                        scope.ballots.push(b);
                        VotingManager.setPending(b.getId())
                    }
                });

                //sets a new card if there isnt a current card and there are available cards to set
                if (!scope.ballot && scope.ballots.length) {
                    setNewVotingCard()
                }

                //if there isn't a current card and there are no new cards, then start trying to retrieve cards
                else if (!scope.ballot && !scope.ballots.length) {
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

            scope.$on('nextCard', function(event, args){
                event.stopPropagation();
                ////////// Display add question prompt if its has not been displayed before & respondedInSession === 4
                // I am making this === and not > in case server hasn't responded by next time a question is responded to
                scope.respondedInSession++;
                if (scope.respondedInSession === 4 && CurrentAccount.shouldDisplayAddQuestionPrompt()) {
                    AnswerQuestionPrompt.show();
                    CurrentAccount.hasViewedAddQuestionPrompt()
                }

                if (args.nextView === "voting") {
                    setNewVotingCard();
                } else {
                    setNewResultsCard();
                }
            });

            function setNewVotingCard() {
                scope.currentView = "voting";
                if (scope.ballots.length) {
                    scope.ballot = scope.ballots.shift();
                }else {
                    scope.ballot = null;
                }

                //load more ballots if there are less than 2 ballots in the cache
                if (scope.ballots.length < 2) {
                    $rootScope.$emit(scope.getBallotsEvent)
                }

            }

            function setNewResultsCard() {
                scope.currentView = "results";
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

                var nextView = response === Ballot.responseType.SKIP || response === Ballot.responseType.FLAG ? "voting" : "results";

                scope.$emit("nextCard", {nextView: nextView})
            }
        }
    }
});

BallotApp.directive('resultsCard', function () {
    return {
        templateUrl: 'app/vote/resultsCard.html',
        link: function (scope, elem, attr) {

            scope.action = function () {
                scope.$emit("nextCard", {nextView: "voting"})
            }
        }
    }
});
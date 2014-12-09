BallotApp.directive('votingCards', function ($compile, $rootScope, $templateCache, Ballot, $window, VotingManager) {
    var voting_card_template = "<li voting-card></li>";
    var results_card_template = "<li results-card></li>";


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
            var list_parent = elem.find('ul');
            var stack = $window.gajus.Swing.Stack({
                isThrowOut: function (offset, element, confidence) {
                    return confidence > 0.45
                },
                throwOutDistance: function () {
                    return $window.innerWidth * 1.5;
                }
            });
            stack.on('throwoutleft', function (e) {
                scope.current_card.action(scope.responseType.NO);
            });

            stack.on('throwoutright', function (e) {
                scope.current_card.action(scope.responseType.YES);
            });

            //Receives new data
            var off = $rootScope.$on(scope.newBallotsEvent, function (event, args) {
                args.ballots.forEach(function (b) {
                    if (b) {
                        scope.ballots.push(b);
                        VotingManager.setPending(b.getId())
                    }
                });

                //Runs only first time
                if (!scope.loaded) {
                    scope.loaded = true;
                    setNewVotingCard()
                }
            });

            scope.$on('$destroy', function () {
                VotingManager.removeAllPending()
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
                    this.ballot.respond(response);
                    VotingManager.removePending(this.ballot.getId());
                    setNewResultsCard();
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
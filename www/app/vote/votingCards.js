BallotApp.directive('votingCards', function ($compile, $rootScope, $templateCache, Ballot, $window) {
    var card_template = "<li voting-card ballot='ballot'></li>";

    return {
        scope: {
            newBallotsEvent: "=" //string indicating what the new ballot event is named
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
                scope.current_card.respond(scope.responseType.NO);
            });

            stack.on('throwoutright', function (e) {
                scope.current_card.respond(scope.responseType.YES);
            });

            var newCard = function(){
                if(scope.current_card){
                    scope.current_card.destroy();
                    scope.current_card = null;
                }

                if(scope.ballots.length){
                    scope.current_card = new VotingCard(scope.ballots.shift());
                    scope.current_card.attach(list_parent);
                }
            };

            function VotingCard (ballot){
                this.ballot = ballot;
                var newScope = scope.$new();
                newScope.ballot = ballot;
                newScope.respond = function(response){
                    console.log('responded to ' + ballot.get('question') + ' with ' + response);
                    newCard()
                    scope.$apply()
                };

                this.respond = newScope.respond;

                this.elem = $compile(card_template)(newScope);
                this.card = stack.createCard(this.elem[0]);
            }
            VotingCard.prototype.attach = function(parent){
                parent.append(this.elem)
            };
            VotingCard.prototype.destroy = function(){
                this.card.destroy();
                this.elem.remove();
            };




            //Receives new data
            var off = $rootScope.$on(scope.newBallotsEvent, function (event, args) {
                args.ballots.forEach(function (b) {
                    if (b) {
                        scope.ballots.push(b);
                    }
                });

                //Runs only first time
                if (!scope.loaded) {
                    scope.loaded = true;
                    newCard()
                }
            });

            scope.$on('$destroy', function () {
                off();
            });


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
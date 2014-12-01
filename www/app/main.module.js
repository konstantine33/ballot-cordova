var BallotApp = angular.module('starter', ['ionic', 'angularMoment'])
.constant('SERVER_URL', 'http://ballot-server.herokuapp.com')
    //.constant('SERVER_URL', 'http://localhost:3000')
    .constant('$ionicLoadingConfig', {template: '<i class="icon ion-loading-c"></i> Loading...'})
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $window, BallotToken) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    var token = BallotToken.get();

                    if(token){
                        config.headers.Authorization = 'Bearer ' + token;
                    }

                    return config;
                },
                response: function (response) {
                    return response || $q.when(response);
                }
            };
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                controller: 'authController'
            })
            .state('vote', {
                url: "/vote",
                templateUrl: 'app/vote/vote.html',
                controller: 'voteController'
            })
            .state('create_ballot', {
                url: "/create-ballot",
                templateUrl: "app/create-ballot/create-ballot.html",
                controller: 'createBallotController'
            })
            .state('my_ballots', {
                url: "/my-ballots",
                templateUrl: "app/my-ballots/my-ballots.html",
                controller: "myBallotsController"
            })
            .state('results', {
                url: "/results",
                templateUrl: 'app/results/results.html',
                controller: "resultsController"
            })
            .state('ballot', {
                url: "/ballot/:ballot_id?owns",
                templateUrl: "app/ballot-view/ballot-view.html",
                controller: "ballotViewController",
                resolve: {
                    ballot: function(Ballot, $stateParams){
                        return Ballot.findById($stateParams.ballot_id)
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/auth');

    });


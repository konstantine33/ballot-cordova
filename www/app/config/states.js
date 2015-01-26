BallotApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
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
        .state('groups', {
            url: "/groups",
            templateUrl: "app/groups/groups.html"
        })
        .state('settings', {
            url: "/settings",
            templateUrl: "app/settings/settings.html",
            controller: "settingsController"
        })
        .state('rules', {
            url: "/rules",
            templateUrl: "app/rules/view-rules.html"
        })
        .state('terms', {
            url: "/terms",
            templateUrl: "app/rules/view-terms.html"
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/vote');

});


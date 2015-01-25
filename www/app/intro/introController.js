BallotApp.controller('introController', function ($scope, CurrentAccount, $state, $rootScope) {

    $scope.pages = {
        INTRO: "INTRO",
        HELP: "HELP",
        TERMS: "TERMS"
    };

    function setInitialPage(accountData) {

        //This is for users who are just reviewing the help page again
        if (accountData.viewedIntro && accountData.agreedToTerms) {
            return $scope.pages.INTRO;
        }

        //For new users who have not viewed the intro
        if (!accountData.viewedIntro) {
            return $scope.pages.INTRO;
        }

        //For users who have viewed the intro but have not agreed to most recent terms
        if (!accountData.agreedToTerms) {
            return $scope.pages.TERMS;
        }
    }

    $scope.currentPage = setInitialPage(CurrentAccount.data);

    function finishIntro() {

        //If either of the intro requirements are false, then make sure they are set to true
        if(!CurrentAccount.get('viewedIntro') || !CurrentAccount.get('agreedToTerms')){
            CurrentAccount.completedIntroRequirements();
        }

        $rootScope.$emit('finishedIntro');
    }

    $scope.next = function () {

        switch ($scope.currentPage) {
            case $scope.pages.INTRO:
                return $scope.currentPage = $scope.pages.HELP;
            case $scope.pages.HELP:
                if (CurrentAccount.get('agreedToTerms')) {
                    return finishIntro()
                }
                return $scope.currentPage = $scope.pages.TERMS;

            case $scope.pages.TERMS:
                return finishIntro();
        }
    };


});
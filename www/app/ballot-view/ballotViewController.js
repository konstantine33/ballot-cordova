BallotApp.controller('ballotViewController', function ($scope, ballot, $ionicNavBarDelegate, $stateParams) {
    $scope.ballot = ballot;
    $scope.owns = !!$stateParams.owns;

    $scope.back = function () {
        $ionicNavBarDelegate.back()
    };
    $scope.afterDelete = function (promise) {
        promise.then(function () {
            $scope.back()
        })
    };

    if($scope.ballot.get('response_count')){
        var indexFormatter = function(percent, count){
            return percent + "%  (" + count + ")";
        };

        $scope.dps = [{
            label: "No",
            color: "#ef473a",
            y: $scope.ballot.noPercent(),
            indexLabel: indexFormatter($scope.ballot.noPercent(), $scope.ballot.get('no_count'))
        }, {
            label: "Yes",
            color: "#33cd5f",
            y: $scope.ballot.yesPercent(),
            indexLabel: indexFormatter($scope.ballot.yesPercent(), $scope.ballot.get('yes_count'))
        }];


        var chart = new CanvasJS.Chart("chart",
            {
                interactivityEnabled: false,
                axisY: {
                    minimum: 0,
                    maximum: 110,
                    interval: 20,
                    gridThickness: 0,
                    tickThickness: 0,
                    lineThickness: 0,
                    labelFontColor: "transparent"

                },

                data: [
                    {
                        type: "column",
                        indexLabelPlacement: "outside",
                        indexLabelOrientation: "horizontal",
                        indexLabelFontColor: "black",
                        indexLabelFontSize: "16",
                        dataPoints: $scope.dps
                    }
                ]
            });

        chart.render();
    }
});
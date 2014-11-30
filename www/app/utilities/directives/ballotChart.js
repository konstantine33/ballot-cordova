BallotApp.directive('ballotChart', function ($window, $compile, $interval) {
    var incrementer = 0;

    //Handles updating and keep track of data points for the chart object.
    function ChartDataPoints() {
        this.data = [{
            label: "No",
            color: "#ef473a"
        }, {
            label: "Yes",
            color: "#33cd5f"
        }]
    }

    ChartDataPoints.prototype.updateData = function (ballot) {
        var indexFormatter = function (percent, count) {
            return percent + "%  (" + count + ")";
        };

        this.data[0].y = ballot.noPercent();
        this.data[0].indexLabel = indexFormatter(ballot.noPercent(true), ballot.get('no_count'));

        this.data[1].y = ballot.yesPercent();
        this.data[1].indexLabel = indexFormatter(ballot.yesPercent(true), ballot.get('yes_count'));
    };

    return {
        restrict: "AE",
        scope: {
            ballot: "="
        },
        link: function (scope, elem, attrs) {
            var id = "ballotChart" + incrementer;
            incrementer++;

            //Adds the required elements
            var chart_elem = '<div style="height: 400px" ng-show="ballot.get(\'response_count\')" id="' + id + '"></div>';
            var no_responses = '<div class="card-content-center-parent" ng-hide="ballot.get(\'response_count\')"><div class="content-center-child"><h3 class="text-muted">There are no responses to this ballot.</h3></div></div>'
            elem.append($compile(no_responses)(scope));
            elem.append($compile(chart_elem)(scope));

            var chart;
            var dps = new ChartDataPoints();
            dps.updateData(scope.ballot);

            //If the ballot is not closed, then we initialize a refresher to pull semi real time data
            if(!scope.ballot.get('closed')){
                var updateChart = function () {
                    scope.ballot.refresh()
                        .then(function (new_ballot) {
                            scope.ballot = new_ballot;
                            dps.updateData(scope.ballot);

                            //Only render if the chart has been created - ie after there are responses
                            if(chart){
                                chart.render();
                            }
                        })
                };

                var canceller = $interval(updateChart, 3000);

                scope.$on('$destroy', function(){
                    $interval.cancel(canceller);
                })
            }

            //If there are no responses, don't bother generating the chart
            var off = scope.$watch('ballot.data.response_count', function (newVal) {
                if (newVal) {
                    off();

                    chart = new $window.CanvasJS.Chart(id,
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
                                    dataPoints: dps.data
                                }
                            ]
                        });
                    chart.render();
                }
            });
        }
    }
});
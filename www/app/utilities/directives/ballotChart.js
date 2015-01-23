BallotApp.directive('ballotChart', function ($window, $compile, $interval, Ballot) {
    var incrementer = 0;
    var RESPONSE = {
        LEFT: Ballot.responseType.LEFT_RESPONSE,
        RIGHT: Ballot.responseType.RIGHT_RESPONSE
    };

    //Handles updating and keep track of data points for the chart object.
    function ChartDataPoints() {
        this.data = [{
            color: "#C6471C"
        }, {
            color: "#117B70"
        }]
    }

    ChartDataPoints.prototype.updateData = function (ballot) {
        var indexFormatter = function (percent, count) {
            return percent + "%  (" + count + ")";
        };

        this.data[0].y = ballot.getAnswerPercent(RESPONSE.LEFT);
        this.data[0].indexLabel = indexFormatter(ballot.getAnswerPercent(RESPONSE.LEFT, true), ballot.getAnswerCount(RESPONSE.LEFT));
        this.data[0].label = ballot.getAnswerTitle(RESPONSE.LEFT);

        this.data[1].y = ballot.getAnswerPercent(RESPONSE.RIGHT);
        this.data[1].indexLabel = indexFormatter(ballot.getAnswerPercent(RESPONSE.RIGHT, true), ballot.getAnswerCount(RESPONSE.RIGHT));
        this.data[1].label = ballot.getAnswerTitle(RESPONSE.RIGHT);
    };

    return {
        restrict: "AE",
        scope: {
            ballot: "=",
            height: "@"
        },
        link: function (scope, elem, attrs) {
            var id = "ballotChart" + incrementer;
            incrementer++;

            //You can input the height or it takes the parent element's height less 20px;
            var height = parseInt(scope.height, 10) || elem.parent()[0].offsetHeight - 20;

            //Adds the required elements, neg left margin is to account for removing vertical axis
            var chart_elem = '<div ng-show="ballot.get(\'answer_count\')" id="' + id + '" style="padding-top: 5px; height:' + height + 'px;"></div>';
            var no_responses = '<div ng-hide="ballot.get(\'answer_count\')"><h4 class="text-center padding-top">{{ballot.get("question")}}</h4><div style="height:' + (height - 150) +'px" class="vertical-center-parent"><h3 class="text-muted vertical-center text-center">There are no responses to this ballot.</h3></div></div>';
            elem.append($compile(no_responses)(scope));
            elem.append($compile(chart_elem)(scope));

            var chart;
            var dps = new ChartDataPoints();
            dps.updateData(scope.ballot);


            var updateChart = function () {
                scope.ballot.refresh()
                    .then(function () {
                        dps.updateData(scope.ballot);

                        //Only render if the chart has been created - ie after there are responses
                        if (chart) {
                            chart.render();
                        }
                    })
            };

            var canceller = $interval(updateChart, 3000);

            scope.$on('$destroy', function () {
                $interval.cancel(canceller);
            });


            //If there are no responses, don't bother generating the chart
            var off = scope.$watch('ballot.data.answer_count', function (newVal) {
                if (newVal) {
                    off();

                    chart = new $window.CanvasJS.Chart(id,
                        {
                            title: {
                                text: scope.ballot.get('question'),
                                fontSize: 18,
                                fontFamily: "Helvetica",
                                margin: 15,
                                fontWeight: "normal"
                            },
                            interactivityEnabled: false,
                            axisY: {
                                minimum: 0,
                                gridThickness: 0,
                                tickThickness: 0,
                                lineThickness: 0,
                                labelFontColor: "transparent",
                                margin: 2,
                                labelMaxWidth: 0,
                                labelFontSize: 1,
                                tickLength: 1



                            },
                            axisX: {
                                tickThickness: 0,
                                labelFontSize: 16,
                                labelAutofit: true,
                                labelMaxWidth: 100
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
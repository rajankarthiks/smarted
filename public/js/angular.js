    angular.module('SmartApp', ['ngMaterial'])
        .directive('loading', ['$http', function($http) {
            return {
                restrict: 'A',
                link: function(scope, elm, attrs) {
                    scope.isLoading = function() {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function(v) {
                        if (v) {
                            elm.show();
                        } else {
                            elm.hide();
                        }
                    });
                }
            };
        }])
        // .controller('AppCtrl', ['$interval',
        //     function($interval) {
        //         var self = this;
        //         self.activated = true;
        //         self.determinateValue = 30;
        //         // Iterate every 100ms, non-stop and increment
        //         // the Determinate loader.
        //         $interval(function() {
        //             self.determinateValue += 1;
        //             if (self.determinateValue > 100) {
        //                 self.determinateValue = 30;
        //             }
        //         }, 100);
        //     }
        // ])
        .controller('BottomSheet', function($scope, $timeout, $mdBottomSheet, $mdToast) {
            $scope.alert = '';
            $scope.showGridBottomSheet = function() {
                $scope.alert = '';
                $mdBottomSheet.show({
                    templateUrl: '/html/bottom-sheet.html',
                    controller: 'BottomSheetCtrl',
                    clickOutsideToClose: true
                });
            };
        })
        .controller('BottomSheetCtrl', function($scope, $mdBottomSheet, $mdDialog, $http) {
            $scope.items = [{
                name: 'Linguistic Analysis',
                value: '1'
            }];

            $scope.result = {};

            $scope.showDialog = function($event) {
                $mdBottomSheet.hide();

                var data = {
                    text: $('#final_span').text()
                };
                var res = $http.post('/linguistic-analysis', data);
                res.success(function(data) {
                    $scope.result = data;
                    $mdDialog.show({
                        locals: {
                            data: {
                                text: $('#final_span').text(),
                                result: $scope.result
                            }
                        },
                        controller: LinguisticDialogController,
                        templateUrl: '/html/linguistic-dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: true
                    });

                });
                res.error(function(data, status, headers, config) {
                    console.log("failure message: " + JSON.stringify({
                        data: data
                    }));
                });

            };
        }).controller('LinguisticDialogController', LinguisticDialogController);

    function LinguisticDialogController($scope, $mdDialog, data) {
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.text = data.text;
        $scope.result = data.result;

    }

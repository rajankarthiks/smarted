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
        .controller('AboutController', function($scope,$mdDialog) {

            $scope.showAbout = function($event) {

                $mdDialog.show({
                    controller: function($scope,$mdDialog) {
                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                    },
                    templateUrl: '/html/about-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    fullscreen: true
                });

            };
        })
        .controller('AppCtrl', ['$interval',
            function($interval) {
                var self = this;
                self.activated = true;
                self.determinateValue = 30;
                // Iterate every 100ms, non-stop and increment
                // the Determinate loader.
                $interval(function() {
                    self.determinateValue += 1;
                    if (self.determinateValue > 100) {
                        self.determinateValue = 30;
                    }
                }, 100);
            }
        ])
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
        .controller('BottomSheetCtrl', function($scope, $mdBottomSheet, $mdDialog) {
            $scope.items = [{
                name: 'Linguistic Analysis',
                value: '1'
            }];

            $scope.result = {};

            $scope.showDialog = function($event) {
                $mdBottomSheet.hide();

                $mdDialog.show({
                    controller: LinguisticDialogController,
                    templateUrl: '/html/linguistic-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    fullscreen: true
                });

            };
        }).controller('LinguisticDialogController', LinguisticDialogController);

    function constituencyTree(tree) {

        var par = $("#constituency");

        var root = new Treenode('PARA');
        for (var i = 0, len = tree.length; i < len; ++i) {
            console.log(tree[i]);
            var pt = parseCnfTree(tree[i]);
            root.children.push(pt);
        }
        var can = $("<canvas>")[0];
        par.append(can);
        var ctx = can.getContext("2d");
        drawConstituentTree(can, ctx, root);
    }

    function seperateSentances(sentences) {
      var toplist = $("<ol>");
      for (var i = 0, len = sentences.length; i < len; ++i) {
          var sentence = sentences[i];
          var list = $("<li>");
          for (var j = 0, len2 = sentence.words.length; j < len2; ++j) {
              list.append(sentence.words[j].normalized_word + ' ');
          }
          toplist.append(list);
      }
      $('#sentence-list').append(toplist.html());
    }

    function LinguisticDialogController($scope, $mdDialog, $http) {
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        var text = $('#final_span').text() || "What did you say?!? I didn't hear about the director's 'new proposal.' It's important to Mr. and Mrs. Smith.";
        var data = {
            text: text
        };

        $scope.text = text;

        var res = $http.post('/linguistic-analysis', data);
        res.success(function(data) {
            $scope.result = data;
            $scope.part_of_speech = $scope.result.part_of_speech;
            $scope.constituency = $scope.result.constituency_tree;
            seperateSentances($scope.result.sentences);
            constituencyTree($scope.result.constituency_tree);
        });
        res.error(function(data, status, headers, config) {
            $scope.result = "failure message: " + JSON.stringify({
                data: data
            });
        });

    }

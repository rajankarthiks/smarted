<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-animate.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-aria.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-messages.min.js"></script>

<script src="http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.js"></script>

<script type="text/javascript">
    angular.module('bottomSheetDemo1', ['ngMaterial'])
        .controller('BottomSheetExample', function($scope, $timeout, $mdBottomSheet, $mdToast) {
            $scope.alert = '';
            $scope.showGridBottomSheet = function() {
                $scope.alert = '';
                $mdBottomSheet.show({
                    templateUrl: '/html/bottom-sheet.html',
                    controller: 'GridBottomSheetCtrl',
                    clickOutsideToClose: true
                }).then(function(clickedItem) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(clickedItem['name'] + ' clicked!')
                        .position('top right')
                        .hideDelay(1500)
                    );
                });
            };
        })
        .controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
            $scope.items = [{
                name: 'Linguistic Analysis',
                icon: 'highlight'
            }, {
                name: 'Facebook',
                icon: 'facebook'
            }, {
                name: 'Twitter',
                icon: 'twitter'
            }, ];
            $scope.listItemClick = function($index) {
                var clickedItem = $scope.items[$index];
                $mdBottomSheet.hide(clickedItem);
            };
        });

    angular.module('SmartApp', ['ngMaterial', 'bottomSheetDemo1']);
</script>

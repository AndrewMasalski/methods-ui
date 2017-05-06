angular.module('Methods')
    .controller('userController', function($scope, close, action, user) {
        $scope.user = user;
        $scope.action = action;
        if ($scope.action === 'Delete') {
            $scope.readOnly = true;
        }
        $scope.close = function(result) {
            close(result, 333);
        };
    });
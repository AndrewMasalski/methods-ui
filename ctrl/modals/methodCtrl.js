angular.module('Methods')
    .controller('methodController', function($scope, close, action, method, groups, tags) {
        $scope.tags = tags;
        $scope.groups = groups;
        $scope.method = method || {};
        $scope.action = action;
        if ($scope.action === 'Delete') {
            $scope.readOnly = true;
        }
        $scope.close = function(result) {
            close(result, 333);
        };
    });
angular.module('Methods')
    .controller('profileCtrl', function($scope, $http, $state, auth, api) {
//        console.log($state.params.username);
        $scope.user = auth.getUser();

        $scope.save = function() {
            api.users.save($scope.user)
                .then(function() {
                    auth.update($scope.user);
                });
        }
    });
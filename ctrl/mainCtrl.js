angular.module('Methods')
    .controller('mainCtrl', function($scope, $rootScope, $http, $state, block, auth) {
        $scope.user = auth.getUser();

        $scope.userInfo = function() {
            if ($scope.user.firstname && $scope.user.lastname) {
                return $scope.user.firstname + ' ' + $scope.user.lastname;
            }
            if ($scope.user.lastname) {
                return $scope.user.lastname;
            }
            return $scope.user.username;
        };

        $scope.login = function() {
            block.toggle();
            $scope.error = undefined;
            auth.signin($scope.user)
                .then(function() {
                    console.log('auth success');
                    $state.go('search');
                    block.toggle();
                })
                .catch(function(err) {
                    $scope.error = err.message || err.data.message;
                    block.toggle();
                });
        };

        $scope.isLoggedIn = function() {
            return auth.authenticated();
        };

        $scope.logout = function() {
            auth.signout();
            $state.go('auth');
        };

        $scope.isAllowed = function() {
            return $scope.user.isAdmin === true;
        }
    });
angular.module('Methods')
    .controller('mainCtrl', function($scope, $rootScope, $http, $state, block, auth) {
        $scope.creds = {};

        $scope.userInfo = function() {
            let user = auth.getUser();
            if (user.firstname && user.lastname) {
                return user.firstname + ' ' + user.lastname;
            }
            if (user.lastname) {
                return user.lastname;
            }
            return user.username;
        };

        $scope.login = function() {
            block.toggle();
            $scope.error = undefined;
            auth.signin($scope.creds)
                .then(function() {
                    console.log('auth success');
                    $state.go('search');
                    block.toggle();
                })
                .catch(function(err) {
                    console.log('auth error');
                    $scope.error = err;
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
            return auth.getUser().isAdmin === true;
        }
    });
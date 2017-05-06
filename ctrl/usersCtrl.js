angular.module('Methods')
    .controller('usersCtrl', function($scope, ModalService, auth, api, block) {
        function load() {
            block.toggle();
            api.users.many()
                .then(function(users) {
                    $scope.users = users.results;
                    block.toggle();
                })
                .catch(onError);
        }

        function ask(action, data, cb) {
            let modalOptions = {
                templateUrl: 'partials/modals/user.html',
                controller: "userController",
                inputs: {
                    action: action,
                    user: data
                }
            };
            ModalService.showModal(modalOptions)
                .then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if (result) {
                            cb(result).catch(onError)
                        }
                    });
                })
        }

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }

        $scope.create = function() {
            $scope.error = undefined;
            ask('Создать', undefined, api.users.add);
        };

        $scope.edit = function(user) {
            $scope.error = undefined;
            let clone = angular.copy(user);
            ask('Редактировать', clone, api.users.save);
        };

        $scope.delete = function(user) {
            $scope.error = undefined;
            ask('Удалить', user, api.users.delete);
        };

        load();
    });
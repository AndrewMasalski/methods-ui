angular.module('Methods')
    .controller('methodsCtrl', function($scope, $state, $stateParams, ModalService, api, $q, block) {
        $scope.methods = [];
        $scope.groups = [];
        $scope.tags = [];
        $scope.newMethod = {};
        $scope.next = undefined;
        $scope.busy = true;

        block.toggle();
        $q.all([api.groups.many({top: 25}), api.tags.many(), api.methods.many()])
            .then(function(res) {
                $scope.groups = res[0].results || [];
                $scope.tags = res[1].results || [];

                $scope.next = res[2].$next;
                $scope.methods = res[2].results;
                $scope.resultsInfo = 'Найдено ' + $scope.methods.length + ' из ' + res.$count;
                block.toggle();
                $scope.busy = false;
            })
            .catch(onError);

        $scope.nextPage = function() {
            if ($scope.next === undefined) return;

            $scope.busy = true;
            api.methods.next($scope.next)
                .then(function(res) {
                    angular.forEach(res.results, function(method) {
                        $scope.methods.push(method);
                    });
                    $scope.resultsInfo = 'Показано ' + $scope.methods.length + ' из ' + res.$count;
                    $scope.next = res.$next;
                    $scope.busy = false;
                })
                .catch(function(err) {
                    $scope.next = undefined;
                    $scope.error = err;
                })
        };

        $scope.create = function() {
            $scope.error = undefined;
            ask('Создать', undefined, api.methods.add);
        };

        $scope.edit = function(method) {
            $scope.error = undefined;
            let clone = angular.copy(method);
            ask('Редактировать', clone, api.methods.save);
        };

        $scope.delete = function(method) {
            $scope.error = undefined;
            ask('Удалить', method, api.methods.delete);
        };

        function ask(action, data, cb) {
            let modalOptions = {
                templateUrl: 'partials/methodDetails.html',
                controller: "methodDetailsController",
                inputs: {
                    action: action,
                    method: data,
                    groups: $scope.groups,
                    tags: $scope.tags
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

    });
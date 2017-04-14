angular.module('Methods')
    .controller('dashboardCtrl', function($scope, $state, $stateParams, ModalService, api, $q, block) {
        $scope.filterState = {
            group: $stateParams.group || '---',
            tags: $stateParams.tag ? [$stateParams.tag] : []
        };

        $scope.methods = [];
        $scope.groups = [];
        $scope.tags = [];
        $scope.newMethod = {};
        $scope.next = undefined;
        $scope.busy = true;

        block.toggle();
        $q.all([api.groups.many(), api.tags.many()])
            .then(function(res) {
                $scope.groups = res[0].results || [];
                $scope.tags = res[1].results || [];
                let tagFromParam = _.find($scope.tags, {_id: $stateParams.tag});
                if (tagFromParam) {
                    $scope.filterState.tags = [tagFromParam];
                }
                block.toggle();
                $scope.busy = false;
            })
            .then(function() {
                $scope.filter();
            })
            .catch(onError);

        $scope.filter = function() {
            $scope.error = undefined;
            $scope.next = undefined;
            block.toggle();
            api.methods.many(getSearchParams())
                .then(function(res) {
                    $scope.next = res.$next;
                    $scope.methods = res.results;
                    $scope.resultsInfo = 'Показано ' + $scope.methods.length + ' из ' + res.$count;
                    block.toggle();

                    var el = document.getElementById('results');
                    el.focus();
                    var currentDocument = el.ownerDocument;
                    var currentWindow = currentDocument.defaultView || currentDocument.parentWindow; // parentWindow is for IE8-
                    var currentScrollTop = currentWindow.pageYOffset || currentDocument.documentElement.scrollTop || currentDocument.body.scrollTop || 0;
                    var scrollToY = el.getBoundingClientRect().top + currentScrollTop;
                    currentWindow.scrollTo(0, scrollToY);
                })
                .catch(function(err) {
                    $scope.next = undefined;
                    $scope.error = err;
                    block.toggle();
                })
        };

        $scope.nextPage = function() {
            if ($scope.next === undefined) return;

            $scope.busy = true;
            let query = _.assign(getSearchParams(), $scope.next);
            api.methods.next(query)
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

        $scope.addTagFilter = function($event, tag) {
            $event.preventDefault();
            $scope.filterState.tags.push(tag);
        };

        function getSearchParams() {
            let searchParams = _.clone($scope.filterState);
            searchParams.tags = _.map($scope.filterState.tags, '_id').join(';');
            if (searchParams.group === '---') {
                searchParams.group = undefined;
            }
            if (searchParams.tags.length === 0) {
                searchParams.tags = undefined;
            }
            if (searchParams.type === '') {
                searchParams.type = undefined;
            }
            if (searchParams.year === '') {
                searchParams.year = undefined;
            }
            if (searchParams.description === '') {
                searchParams.description = undefined;
            }
            return searchParams;
        }

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
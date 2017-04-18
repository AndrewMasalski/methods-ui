angular.module('Methods')
    .controller('searchCtrl', function($scope, $state, $stateParams, $sce, ModalService, api, $q, block) {
        $scope.filterState = {
            group: $stateParams.group || '---',
            tags: $stateParams.tag ? [$stateParams.tag] : []
        };

        $scope.searchTerms = undefined;
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
            .catch(onError);

        $scope.filter = function() {
            $scope.error = undefined;
            $scope.next = undefined;
            block.toggle();
            api.methods.many(getSearchParams())
                .then(function(res) {
                    $scope.searchTerms = $scope.filterState.description;
                    $scope.next = res.$next;
                    $scope.methods = res.results;
                    $scope.resultsInfo = 'Найдено ' + $scope.methods.length + ' из ' + res.$count;
                    block.toggle();
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
                    $scope.resultsInfo = 'Найдено ' + $scope.methods.length + ' из ' + res.$count;
                    $scope.next = res.$next;
                    $scope.busy = false;
                })
                .catch(function(err) {
                    $scope.next = undefined;
                    $scope.error = err;
                })
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

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }

    });
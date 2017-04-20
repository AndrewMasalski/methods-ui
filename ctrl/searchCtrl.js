angular.module('Methods')
    .controller('searchCtrl', function($scope, $state, $stateParams, $sce, ModalService, api, $q, block) {
        $scope.searchParams = {
            highlight: true,
            query: $stateParams.query
        };

        $scope.searchTerms = undefined;
        $scope.methods = [];
        $scope.groups = [];
        $scope.tags = [];
        $scope.next = undefined;

        block.toggle();
        $q.all([api.groups.many(), api.tags.many()])
            .then(function(res) {
                $scope.groups = res[0].results || [];
                $scope.tags = res[1].results || [];
                block.toggle();
            })
            .then(function() {
                if ($scope.searchParams.query) {
                    return $scope.search();
                }
            })
            .catch(onError);

        $scope.search = function() {
            $scope.error = undefined;
            $scope.next = undefined;
            block.toggle();
            $state.go('search', $scope.searchParams, {notify: false});
            return api.search($scope.searchParams)
                .then(function(res) {
                    $scope.searchTerms = $scope.searchParams.query;
                    $scope.next = res.$next;
                    $scope.methods = res.results;
                    $scope.resultsInfo = 'Найдено ' + $scope.methods.length + ' результат(а|ов)';
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

            let query = _.assign($scope.searchParams, $scope.next);
            $state.go('search', query, {notify: false});
            api.methods.next(query)
                .then(function(res) {
                    angular.forEach(res.results, function(method) {
                        $scope.methods.push(method);
                    });
                    $scope.resultsInfo = 'Найдено ' + $scope.methods.length + ' результат(а|ов)';
                    $scope.next = res.$next;
                })
                .catch(function(err) {
                    $scope.next = undefined;
                    $scope.error = err;
                })
        };

        $scope.addTagFilter = function($event, tag) {
            $event.preventDefault();
//            $scope.searchParams.tags.push(tag);
        };

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }

    });
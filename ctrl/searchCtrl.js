angular.module('Methods')
    .controller('searchCtrl', function($scope, $state, $stateParams, $sce, ModalService, api, $q, block) {
        $scope.searchTerms = undefined;
        $scope.methods = [];
        $scope.groups = [];
        $scope.tags = [];
        $scope.pageSize = 10;
        $scope.totalCount = 0;
        $scope.page = $stateParams.page || 1;
        $scope.searchParams = {
            highlight: true,
            pageSize: $scope.pageSize,
            query: $stateParams.query
        };

        block.toggle();
        $q.all([api.groups.many(), api.tags.many()])
            .then(function(res) {
                $scope.groups = res[0].results || [];
                $scope.tags = res[1].results || [];
                block.toggle();
            })
            .catch(onError);

        $scope.search = function() {
            $scope.error = undefined;
            block.toggle();
            $state.go('search', $scope.searchParams, {notify: false});
            return api.search($scope.searchParams)
                .then(function(res) {
                    $scope.searchTerms = $scope.searchParams.query;
                    $scope.totalCount = res.$count;
                    $scope.methods = res.results;
                    $scope.resultsInfo = 'Найдено ' + res.$count + ' результат(а|ов)';
                    block.toggle();
                })
                .catch(function(err) {
                    $scope.error = err;
                    block.toggle();
                })
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.page);
            $scope.searchParams.page = $scope.page;
            $scope.search();
        };

        $scope.addTagFilter = function($event, tag) {
            $event.preventDefault();
//            $scope.searchParams.tags.push(tag);
        };

        if (!!$scope.searchParams.query) {
            $scope.search();
        }

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }

    });
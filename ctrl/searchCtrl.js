angular.module('Methods')
    .controller('searchCtrl', function($scope, $state, $stateParams, $sce, ModalService, auth, api, block) {
        $scope.pageSize = auth.getUser().pageSize;
        $scope.postFilters = {groups: [], tags: []};
        $scope.results = [];
        $scope.searchParams = {
            highlight: true,
            pageSize: $scope.pageSize,
            query: $stateParams.query,
            filters: {groups: [], tags: []}
        };

        if ($stateParams.groups) {
            $scope.searchParams.filters.groups = $stateParams.groups.split(',');
        }
        if ($stateParams.tags) {
            $scope.searchParams.filters.tags = $stateParams.tags.split(',');
        }

        $scope.search = function(page) {
            $scope.error = undefined;
            $scope.searchParams.page = page || 1;
            block.toggle();
            let routeParams = {
                query: $scope.searchParams.query,
                page: page,
                groups: $scope.searchParams.filters.groups.join(','),
                tags: $scope.searchParams.filters.tags.join(',')
            };
            $state.go('search', routeParams, {notify: false});
            return api.search($scope.searchParams)
                .then(function(res) {
                    $scope.page = $scope.searchParams.page;
                    $scope.totalCount = res.$count;
                    $scope.postFilters = res.filters;
                    $scope.results = res.results;
                    block.toggle();
                })
                .catch(onError)
        };

        if (!!$scope.searchParams.query) {
            $scope.search($stateParams.page);
        }

        $scope.onFiltersApply = function(filters) {
            $scope.searchParams.filters = filters;
            $scope.search();
        };

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }

    });
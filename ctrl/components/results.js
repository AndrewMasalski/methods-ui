angular.module('Methods')
    .component('resultsPanel', {
        templateUrl: 'partials/panels/results.html',
        controller: function() {
            let ctrl = this;

            ctrl.addTagFilter = function($event, tag) {
                $event.preventDefault();
//            $scope.searchParams.tags.push(tag);
            };

        },
        bindings: {
            page: '<',
            methods: '<',
            pageSize: '<',
            totalCount: '<',
            onPageChanged: '&'
        }
    });
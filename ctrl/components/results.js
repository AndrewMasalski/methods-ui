angular.module('Methods')
    .component('resultsPanel', {
        templateUrl: 'partials/panels/results.html',
        controller: function() {
            let ctrl = this;

            ctrl.onTagClick = function($event, tag) {
                $event.preventDefault();
                ctrl.onTagClicked({tag: tag});
            };

        },
        bindings: {
            page: '<',
            methods: '<',
            pageSize: '<',
            totalCount: '<',
            onPageChanged: '&',
            onTagClicked: '&'
        }
    });
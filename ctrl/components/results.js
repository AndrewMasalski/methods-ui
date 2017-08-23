angular.module('Methods')
    .component('resultsPanel', {
        templateUrl: 'partials/panels/results.html',
        controller: function() {
            let ctrl = this;

            ctrl.onTagClick = function($event, tag) {
                $event.preventDefault();
                ctrl.onTagClicked({tag: tag});
            };

            ctrl.onExportClick = function($event) {
                $event.preventDefault();
                ctrl.onExport();
            };

        },
        bindings: {
            page: '<',
            methods: '<',
            pageSize: '<',
            totalCount: '<',
            onPageChanged: '&',
            onTagClicked: '&',
            onExport: '&',
            onApply: '&'
        }
    });
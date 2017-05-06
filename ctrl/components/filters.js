angular.module('Methods')
    .component('filtersPanel', {
        templateUrl: 'partials/panels/filters.html',
        controller: function() {
            let ctrl = this;
            ctrl.applyFilter = function() {
                let groups = _.filter(ctrl.filters.groups, gr => { return gr.checked === true});
                let tags = _.filter(ctrl.filters.tags, t => { return t.checked === true});
                let filterState = {
                    groups: _.map(groups, '_id'),
                    tags: _.map(tags, '_id')
                };
                ctrl.onApply({filters: filterState});
            }
        },
        bindings: {
            filters: '=',
            onApply: '&'
        }
    });
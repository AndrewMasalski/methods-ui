angular.module('Methods')
    .controller('tagsCtrl', function($scope, $state, api, block) {
        $scope.tags = [];
        $scope.new = '';

        block.toggle();
        api.tags.many()
            .then(function(tags) {
                $scope.tags = tags.results;
                block.toggle();
            })
            .catch(onError);


        $scope.add = function() {
            api.groups.add($scope.new)
                .then(function(res) {
                    $scope.new = '';
                    $scope.tags.push(res);
                })
        };

        $scope.save = function(tag, value) {
            if (tag.text === value) return true;

            const clone = _.clone(tag);
            clone.text = value;
            api.tags.save(clone);
        };

        $scope.delete = function(tag) {
            api.tags.delete(tag)
                .then(function() {
                    _.remove($scope.tag, {_id: tag._id})
                })
        };

        $scope.colorChanged = function(tag) {
            api.tags.save(tag);
/*
            if (tag.color === event.value) return true;

            const clone = _.clone(tag);
            clone.color = event.value;
*/
        };

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }
    });
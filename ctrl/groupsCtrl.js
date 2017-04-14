angular.module('Methods')
    .controller('groupsCtrl', function($scope, api, block) {
        $scope.new = '';
        $scope.groups = [];

        block.toggle();
        api.groups.many()
            .then(function(groups) {
                $scope.groups = groups.results;
                block.toggle();
            })
            .catch(onError);

        $scope.add = function() {
            api.groups.add($scope.new)
                .then(function(res) {
                    $scope.new = '';
                    $scope.groups.push(res);
                })
        };

        $scope.save = function(group, value) {
            if (group.name === value) return true;

            const clone = _.clone(group);
            clone.name = value;
            return api.groups.save(clone);
        };

        $scope.delete = function(group) {
            api.groups.delete(group)
                .then(function() {
                    _.remove($scope.groups, {_id: group._id})
                })
        };

        function onError(err) {
            $scope.error = err;
            block.toggle();
        }
    });
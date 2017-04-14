angular.module('Methods')
    .service('block', function(blockUI) {
        let block = blockUI.instances.get('blocker');
        let isBlocking = false;
        this.toggle = function() {
            if (isBlocking) {
                block.stop();
            } else {
                block.start();
            }
            isBlocking = !isBlocking;
        };
        return this;
    });
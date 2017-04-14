angular.module('Methods')
    .service('auth', function($http, $cookies, api) {
        const cookieName = 'methods-token';
        this.user = undefined;
        this.getUser = function() {
            if (this.user === undefined) {
                try {
                    this.user = JSON.parse($cookies.get(cookieName));
                } catch (e) {
                    this.user = {};
                }
            }
            return this.user;
        };

        this.signin = function(user) {
            let self = this;
            let credentials = {username: user.username, password: user.password};
            return api.login(credentials)
                .then(function(res) {
                    $cookies.put(cookieName, JSON.stringify(res));
                    self.user = res;
                });
        };

        this.signout = function() {
            delete $cookies.remove(cookieName);
        };

        this.authenticated = function() {
            return !!this.getUser().session;
        };

        this.update = function(user) {
            $cookies.put(cookieName, JSON.stringify(user));
            this.user = user;
        };

        return this;
    });
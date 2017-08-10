angular.module('Methods')
    .service('auth', function($http, $cookies, $base64, api) {
        const cookieName = 'methods-token';
        this.user = undefined;
        this.getUser = function() {
            if (this.user === undefined) {
                try {
                    this.user = JSON.parse($cookies.get(cookieName));
                    let encoded = $base64.encode(this.user.username + ":" + this.user.password);
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + encoded;
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
            console.log('sign out');
            this.user = undefined;
            delete $cookies.remove(cookieName);
        };

        this.authenticated = function() {
            return !!this.user && !!this.user.session;
        };

        this.update = function(user) {
            this.user = user;
            $cookies.put(cookieName, JSON.stringify(user));
        };

        return this;
    });
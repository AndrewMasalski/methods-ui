angular.module('Methods')
    .constant('host', 'http://localhost:30003/')
    .factory('EntitySet', function($http, host, $q) {
        return function(name, domain) {
            domain = domain || 'api';
            const server = host + domain + '/';

            function onError(err) {
                return $q.reject(err.data.message);
            }

            return {
                many: function(params) {
                    return $http.get(server + name, {params: params})
                        .then(function(response) {
                            return response.data;
                        })
                        .catch(onError);
                },
                next: function(params) {
                    return $http.get(server + name, {params: params})
                        .then(function(response) {
                            return response.data;
                        })
                        .catch(onError);
                },
                add: function(method) {
                    return $http.post(server + name, method)
                        .then(function(response) {
                            return response.data;
                        })
                        .catch(onError);
                },
                save: function(method) {
                    return $http.put(server + name + '/' + method._id, method)
                        .then(function(response) {
                            return response.data;
                        })
                        .catch(onError);
                },
                delete: function(method) {
                    return $http.delete(server + name + '/' + method._id)
                        .then(function(response) {
                            return response.data;
                        })
                        .catch(onError);
                }
            }
        }
    })
    .service('api', function($http, $q, host, EntitySet) {
        let api = this;
        this.users = new EntitySet('users', 'auth');
        this.methods = new EntitySet('methods');
        this.tags = new EntitySet('tags');
        this.groups = new EntitySet('groups');
        function onError(err) { return err.data.message; }

        this.loadAll = function(params) {
            return $q.all([api.methods.many(params), api.groups.many(), api.tags.many()])
                .then(function(res) {
                    return {
                        methods: res[0].results || [],
                        next: res[0].$next,
                        count: res[0].$count,
                        groups: res[1].results || [],
                        tags: res[2].results || []
                    }
                })
        };

        this.login = function(user) {
            return $http.post(host + 'auth/login', user)
                .then(function(response) {
                    return response.data;
                })
                .catch(onError);
        };

        return this;
    });
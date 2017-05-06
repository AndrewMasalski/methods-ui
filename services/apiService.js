angular.module('Methods')
    .factory('onError', function($q) {
        return function(err) {
            let hasErrorMessage = !!err.data && !!err.data.message;
            return $q.reject(hasErrorMessage ? err.data.message : 'Ошибка получения данных с сервера');
        }
    })
    .factory('EntitySet', function($http, host, onError) {
        return function(name, domain) {
            domain = domain || 'api';
            const server = host + domain + '/';

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
    .service('api', function($http, $q, $base64, host, EntitySet, onError) {
        let api = this;
        this.users = new EntitySet('users', 'urm');
        this.methods = new EntitySet('methods');
        this.tags = new EntitySet('tags');
        this.groups = new EntitySet('groups');

        this.login = function(user) {
            let encoded = $base64.encode(user.username + ":" + user.password);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + encoded;
            console.log($http.defaults.headers.common['Authorization']);
            return $http.post(host + 'auth/login', user)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(err) {
                    delete $http.defaults.headers.common['Authorization'];
                    return onError(err);
                });
        };

        this.search = function(params) {
            return $http.post(host + 'api/search', params)
                .then(function(response) {
                    return response.data;
                })
                .catch(onError);
        };

        return this;
    });
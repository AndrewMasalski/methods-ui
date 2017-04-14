let ngmodules = [
    'ui.router',
    'ngCookies',
    'angularModalService',
    'ngSanitize',
    'ngAnimate',
    'xeditable',
    'ngTagsInput',
    'blockUI',
    'infinite-scroll'
];
angular.module('Methods', ngmodules)
    .config(function($stateProvider, $urlRouterProvider, blockUIConfig) {
        $urlRouterProvider.otherwise("/dashboard");

        console.log('app.config');

        blockUIConfig.message = 'загрузка...';
        blockUIConfig.delay = 200;

        $stateProvider
            .state('auth', {
                url: "/auth",
                templateUrl: "partials/auth.html",
                data: {requireLogin: false},
                controller: 'mainCtrl'
            })
            .state('dashboard', {
                url: "/dashboard?group&tag",
                params: {
                    group: null,
                    tag: null
                },
                templateUrl: "partials/dashboard.html",
                data: {requireLogin: true},
                controller: 'dashboardCtrl'
            })
            .state('users', {
                url: "/users/:username",
                templateUrl: "partials/users.html",
                data: {requireLogin: true},
                controller: 'usersCtrl'
            })
            .state('groups', {
                url: "/groups",
                templateUrl: "partials/groups.html",
                data: {requireLogin: true},
                controller: 'groupsCtrl'
            })
            .state('tags', {
                url: "/tags:id",
                templateUrl: "partials/tags.html",
                data: {requireLogin: true},
                controller: 'tagsCtrl'
            })
    })
    .run(function($rootScope, $state, auth, editableOptions, editableThemes) {
        console.log("app.run");
        editableOptions.theme = 'bs3';

        $rootScope.isAppStarted = false;

        $rootScope.$on("$stateChangeStart",
            function(event, toState, toParams, fromState, fromParams) {
                if ((toState.data || {}).requireLogin && !auth.authenticated()) {
                    event.preventDefault();
                    $state.transitionTo('auth');
                }
            });

    })
    .directive('mEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                let key = typeof event.which === "undefined" ? event.keyCode : event.which;
                if (key === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.mEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .filter('mFilter', function() {
        return function(array, state) {
            if (!(state.code || state.description || state.group || state.type || state.tags || state.year))
                return array;

            function compareStrings(source, filter) {
                return ((source || '').toLowerCase().indexOf((filter || '').toLowerCase()) >= 0);
            }

            return array.filter(function(o) {
                let matches = [];
                let match;
                if (!!state.code) {
                    match = compareStrings(o.code, state.code);
                    matches.push(match);
                }
                if (!!state.description) {
                    match = compareStrings(o.description, state.description);
                    matches.push(match);
                }
                if (!!state.type) {
                    match = compareStrings(o.type, state.type);
                    matches.push(match);
                }
                if (!!state.year) {
                    match = compareStrings(o.year, state.year);
                    matches.push(match);
                }
                if (!!state.group) {
                    match = compareStrings(o.group._id, state.group);
                    matches.push(match);
                }
                if (state.tags.length > 0) {
                    match = _.intersectionBy((o.tags || []), state.tags, '_id').length > 0;
                    matches.push(match);
                }
                return _.every(matches, function(m) { return m });
            });
        };
    });
let ngmodules = [
    'ui.router',
    'ngCookies',
    'angularModalService',
    'ngSanitize',
    'ngAnimate',
    'xeditable',
    'ngTagsInput',
    'blockUI',
    'infinite-scroll',
    'ui.bootstrap',
    'colorpicker.module'
];
angular.module('Methods', ngmodules)
    .config(function($stateProvider, $urlRouterProvider, blockUIConfig) {
        $urlRouterProvider.otherwise("/search");

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
            .state('search', {
                url: "/search?query&page&groups&tags",
                params: {
                    query: null,
                    page: null,
                    groups: null,
                    tags: null
                },
                reloadOnSearch: false,
                templateUrl: "partials/search.html",
                data: {requireLogin: true},
                controller: 'searchCtrl'
            })
            .state('methods', {
                url: "/methods/:id",
                templateUrl: "partials/methods.html",
                data: {requireLogin: true},
                controller: 'methodsCtrl'
            })
            .state('profile', {
                url: "/profile/:username",
                templateUrl: "partials/profile.html",
                data: {requireLogin: true},
                controller: 'profileCtrl'
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
                console.log('changing route from', (fromState.name || '[none]'), 'to', toState.name);
                let requireLogin = (toState.data || {}).requireLogin;
                if (requireLogin && !auth.authenticated()) {
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
    });

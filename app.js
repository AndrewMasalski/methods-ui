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
                url: "/search?group&tag",
                params: {
                    group: null,
                    tag: null
                },
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

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.child', {
    url: '/child/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/child.html',
        controller: 'ChildCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        // controller: 'LoginCtrl'
      }
    }
  })

  .state('app.create-parent', {
      url: '/create-parent',
      views: {
        'menuContent': {
          templateUrl: 'templates/create-parent.html',
          controller: 'AppCtrl'
        }
      }
    })

  .state('app.parent', {
      url: '/parent/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/parent.html',
          controller: 'ParentCtrl'
        }
      }
    })
    // .state('app.playlists', {
    //   url: '/playlists',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/playlists.html',
    //       controller: 'PlaylistsCtrl'
    //     }
    //   }
    // })

  .state('app.start', {
    url: '/start/:childId',
    views: {
      'menuContent': {
        templateUrl: 'templates/start.html',
        controller: 'NewTripCtrl'
      }
    }
  })

  .state('app.newtrip', {
    url: '/start/:childId/:tripId',
    views: {
      'menuContent': {
        templateUrl: 'templates/newtrip.html',
        controller: 'NewTripCtrl'
      }
    }
  });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});

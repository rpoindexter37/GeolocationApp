angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.newParent = {}
  $scope.createParent = function(){
    console.log('we be creatin a parent')
    console.log($scope);
    $scope.newParent = {}
    $http({
        method: "POST",
        url: "http://localhost:3000/parent/",
        data: $scope.newParent
        //we are going to return child.parent = parent.id
    }).then(function mySuccess(response) {
        console.log(response)
        $scope.newParent = {}
    }, function myError(response) {
        console.log("error");
    })
  }

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $cordovaGeolocation, $http) {

  $scope.playlists = [
    { title: 'Reggae', id: 1 },

  ];




  // var posOptions = {timeout: 10000, enableHighAccuracy: false};
  //   $cordovaGeolocation
  //     .getCurrentPosition(posOptions)
  //     .then(function (position) {
  //       $scope.lat  = position.coords.latitude
  //       $scope.long = position.coords.longitude
  //           }, function(err) {
  //     });
  //
  //
  //
  //   var watchOptions = {
  //     timeout : 3000,
  //     enableHighAccuracy: false // may cause errors if true
  //   };
  //
  //   var watch = $cordovaGeolocation.watchPosition(watchOptions);
  //   watch.then(
  //     null,
  //     function(err) {
  //     },
  //     function(position) {
  //       $scope.lat  = position.coords.latitude
  //       $scope.long = position.coords.longitude
  //       // $scope.$apply()
  //   });

 })

.controller('PlaylistCtrl', function($scope, $cordovaGeolocation, $stateParams, $http) {

  $scope.startTrip = function(){

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $scope.lat  = position.coords.latitude
          $scope.long = position.coords.longitude
              }, function(err) {
        });

      var watchOptions = {
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watch = $cordovaGeolocation.watchPosition(watchOptions);
      watch.then(
        null,
        function(err) {
        },
        function(position) {
          $scope.lat  = position.coords.latitude
          $scope.long = position.coords.longitude
          // $scope.$apply()
      })

    console.log("start trip call!")
    $http({
        method : "POST",
        url : "http://localhost:3000/trips",
        data: { topMPH: 69 }
    }).then(function mySuccess(response) {
        console.log("success")
    }, function myError(response) {
        console.log("error");
    })
  }

})


.controller('ChildCtrl', function($scope, $cordovaGeolocation, $stateParams, $http) {

  $scope.createChild = function(){
    console.log('we be creatin a child')
    $http({
        method: "POST",
        url: ("http://localhost:3000/parent/" + $stateParams.id),
        data: ($scope.newChild)
        //we are going to return child.parent = parent.id
    }).then(function mySuccess(response) {
        console.log(response)
    }, function myError(response) {
        console.log("error");
    })
  }

})

.controller('ParentCtrl', function($scope, $http, $stateParams) {


  $http.get("http://localhost:3000/parent/" + $stateParams.id)
    .then(function(response) {
      console.log("response data" + response.data);
        $scope.currentParent = response.data
    })

    // $http.get("http://localhost:3000/child/" + $stateParams.id)
    //   .then(function(response) {
    //     console.log("response data" + response.data);
    //       $scope.currentParent = response.data
    //   })
})

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
    console.log($scope.newParent);
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

.controller('NewTripCtrl', function($scope, $cordovaGeolocation, $stateParams, $http, $state) {

  $scope.createTrip = function(){
    console.log('we be creatin a trip for this child')
    $http({
        method: "PATCH",
        url: ("http://localhost:3000/child/" + $stateParams.childId),
        data: {}
        //we are going to return child.parent = parent.id
    }).then(function mySuccess(response) {
      $state.go('app.newtrip', {childId: $stateParams.childId, tripId: response.data[response.data.length - 1]._id})
    }, function myError(response) {
        console.log("error");
    })
  }

  function getLocationAndSend() {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.lat  = position.coords.latitude
        $scope.long = position.coords.longitude

        console.log("start trip call!")
        var coordinates = {lat: $scope.lat, long: $scope.long}
        $http({
            method : "PATCH",
            url : ("http://localhost:3000/child/" + $stateParams.childId + "/" + $stateParams.tripId),
            data: coordinates
        }).then(function mySuccess(response) {
            console.log("success")
            console.log(response)
        }, function myError(response) {
            console.log("error");
          })
        }, function(err) {
      });
  }

  $scope.startTrip = function(){
    $scope.tripStarted = true
    // get location and send patch here...
    getLocationAndSend()
    $scope.tripWatcher = setInterval(getLocationAndSend, 5000)
  }

  $scope.stopTrip = function() {
    $scope.tripStarted = false
    console.log("Stopping the trip...");
    clearInterval($scope.tripWatcher)
    $state.go('app.start')
  }
      // var watchOptions = {
      //   timeout : 3000,
      //   enableHighAccuracy: false // may cause errors if true
      // };
      //
      // console.log("Setting up watcher...")
      // var watch = $cordovaGeolocation.watchPosition(watchOptions)
      // console.log("Watching 👀")
      // watch.then(
      //   null,
      //   function(err) {
      //     console.log("Eep, there was a problem :(")
      //   },
      //   function(position) {
      //     console.log("Great success!")
      //     $scope.lat  = position.coords.latitude
      //     $scope.long = position.coords.longitude
      //     // $scope.$apply()
      //     console.log("adding to the current trip")
      //     var coordinates = {lat: $scope.lat, long: $scope.long}
      //     $http({
      //         method : "PATCH",
      //         url : ("http://localhost:3000/child/" + $stateParams.childId + "/" + $stateParams.tripId),
      //         data: coordinates
      //     }).then(function mySuccess(response) {
      //         console.log("success")
      //         console.log(response)
      //     }), function myError(response) {
      //         console.log("error");
      //     }
      //
      //   })
      // }

})


.controller('ChildCtrl', function($scope, $cordovaGeolocation, $stateParams, $http, $state) {

  $http.get("http://localhost:3000/child/" + $stateParams.id)
    .then(function(response) {
      console.log(response.data);
        $scope.currentChild = response.data
    })



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

  $scope.deleteChild = function () {
    console.log("deleting kid")
    console.log($stateParams.id);
    $http({
        method: "DELETE",
        url: ("http://localhost:3000/child/" + $stateParams.id),
        //we are going to return child.parent = parent.id
    }).then(function mySuccess(response) {
    }, function myError(response) {
        console.log("error");
    })
      $state.go('app.login')
  }


  $scope.deleteTrip = function (tripId) {
    console.log("deleting trip")
    console.log($stateParams.id);
    $http({
        method: "DELETE",
        url: ("http://localhost:3000/child/" + $stateParams.id + "/" + tripId),
        //we are going to return child.parent = parent.id
    }).then(function mySuccess(response) {
    }, function myError(response) {
        console.log("error");
    })
  }

})

.controller('ParentCtrl', function($scope, $http, $stateParams) {
console.log("ParentCtrl created");
console.log($stateParams);
  $http.get("http://localhost:3000/parent/" + $stateParams.id)
    .then(function(response) {
      console.log(response.data);
        $scope.currentParent = response.data
    })


    // $http.get("http://localhost:3000/child/" + $stateParams.id)
    //   .then(function(response) {
    //     console.log("response data" + response.data);
    //       $scope.currentParent = response.data
    //   })
})

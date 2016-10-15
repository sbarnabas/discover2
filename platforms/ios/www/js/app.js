// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('d2', ['ionic', 'ui.router', 'ionic.contrib.ui.tinderCards', 
])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login')
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'templates/login.html'
        })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html'
            })
             .state('pick-friends', {
                url: '/pick-friends',
                templateUrl: 'templates/friendslist.html'
            })
            .state('swipe-location', {
                url: '/swipe-location',
                templateUrl: 'templates/swipe-location.html'
            });
    })
    .controller('MainController', function ($scope, $state) {
        $scope.who = "me";
        $scope.what = "do";
      

     

        $scope.startWorkflow = function () {
            console.log("who: " + $scope.who);
            console.log("what: " + $scope.what);
            //pick a place (zipcode/city)
            //I need to get here (flights) (display flight cards)
            //I need a place to stay (hotel) (display hotel cards)
            //I need things to do
            //if friends, show contact list, then come back
            //if travel show location select then come back
            //if travel show hotels
            //show activies
            if ($scope.who == "me" && $scope.what == "go") {
                //single person travel
                $state.go("pick-location");
                //next is swipe-hotel
                //next is pick-hotel
            } else if ($scope.who == "me" && $scope.what == "do") {
                //single person activity - 
                $state.go("swipe-location");
                //next is pick-venue
                var cardTypes = [{
                    image: 'img/pic2.png',
                    title: 'So much grass #hippster'
                }, {
                    image: 'img/pic3.png',
                    title: 'Way too much Sand, right?'
                }, {
                    image: 'img/pic4.png',
                    title: 'Beautiful sky from wherever'
                }, ];
                $scope.cards = [];
                $scope.addCard = function (i) {
                    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                    newCard.id = Math.random();
                    $scope.cards.push(angular.extend({}, newCard));
                }
                for (var i = 0; i < 3; i++) $scope.addCard();
                $scope.cardSwipedLeft = function (index) {
                    console.log('Left swipe');
                }
                $scope.cardSwipedRight = function (index) {
                    console.log('Right swipe');
                }
                $scope.cardDestroyed = function (index) {
                    $scope.cards.splice(index, 1);
                    console.log('Card removed');
                }
            } else if ($scope.who == "friends" && $scope.what == "do") {
                //friends do
                $state.go("pick-friends");
                //next is pick venue
            } else if ($scope.who == "friends" && $scope.what == "go") {
                //friends go
                $state.go("pick-friends");
            }
        }
    })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .directive('noScroll', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $element.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })
    .directive('googleplace', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
 
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

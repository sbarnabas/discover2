// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

angular.module('d2', ['ionic', 'ui.router', 'ionic.contrib.ui.tinderCards', 'ngCordova', ])
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
            .state('pick-hotel', {
                url: '/pick-hotel',
                templateUrl: 'templates/picked-hotels.html'
            })
            .state('pick-location', {
                url: '/pick-location',
                templateUrl: 'templates/picked-locations.html'
            })
            .state('pick-flight', {
                url: '/pick-flight',
                templateUrl: 'templates/picked-flights.html'
            })
            .state('swipe-location', {
                url: '/swipe-location',
                templateUrl: 'templates/swipe-location.html'
            })
            .state('swipe-hotels', {
                url: '/swipe-hotels',
                templateUrl: 'templates/swipe-hotels.html'
            })
            .state('swipe-flights', {
                url: '/swipe-flights',
                templateUrl: 'templates/swipe-flights.html'
            });
    })
    .service("ContactsService", ['$q',
        function ($q) {
            var formatContact = function (contact) {
                return {
                    "displayName": contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Mystery Person",
                    "emails": contact.emails || [],
                    "phones": contact.phoneNumbers || [],
                    "photos": contact.photos || []
                };
            };
            var pickContact = function () {
                var deferred = $q.defer();
                if (navigator && navigator.contacts) {
                    navigator.contacts.pickContact(function (contact) {
                        deferred.resolve(formatContact(contact));
                    });
                } else {
                    deferred.reject("Bummer.  No contacts in desktop browser");
                }
                return deferred.promise;
            };
            return {
                pickContact: pickContact
            };
        }
    ])
    .controller('MainController', function ($scope, $state, ContactsService, $http) {
        $scope.who = "me";
        $scope.what = "do";
        $scope.selectedContacts = [];
        $scope.savedLocations = [];
        $scope.savedFlights = [];
        $scope.savedHotels = [];
        $scope.saveCard = function () {};
        $scope.pickContact = function () {
            ContactsService.pickContact()
                .then(function (contact) {
                    $scope.selectedContacts.push(contact);
                    console.log("Selected contacts=");
                    console.log($scope.selectedContacts);
                }, function (failure) {
                    console.log("Bummer.  Failed to pick a contact");
                });
        }
        $scope.dismiss = function (item) {
            var idx = $scope.selectedContacts.indexOf(item);
            if (idx > -1) $scope.selectedContacts.splice(idx, 1);
        }
        $scope.cardSwipedLeft = function (index) {
            console.log('Left swipe');
            $scope.trashed++;
        }
        $scope.cardSwipedRight = function (index) {
            console.log('Right swipe');
            $scope.saveCard($scope.cards[index]);
            $scope.loved++;
        }
        $scope.cardDestroyed = function (index) {
            $scope.cards.splice(index, 1);
            console.log('Card removed');
        }
        $scope.$on('$ionicView.enter', function (event, toState) {
            $scope.trashed = 0;
            $scope.loved = 0;
            $scope.saveCard = function (card) {
                $scope.savedLocations.push(card);
            };
            if (toState.stateName == "swipe-hotels") {
               $scope.trashed=0;
               $scope.loved=0;
               $scope.doneSwiping = function() {
                $state.go("pick-hotel");
               }
                $scope.cards = [];
                  $scope.saveCard = function (card) {
                    var numC = Math.floor(Math.random() * $scope.selectedContacts.length);
                    card.contacts = [];
                    for (var x = 0; x < $scope.selectedContacts.length; x++) {
                        if (card.contacts.length > numC) break;
                        if (Math.random() > 0.5) {
                            card.contacts.push($scope.selectedContacts[x]);
                        }
                    }
                    $scope.savedHotels.push(card);
                   
                };

                $http.get("http://discover2gether.mybluemix.net/hotels")
                    .success(function (data, status) {
                      data=shuffle(data);
                      data.map(function(d){
                        var img = Math.floor(Math.random() * d.images.length);
                        $scope.cards.push({title:d.name, image:d.images[img]});
                      })
                        
                    })
                    .error(function (data, status) {
                        console.log("failed");
                    });;

            } else if (toState.stateName == "swipe-flights") {
                $scope.trashed = 0;
                $scope.loved = 0;
                $scope.doneSwiping = function () {
                    $state.go("pick-flight");
                }
                $scope.saveCard = function (card) {
                    var numC = Math.floor(Math.random() * $scope.selectedContacts.length);
                    card.contacts = [];
                    for (var x = 0; x < $scope.selectedContacts.length; x++) {
                        if (card.contacts.length > numC) break;
                        if (Math.random() > 0.5) {
                            card.contacts.push($scope.selectedContacts[x]);
                        }
                    }
                    $scope.savedFlights.push(card);
                };
                $http.get("http://discover2gether.mybluemix.net/flights")
                    .success(function (data, status) {
                        $scope.cards = data.slice(1, 20);
                    })
                    .error(function (data, status) {
                        console.log("failed");
                    });;
            } else if (toState.stateName == "pick-location") {
                $scope.pickedLocations = [];
                for (var x = 0; x < 10; x++) {
                    $scope.pickedLocations.push({
                        name: "Location " + x,
                        contacts: [{
                            photos: []
                        }, {
                            photos: []
                        }, {
                            photos: []
                        }]
                    });
                }
            }
            else if(toState.stateName == "pick-flight") {
              $scope.startWorkflow = function () {
                $state.go("swipe-hotels");
              }
            }
            else if (toState.stateName == "pick-hotel"){
              $scope.startWorkflow = function() {
                $state.go("swipe-location");
              }
            }
            else if(toState.stateName=="swipe-location"){
                $scope.trashed=0;
               $scope.loved=0;
               $scope.doneSwiping = function() {
                $state.go("pick-location");
               };
                 $scope.cards = [];
                  $scope.saveCard = function (card) {
                    var numC = Math.floor(Math.random() * $scope.selectedContacts.length);
                    card.contacts = [];
                    for (var x = 0; x < $scope.selectedContacts.length; x++) {
                        if (card.contacts.length > numC) break;
                        if (Math.random() > 0.5) {
                            card.contacts.push($scope.selectedContacts[x]);
                        }
                    }
                    $scope.savedLocations.push(card);
                    console.log(card);
                   
                };

                $http.get("http://discover2gether.mybluemix.net/locations")
                    .success(function (data, status) {
                      data=shuffle(data);
                      data.map(function(d){
                        var img = Math.floor(Math.random() * d.photoref.length);
                        var imgurl="https://maps.googleapis.com/maps/api/place/photo?maxheight=400&key=AIzaSyBkPGJjjzrnXatExlJUxyEbg0pPqQWLwrI&photoreference="+d.photoref[img];
                        $scope.cards.push({title:d.name, image:imgurl});
                      })
                        
                    })
                    .error(function (data, status) {
                        console.log("failed");
                    });;
            }
        });
        $scope.pickedLocations = [];
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
            $scope.goNext = function () {
                $state.go("swipe-flights");
            }
            $state.go("pick-friends");
            if ($scope.who == "me" && $scope.what == "go") {
                //single person travel
                $state.go("pick-location");
                //next is swipe-hotel
                //next is pick-hotel
            } else if ($scope.who == "me" && $scope.what == "do") {
                //single person activity - 
                $state.go("swipe-location");
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
    .directive('googleplace', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    })
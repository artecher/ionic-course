angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, SongService) {
    $scope.songs = SongService.songs;
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope) {

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope) {
  console.log('TabsCtrl ctrl initialized');
});

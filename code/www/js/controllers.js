angular.module('songhop.controllers', ['ionic', 'songhop.services'])

.controller('SplashCtrl', function($state, User){
    this.submiteForm = function(username, signingUp){
      User.auth(username, signingUp).then(function(){
        $state.go('tab.discover');
      }, function(){
        alert('Hmm... try another username.');
      })
    }
  })

.controller('DiscoverCtrl', function(SongService, $timeout, User, Recommendations, $ionicLoading) {

    var that = this;

    var showLoading = function(){
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i>',
        noBackdrop: true
      });
    }

    var hideLoading = function(){
      $ionicLoading.hide();
    }

    this.sendFeedback = function(bool) {

      if(bool) User.addSongToFavorites(this.currentSong);

      this.currentSong.hide = true;
      this.currentSong.rated = bool;

      Recommendations.nextSong();

      $timeout(function(){
        that.currentSong = Recommendations.queue[0];
      }, 250);

      Recommendations.playCurrentSong().then(function(){
        that.currentSong.loaded = true;
      });
    };

    Recommendations.init()
      .then(function(){
        that.currentSong = Recommendations.queue[0];
        return Recommendations.playCurrentSong();
      }).then(function(){
        hideLoading();
        that.currentSong.loaded = true;
      })

    this.nextAlbumImg = function(){
      if(Recommendations.queue.length > 1){
        return Recommendations.queue[1].image_large;
      }else{
        return '';
      }
    }

    this.songs = SongService.songs;
    this.currentSong = angular.copy(this.songs[0]);

    showLoading();
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($window, User) {
    this.favorites = User.favorites;

    this.removeSong = function(song, index){
      User.removeSongFromFavorites(song, index);
    };

    this.openSong = function(song){
      $window.open(song.open_url, '_system');
    }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function(Recommendations, User) {
    this.enteringFavorites = function(){
      User.newFavorites = 0;
      Recommendations.haltAudio();
    }

    this.leavingFavorites = function(){
      Recommendations.init();
    }

    this.favCount = User.favoriteCount.bind(User);
});

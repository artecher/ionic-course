angular.module('songhop.services', [])

.factory('User', function($http, SERVER, $q, $localstorage){
  return {
    username: false,
    session_id: false,
    favorites: [],
    newFavorites: 0,
    addSongToFavorites: function(song){
      if (!song) return false;
      this.favorites.unshift(song);
      this.newFavorites++;
      return $http.post(SERVER.url + '/favorites', {
        session_id: this.session_id,
        song_id: song.song_id
      });
    },
    removeSongFromFavorites: function(song, index){
      if(!song) return false;
      this.favorites.splice(index, 1);
      return $http({
        method: 'DELETE',
        url: SERVER.url + '/favorites',
        params: {
          session_id: this.session_id,
          song_id: song.song_id
        }
      })
    },
    populateFavorites: function(){
      return $http({
        method: 'GET',
        url: SERVER.url + '/favorites',
        params: {session_id: o.session_id}
      }).success(function(res){
        this.favorites = res.data;
      })
    },


    favoriteCount: function(){
      return this.newFavorites;
    },
    auth: function(username, signingUp){
      var authRoute;
      if(signingUp){
        authRoute = 'signup';
      }else{
        authRoute = 'login';
      }

      return $http.post(SERVER.url + '/' + authRoute, {username: username});
    }
  }
})

.factory('Recommendations', function($http, SERVER, $q){
    var media;
    var o = {
      queue: []
    };

    o.init = function(){
      if(o.queue.length === 0){
        return o.getNextSongs();
      }else{
        return o.playCurrentSong();
      }
    }

    o.getNextSongs = function() {
      return $http({
        method: 'GET',
        url: SERVER.url + '/recommendations'
      }).then(function(response) {
        o.queue = o.queue.concat(response.data);
      })
    }

    o.nextSong = function(){
      o.queue.shift();

      o.haltAudio();

      if(o.queue.length <= 3){
        o.getNextSongs();
      }
    }

    o.playCurrentSong = function(){
      var defer = $q.defer();
      media = new Audio(o.queue[0].preview_url);

      media.addEventListener('loadeddata', function(){
        defer.resolve();
      });

      media.play();

      return defer.promise;
    }

    o.haltAudio = function(){
      if(media) media.pause();
    }

    return o;
  })

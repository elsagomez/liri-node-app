const keys = require("./keys.js");
const fs = require("fs");

const Twitter = require("twitter");
const spotify = require("spotify");
const request = require("request");

var whatArgs = process.argv;

var action = process.argv[2];
var what = "";

for (var i = 3; i < whatArgs.length; i++) {

  if (i > 3 && i < whatArgs.length) {

    what = what + "+" + whatArgs[i];

  }

  else {

    what += whatArgs[i];

  }
}



switch (action) {
  case "my-tweets":
    logTweets();
    break;

  case "spotify-this-song":
    logSpotify();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    WhatItSays();
    break;
}

function logSpotify(){

	var songName = what;

	console.log("Song requested: ", songName);

	if (songName === "") {
   songName = 'The Sign Ace of Base';
  }

	

	spotify.search({ type: 'track', query: songName }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
  var songs = data.tracks.items;
    var spotifyData = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      spotifyData.push({
        'song name: ': songs[i].name,
        'artist: ': songs[i].artists[0].name, 
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(spotifyData);
    });
}

function logTweets() {

	var client = new Twitter(keys.twitterKeys);

	var params = {screen_name: "elsaghdz", count:10};

	client.get('statuses/user_timeline', params,function(error,tweets,response){

		if(!error) {
				var dataTweets = [];
				for (i=0; i < tweets.length; i++){
					dataTweets.push({
						"Date created: ": tweets[i].created_at,
						"Text: ": tweets[i].text
					});
				}
				console.log(dataTweets);
		}

});

};

function movieThis(){

	movieName = what;
	console.log("this is the movie requested: ", movieName);

 if (movieName === "") {
    movieName = 'Mr-Nobody';
  }

  var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieData = [];
      var jsonResponse = JSON.parse(body);

      movieData.push({
      'Movie Name: ' : jsonResponse.Title,
      'Year: ' : jsonResponse.Year,
      'IMDB Rating: ' : jsonResponse.imdbRating,
      'Country: ' : jsonResponse.Country,
      'Language: ' : jsonResponse.Language,
      'Plot: ' : jsonResponse.Plot,
      'Actors: ' : jsonResponse.Actors,
      'Rotten Tomatoes Rating: ' : jsonResponse.tomatoRating,
      'Rotten Tomatoes URL: ' : jsonResponse.tomatoURL,
  });
      console.log(movieData);
 
}
  });

}

function WhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    
    var dataArray = data.split(',');

    console.log(dataArray);

    action = dataArray[0];
    what = dataArray[1];

    if (action === "my-tweets"){
    	logTweets();
    }
    if (action === "spotify-this-song"){
    	logSpotify();
    }
    if (action === "movie-this"){
    	movieThis();
    }

});
   }
   
 





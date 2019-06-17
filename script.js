//Check console to see pages
var next = 1;
var next_page_search = 1;

var posterPaths = "http://image.tmdb.org/t/p/w500";
var url = "https://api.themoviedb.org/3/discover/movie?";
var key = "&api_key=bc50218d91157b1ba4f142ef7baaa6a0";
var movieCast = "https://api.themoviedb.org/3/movie/";


var infinity_mainscreen = '*';
var infinity_movieInfo = '*';
var infinity_search = '*';

var is_searching = false;

var date = new Date();
// fix date formats
function formatDate (input) {
  if ( input !== 'undefined' ) {

    var datePart = input.match(/\d+/g),
    year = datePart[0].substring(2), // get only two digits
    month = datePart[1], day = datePart[2];
    return day+'/'+month+'/'+year;
  } else {
    return input;
  }
}

function sortMovies(choice) {
  next=0;
  $(".movies").remove();
  showMovie("/now_playing"); 
  infinityScroll();
}

// when `enter` it starts the search
function checkSubmit(e) {
  if ( e && e.keyCode == 13 ) {
    next_page_search = 1; //initialise new search from page 1
    var searching = document.getElementById('search').value;
    search(searching);
  }
}

function search(search) { 
  
  console.log(next_page_search)
  
  $(".movies").remove();
  closeOverview(); 
  
  is_searching = true;

  infinity_mainscreen = '*';
  infinity_movieInfo = '*';
  infinity_search ='infinity_search'
  infinityScroll();

  var searchurl = "https://api.themoviedb.org/3/search/multi?api_key=bc50218d91157b1ba4f142ef7baaa6a0&query=";

  $.getJSON(searchurl + search + "&page=" + next_page_search, function(data) {

    for ( var i = 0; i < data.results.length; i++ ) {
      
      var id = data.results[i].id;
      var title = data.results[i].name;
      var rating = data.results[i].vote_average;
      var poster = posterPaths + data.results[i].poster_path;
      var yearOfRelease =  data.results[i].release_date;
      var overview = data.results[i].overview;

      //trim Overview
      var string = overview; 
      var trimmedString = string.substr(0, 100); // trim on 150 chars
      
      //re-trim if it is in the middle of a word
      trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
      
      //Overview trimmed
      var overview = trimmedString +'....';

      if (poster === "http://image.tmdb.org/t/p/w500null") {
          //if their is no poster dont show the movie
      }
      else if(overview == "null"){
        //dont show if the overview is null
      }
      else {
      $(".main").append("<div class='col-sm-3 text-center movies m" + i + "' id='" + id + "'><div class='tiles'><img onclick='closeOverview();movieInfo(" + id + ");' src=" + poster + "> <div class='basicInfo text-left'><p>"+title+" <span>"+rating+"<i class='fa fa-star' aria-hidden='true'></i></span></p><p>Year: "+yearOfRelease+"</p><p>"+overview+"</p></div> </div></div>");
      }
    }
  });
  next_page_search++;
}

function showMovie(choice) { 
  console.log(next);
  is_searching = false;
  //clear Search input
  $("#search").val("");

  infinity_mainscreen = 'infinity_mainscreen';
  infinity_movieInfo ='*'
  infinity_search ='*'
  
  next++;
  
  $.getJSON(url + choice + key + "&page=" + next, function(data) {

    for ( var i = 0; i < data.results.length; i++ ) {
      
      var id = data.results[i].id;
      var title = data.results[i].title;
      var overview = data.results[i].overview;
      var rating = data.results[i].vote_average;
      var yearOfRelease = formatDate(data.results[i].release_date);
      roundHalf(rating);

      function roundHalf(rating) {
        ratin = rating / 2;
        ratin = Math.round(ratin * 2) / 2;
      }

      //trim Overview
      var string = overview; 

      // trim on 150 chars
      var trimmedString = string.substr(0, 100); 
      
      //re-trim if it is in the middle of a word
      trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
      
      //Overview trimmed
      var overview = trimmedString +'....';

      var poster = posterPaths + data.results[i].poster_path;
      if (poster === "http://image.tmdb.org/t/p/w500null") {
          //if their is no poster dont show the movie
      }
      else if(overview == "null"){
        //dont show if the overview is null
      }
      else{
      $(".main").append("<div class='col-sm-3 text-center movies m" + i + "' id='" + id + "'><div class='tiles'><img onclick='closeOverview();movieInfo(" + id + ");' src=" + poster + "> <div class='basicInfo text-left'><p>"+title+" <span>"+rating+"<i class='fa fa-star' aria-hidden='true'></i></span></p><p>Release: "+yearOfRelease+"</p><p>"+overview+"</p></div> </div></div>");
      }
    }
  });
  
}


function movieInfo(id) {

  infinity_mainscreen = '*';
  infinity_movieInfo = 'infinity_movieInfo';
  infinity_search = '*'
  infinityScroll();

  $.getJSON( movieCast + id + "/casts?" + key, function(json) {
    
    $(".movies").hide();
    $(".more").hide();
    
    var infoURL = "https://api.themoviedb.org/3/movie/" + id + "?&api_key=bc50218d91157b1ba4f142ef7baaa6a0";
    var similarURL = "https://api.themoviedb.org/3/movie/"+ id + "/similar?&api_key=bc50218d91157b1ba4f142ef7baaa6a0";
    var reviewsURL = "https://api.themoviedb.org/3/movie/"+ id + "/reviews?&api_key=bc50218d91157b1ba4f142ef7baaa6a0";
    var videosURL = "https://api.themoviedb.org/3/movie/"+ id + "/videos?&api_key=bc50218d91157b1ba4f142ef7baaa6a0";
       
    //Movie general info
    $.getJSON(infoURL, function(data) {
      var budget = "$" + data.budget;
      if ( budget === "$0" ) {
        budget = "Budget not found";
      }
      var revenue = "$" + data.revenue;
      if ( revenue === "$0" ) {
        revenue = "Revenue not found";
      }
      var release = data.release_date;
      var runtime = data.runtime;
      var tagline = data.tagline;
      var title = data.title;
      var overview = data.overview;
      var poster = posterPaths + data.poster_path;
      if (poster === "http://image.tmdb.org/t/p/w1000null") {
        poster = "https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Poster%20Availible&w=250&h=350";
      }
   
      if (data.genres.length > 3) {
        genre = data.genres[0].name + ", " + data.genres[1].name+ ", " + data.genres[2].name + ", " + data.genres[3].name;
      } else if (data.genres.length > 2) {
        genre = data.genres[0].name + ", " + data.genres[1].name + ", " + data.genres[2].name;
      } else if (data.genres.length > 1) {
        genre = data.genres[0].name + ", " + data.genres[1].name;
      } else {
        genre = data.genres[0].name;
      }
      $(".main").prepend("<div class='col-sm-12 overview'><div class='col-sm-4 over-poster'><img src=" + poster + "></div><div class='col-sm-8 text-left'><h1 class=''>" + title + "<span class='runtime'> - Runtime: " + runtime + "mins</span></h1><p class='lead tagline'><i>" + tagline + "</i></p><p class='lead text-left'>" + overview + "</p></div><div class='col-sm-12 text-left'><h2>Genre</h2><p class='lead text-left'>" + genre + "</p></div><div class='col-sm-12 text-left facts'><h2>Facts &amp; Figures</h2><p class='lead'>Budget: " + budget + "</p><p class='lead'>Revenue: " + revenue + "</p></div><div class='row mt-5 videos'><div class='col-sm-12'><h5 class='text-left'>Videos</h5></div></div><div class='row mt-5 reviews'><div class='col-sm-12'><h5 class='text-left'>Users Reviews</h5></div></div><div class='col-sm-12 text-center similarMoviesTitle'><h4>"+ title +", Similar Movies</h4></div><div id='hideMInfo' class='exit'><i onclick='exit(" + id + ");infinityScroll();' class='fa fa-times-circle' aria-hidden='true'></i></div><div class='row simi'></div></div>");
    });

    // Videos
    $.getJSON( videosURL, function(data) {
      
        // `msg` if no Videos found
      if ( data.results.length < 1 ) { 
        $(".videos").append("<div class='col-sm-6 text-left'><p>No Videos found</p></div>"); 
      }
      else {   
        //Render the first two Videos if there are many
        if( data.results.length > 2 ){
          for ( var i = 0; i < 2; i++ ) {         
            var video = 'https://www.youtube.com/embed/'+ data.results[i].key;
            $(".videos").append('<div class="col-sm-6 text-left video"><iframe  width="100%" height="315" src="'+video+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');        
          }
        }
        //Render the first Video if there is only one
        else {
          var video = 'https://www.youtube.com/embed/'+ data.results[0].key;
          $(".videos").append('<div class="col-sm-6 text-left video"><iframe  width="100%" height="315" src="'+video+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
        }
      }
    });

    // Reviews
    $.getJSON(reviewsURL, function(data) {

      if ( data.results.length < 1 ) { //no Reviews
        $(".reviews").append("<div class='col-sm-6 text-left'><p>No reviews found</p></div>"); 
      }

      for (var i = 0; i < data.results.length; i++) {

        var author = data.results[i].author;
        var content = data.results[i].content;
        var ellipsestext = "...";
        var showChar = 150;

          if( content.length > showChar ) {

            var c = content.substr(0, showChar);

            //re-trim if it is in the middle of a word
            c = c.substr(0, Math.min(c.length, c.lastIndexOf(" ")))
            
            var h = content.substr(showChar-1, content.length - showChar);

            var newContent = c + '<span class="toggle-content" id="item'+ i +'">' + h + '</span>&nbsp;&nbsp;<a onClick="toggle_more_less(`#id'+ i +'`);" href="#item'+ i +'"  id="#id'+ i +'" class="toggle">more</a>';

            var content = newContent
          }
    
        $(".reviews").append("<div class='col-sm-6 text-left review'><h6>Review from: " + author + "</h6>"+ content +"</div>");
      }
    });

    //Similar Movies
    $.getJSON( similarURL, function(data) {

      for ( var i = 0; i < data.results.length; i++ ) {
        
        var id = data.results[i].id;
        var title = data.results[i].title;
        var overview = data.results[i].overview;
        //trim Overview
        var string = overview; 
        var trimmedString = string.substr(0, 100); // trim on 150 chars
        
        //re-trim if it is in the middle of a word
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))    
        
        //Overview trimmed
        var overview = trimmedString +'....';
        var rating = data.results[i].vote_average;
        var yearOfRelease =  formatDate(data.results[i].release_date);
        roundHalf(rating);

        function roundHalf(rating) {
          ratin = rating / 2;
          ratin = Math.round(ratin * 2) / 2;
        }
        var poster = posterPaths + data.results[i].poster_path;
        
        if ( poster === "http://image.tmdb.org/t/p/w500null" ) {
            //if their is no poster dont show the movie
        }
        else { 
        $(".simi").append("<div class='col-sm-3 text-center movies m" + i + "' id='" + id + "'><div class='tiles'><img onclick='closeOverview();movieInfo(" + id + ");' src=" + poster + "> <div class='basicInfo text-left'><p>"+title+" <span>"+rating+"<i class='fa fa-star' aria-hidden='true'></i></span></p><p>Release: "+yearOfRelease+"</p><p>"+overview+"</p></div> </div></div>");
        }
      }
    });
  }); 
} // End of movieInfo



// --- HELPER FUNCTIONS ---

function infinityScroll() { 
  if (infinity_mainscreen === 'infinity_mainscreen') {  
    console.log(infinity_mainscreen);
      
    // Check if user is at the bottom and on mainScreen
    window.onscroll = function(ev) {
      if ( (window.innerHeight + window.scrollY) >= document.body.offsetHeight && infinity_mainscreen === 'infinity_mainscreen') {
        showMovie();
      }
    }; 
  } 
  else if (infinity_movieInfo === 'infinity_movieInfo') {   
    console.log(infinity_movieInfo );
    console.log('There is only one page at Related Movies, go to main screen or Search screen to see Infinity');
  } 
  else if (infinity_search === 'infinity_search') {
    console.log(infinity_search);

    // Check if user is at the bottom and on Search Screen
    window.onscroll = function(ev) {
      if ( (window.innerHeight + window.scrollY) >= document.body.offsetHeight && infinity_search === 'infinity_search') { 
        var searching = document.getElementById('search').value;
        search(searching);
      }
    }; 
  }
}

function closeOverview(){
  $(".overview").remove();
}

$("#movie").click(function() {
  sortMovies();
  $(".overview").remove();
  $(".more").show();
  next = 1;
});

// When user exit a movieInfo
function exit(id) {
  $(".overview").remove();
  $(".movies").show();
  $(".more").show( );

  if (is_searching == true) {
    infinity_mainscreen = '*';
    infinity_movieInfo = '*';
    infinity_search = 'infinity_search'; 
  } else {
    infinity_mainscreen = 'infinity_mainscreen';
    infinity_movieInfo = '*';
    infinity_search = '*'; 
  }

  window.location.hash = id;
}

sortMovies(); //Load some movies

// More - Less Reviews => show - hide
var show = function (elem) {
  elem.style.display = 'block';
};

var hide = function (elem) {
  elem.style.display = 'none';
};

var toggle = function (elem) {
	// If the element is visible, hide it
	if ( window.getComputedStyle(elem).display === 'block' ) {
    hide(elem);
		return;
	}
	// Otherwise, show it
	show(elem);
};

// Listen for click events
document.addEventListener('click', function (event) {

	// Make sure clicked element is our toggle
	if ( !event.target.classList.contains('toggle') ) return;

	// Prevent default link behavior
	event.preventDefault();

	// Get the content
	var content = document.querySelector(event.target.hash);
	if ( !content ) return;

	// Toggle the content
  toggle(content);
}, false);


var btn = $('#button');

$(window).scroll(function() {
  if ( $(window).scrollTop() > 300 ) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
}); 
// End

// Change more - less text Reviews
function toggle_more_less(id) {

  var e = document.getElementById(id);
  if(e.innerHTML == "more")
    e.innerHTML = 'less';
  else
    e.innerHTML = 'more';
}

// End Code
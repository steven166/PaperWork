

app.activity("film-info", new function(){

    var activity = this;
    var videoSource = undefined;
    var imdb = undefined;
    this.title = "Movie";

    this.actions = [
        {
            id: "watch-later",
            icon: "mdi-action-visibility-off",
            showAsAction: "always"
        }
    ];

    this.onCreate = function(eActivity, invokeArg){
        var urlData = app.getUrlData();
        if(urlData.group === "watchlist"){
            eActivity.find(".film-info-trailer").addClass("teal").removeClass("blue-gray");
            eActivity.find(".film-info-download").addClass("teal").removeClass("blue-gray");
        }

        var movieJSON = localStorage.getItem("movie-" + invokeArg);
        if(movieJSON == null){
            eActivity.html("Not found");
            return;
        }
        var movieMeta = JSON.parse(movieJSON);

        activity.title = movieMeta.title;
        var imageUrl = API_CONFIG.images.base_url + API_CONFIG.images.logo_sizes[1];
        if(movieMeta.poster_path != null){
            imageUrl += movieMeta.poster_path;
            activity.src = imageUrl;
        }else if(movieMeta.backdrop_path != null){
            imageUrl += movieMeta.backdrop_path;
            activity.src = imageUrl;
        }

        var watchList = localStorage.getItem("watchList");
        if(watchList != null){
            var jsonWatchList = JSON.parse(watchList);
            if(typeof(jsonWatchList[invokeArg]) !== "undefined" && jsonWatchList[invokeArg] == true){
                activity.actions[0].icon = "mdi-action-visibility";
            }else{
                activity.actions[0].icon = "mdi-action-visibility-off";
            }
        }else{
            activity.actions[0].icon = "mdi-action-visibility-off";
        }

        var done = 0;

        var getter = this.get("http://api.themoviedb.org/3/movie/" + invokeArg, {api_key: API_KEY, append_to_response: "videos", language: paper.lang.getLanguage()});
        getter.done(function(json){
            done++;

            if(json.videos.results.length == 0){
                eActivity.find(".film-info-cover").addClass("notrailer");
            }else{
                videoSource = json.videos.results[0].key;
            }
            var eRatings = eActivity.find(".film-info-rating");
            var r = json.vote_average / 2;
            for(var i = 0; i < r; i++){
                eRatings.append("<i class='fg-dark-gray mdi-action-star-rate'></i>");
            }

            imdb = json.imdb_id;

            var eGenres = eActivity.find(".film-info-genre");
            var genres = "";
            for(var i = 0; i < json.genres.length; i++){
                if(genres === ""){
                    genres = json.genres[i].name;
                }else{
                    genres += ", " + json.genres[i].name;
                }
            }
            eGenres.html(genres);

            var eDate = eActivity.find(".film-info-date");
            eDate.html(json.release_date);

            var eRuntime= eActivity.find(".film-info-runtime");
            eRuntime.html(json.runtime + " minutes");

            var eLang = eActivity.find(".film-info-lang");
            var langs = "";
            for(var i = 0; i < json.spoken_languages.length; i++){
                if(langs === ""){
                    langs = json.spoken_languages[i].name;
                }else{
                    langs += ", " + json.spoken_languages[i].name;
                }
            }
            eLang.html(langs);

            var eProductions = eActivity.find(".film-info-production");
            var producs = "";
            for(var i = 0; i < json.production_companies.length; i++){
                if(producs === ""){
                    producs = json.production_companies[i].name;
                }else{
                    producs += ", " + json.production_companies[i].name;
                }
            }
            eProductions.html(producs);

            var eCountries = eActivity.find(".film-info-countries");
            var countries = "";
            for(var i = 0; i < json.production_countries.length; i++){
                if(countries === ""){
                    countries = json.production_countries[i].name;
                }else{
                    countries += ", " + json.production_countries[i].name;
                }
            }
            eCountries.html(producs);

            var eSummary = eActivity.find(".film-info-summary");
            eSummary.html(json.overview);

            if(done == 2){
                activity.loaded();
            }
        });
        getter.fail(function(){
            activity.loaded();
        });

        var imageUrl = API_CONFIG.images.base_url + API_CONFIG.images.poster_sizes[4];
        var skipImage = false;
        if(movieMeta.poster_path != null){
            imageUrl += movieMeta.poster_path;
        }else if(movieMeta.backdrop_path != null){
            imageUrl += movieMeta.backdrop_path;
        }else{
            skipImage = true;
        }
        if(!skipImage){
            var image = new Image();
            image.onload = function(){
                eActivity.children(".film-info-cover").children(".film-info-poster").css("background-image", "url(" + imageUrl + ")");
                done++;
                if(done == 2){
                    activity.loaded();
                }
            };
            image.src = imageUrl;
        }else{
            done++;
        }

        return false;
    };

    $("body").on("click", "#a-film-info .film-info-trailer", function(){
        setTimeout(function(){
            if(typeof(videoSource) !== "undefined") {
                app.overlay("trailer-overlay", videoSource);
            }else{
                paper.toast("No trailer found");
            }
        }, 300);
    });

    $("body").on("click", "#a-film-info .film-info-download", function(){
        setTimeout(function(){
            app.goToActivity("download", 3, imdb);
        }, 300);
    });

    $("body").on("click", "#a-film-info #watch-later", function(){
        var i = $(this).children("i");
        if(i.hasClass("mdi-action-visibility-off")){
            i.removeClass("mdi-action-visibility-off").addClass("mdi-action-visibility");
        }else{
            i.removeClass("mdi-action-visibility").addClass("mdi-action-visibility-off");
        }

        var watchList = localStorage.getItem("watchList");
        if(watchList == null) {
            var jsonWatchList = {};
        }else{
            var jsonWatchList = JSON.parse(watchList);
        }
        var id = $("#a-film-info").attr("data-arg");
        if(i.hasClass("mdi-action-visibility")){
            jsonWatchList[id] = true;
        }else{
            delete jsonWatchList[id];
        }
        localStorage.setItem("watchList", JSON.stringify(jsonWatchList));
        if(i.hasClass("mdi-action-visibility")){
            paper.toast(paper.lang.get("watchlist-added"));
        }else{
            paper.toast(paper.lang.get("watchlist-removed"));
        }
    });

});
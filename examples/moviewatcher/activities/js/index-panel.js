
app.activity("index-panel", new function(){

    var activity = this;
    var iArg = undefined;
    var list;
    var pages = 0;
    var currentPage = 0;

    this.title = undefined;
    this.actions = [
        {
            id: "search-button",
            icon: "mdi-action-search",
            showAsAction: "always"
        },
        {
            id: "show-watchlist-button",
            title: "@+watchlist+@",
            showAsAction: "never"
        },
        {
            id: "settings-button",
            title: "@+settings+@",
            showAsAction: "never"
        }
    ];

    this.onCreate = function(eActivity, invokeArg){
        var exists = false;
        if(invokeArg != 0 && invokeArg != undefined) {
            iArg = invokeArg;
            var genres = localStorage.getItem(paper.lang.getLanguage() + "-genres");
            if(genres != null){
                var genreList = JSON.parse(genres);
                for(var i = 0; i < genreList.length; i++){
                    if(genreList[i].id == invokeArg){
                        exists = true;
                        activity.title = genreList[i].name;
                        break;
                    }
                }
            }
        }
        if(!exists){
            activity.title = undefined;
        }
        var params = {api_key: API_KEY, language: paper.lang.getLanguage()};
        if(typeof(iArg) !== "undefined" && iArg != null){
            params["with_genres"] = iArg;
        }

        var getter = this.get("http://api.themoviedb.org/3/discover/movie", params);
        getter.done(function(json){

            pages = json.total_pages;
            currentPage = 1;

            var movieList = [];
            for(var i = 0; i < json.results.length; i++){
                var r = json.results[i];
                var newJSON = {
                    id: r.id,
                    backdrop_path: r.backdrop_path,
                    title: r.title,
                    vote_average: r.vote_average,
                    release_date: r.release_date,
                    poster_path: r.poster_path
                };
                movieList.push(newJSON);
                localStorage.setItem("movie-" + r.id, JSON.stringify(newJSON));
            }

            list.render(movieList);
            activity.loaded();
        });
        getter.fail(function(){
            activity.loaded();
        });

        list = paper.list.create(eActivity, function(li, item, isHeader){
            if(isHeader){
                li.addClass("header").addClass("sep-top");
                li.html(item);
            }else{
                li.attr("data-key", item.id);
                li.addClass("wrippels").addClass("push-left");
                li.addClass("medium");
                var imageUrl = API_CONFIG.images.base_url + API_CONFIG.images.logo_sizes[1];
                var skipImage = false;
                if(item.poster_path != null){
                    imageUrl += item.poster_path;
                }else if(item.backdrop_path != null){
                    imageUrl += item.backdrop_path;
                }else{
                    skipImage = true;
                }
                if(!skipImage) {
                    var iconHolder = $("<div class='icon fade'></div>").appendTo(li);
                    var image = new Image();
                    image.onload = function () {
                        iconHolder.css("background-image", "url(" + imageUrl + ")");
                        iconHolder.removeClass("fade");
                    };
                    image.src = imageUrl;
                }

                var year = new Date(item.release_date).getUTCFullYear();
                $("<div class='title main'>" + item.title + "</div>").appendTo(li);

                var sub = $("<div class='title sub'><b>" + year + "</b></div>").appendTo(li);
                var ratings = $("<span></span>").appendTo(sub);
                var r = item.vote_average / 2;
                for(var i = 0; i < r; i++){
                    ratings.append("<i class='fg-dark-gray mdi-action-star-rate' style='font-size:20px;'></i>");
                }
            }
        });

        return false;
    };

    $("body").on("navigate", function(event, url, urlData){
        if(urlData.group === "home"){
            if(urlData.acts.length == 0){
                $("#e-index-panel .paper-list li").removeClass("selected");
            }else{
                var arg = urlData.acts[0].arg;
                if(typeof(arg) !== "undefined" && arg !== null){
                    $("#e-index-panel .paper-list li").removeClass("selected");
                    $("#e-index-panel .paper-list li[data-key='" + arg + "']").addClass("selected");
                }
            }
        }
    });

    $("body").on("click", "#e-index-panel .paper-list li:not(.header)", function(){
        var tthis = this;
        setTimeout(function(){
            $(tthis).parent().children().removeClass("selected");
            $(tthis).addClass("selected");
            app.goToActivity("film-info", 2, $(tthis).attr("data-key"));
        }, 300);
    });

    $("body").on("click", "#a-index-panel #show-watchlist-button", function(){
        app.goToGroup("watchlist");
    });

    $("body").on("click", "#a-index-panel #search-button", function(){
        app.overlay("search-flow", activity.invokeArg);
    });

    $("body").on("click", "#a-index-panel #settings-button", function(){
        app.goToGroup("settings");
    });

    $("body").on("click", "#a-index-panel .list-more", function(){
        var tthis = this;
        if(!$(this).hasClass("fade")){
            $(this).addClass("fade");
            $(this).next().removeClass("fade");
            currentPage++;
            var params = {api_key: API_KEY, language: paper.lang.getLanguage(), page: currentPage};
            if(typeof(iArg) !== "undefined" && iArg != null){
                params["with_genres"] = iArg;
            }
            var getter = activity.get("http://api.themoviedb.org/3/discover/movie", params);
            getter.done(function(json){
                var movieList = {};
                for(var i = 0; i < json.results.length; i++){
                    var r = json.results[i];
                    movieList[r.id] = r;
                    localStorage.setItem("movie-" + r.id, JSON.stringify(r));
                }

                list.append(json.results, 0);
                $(tthis).removeClass("fade");
                $(tthis).next().addClass("fade");
            });
        }

    });

});
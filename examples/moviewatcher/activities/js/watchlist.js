
app.activity("watchlist", new function(){

    this.onCreate = function(eActivity){
        var watchList = localStorage.getItem("watchList");
        if(watchList != null){
            var assoc = JSON.parse(watchList);
            var jsonWatchList = [];
            for(var key in assoc){
                if(assoc[key] == true) {
                    jsonWatchList.push(key);
                }
            }
            if(jsonWatchList.length == 0){
                var noResults = {};
                noResults[paper.lang.get("no-movies")] = [];
                jsonWatchList = noResults;
            }
        }else{
            var noResults = {};
            noResults[paper.lang.get("no-movies")] = [];
            jsonWatchList = noResults;
        }

        var list = paper.list.create(eActivity, function(li, id, isHeader){
            if(isHeader){
                li.addClass("header").addClass("sep-top");
                li.html(id);
            }else{
                var item = JSON.parse(localStorage.getItem("movie-" + id));
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

        list.render(jsonWatchList);

    };

    $("body").on("navigate", function(event, url, urlData){
        if(urlData.group === "watchlist"){
            if(urlData.acts.length == 0){
                $("#e-watchlist .paper-list li").removeClass("selected");
            }else{
                var arg = urlData.acts[0].arg;
                if(typeof(arg) !== "undefined" && arg !== null){
                    $("#e-watchlist .paper-list li").removeClass("selected");
                    $("#e-watchlist .paper-list li[data-key='" + arg + "']").addClass("selected");
                }
            }
        }
    });

    $("body").on("click", "#e-watchlist .paper-list li:not(.header)", function(){
        var tthis = this;
        setTimeout(function(){
            $(tthis).parent().children().removeClass("selected");
            $(tthis).addClass("selected");
            app.goToActivity("film-info", 2, $(tthis).attr("data-key"));
        }, 300);
    });

});
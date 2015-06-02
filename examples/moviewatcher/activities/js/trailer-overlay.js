app.activity("trailer-overlay", new function(){

    this.color = "dark-gray";
    this.title = "Trailer";
    var activity = this;

    this.onCreate = function(eActivity, invokeArg){
        eActivity.find("iframe").attr("src", "https://www.youtube.com/embed/" + invokeArg);
        setTimeout(function(){
            activity.loaded();
        }, 100);
        return false;
    };

});
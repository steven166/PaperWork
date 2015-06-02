app.activity("settings", new function(){

    $("body").on("click", "#a-settings #setting-action-general", function(){
        setTimeout(function(){
            app.goToActivity("settings-general", 2);
        }, 300);
    });

    $("body").on("click", "#a-settings #setting-action-about", function(){
        setTimeout(function(){
            app.goToActivity("settings-about", 2);
        }, 300);
    });

});
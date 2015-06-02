app.activity("settings-general", new function(){

    this.title = "@+general+@";

    $("body").on("click", "#e-settings-general #settings-cache", function(){
        paper.modal.error(paper.lang.get("clear-cache"), paper.lang.get("clear-cache-question"), function(){
            var watchList = localStorage.getItem("watchList");
            localStorage.clear();
            if(watchList != null){
                localStorage.setItem("watchList", watchList);
            }
            getAPIConfig();
            paper.toast(paper.lang.get("clear-cache-confirm"));
        }, paper.lang.get("clear-cache"), paper.lang.get("cancel"));
    });

    $("body").on("click", "#e-settings-general #settings-language", function(){
        var currentLanguage = paper.lang.get("lang");

        var langKeys = paper.lang.getSupportedLanguages();
        var langs = [];
        for(var i = 0; i < langKeys.length; i++){
            var map = paper.lang.getLanguageMap(langKeys[i]);
            if(map != null){
                langs.push(map["lang"]);
            }
        }
        paper.modal.options(paper.lang.get("language"), langs, currentLanguage, function(value){
            for(var i = 0; i < langKeys.length; i++){
                var map = paper.lang.getLanguageMap(langKeys[i]);
                if(map != null){
                    if(value === map["lang"]){
                        paper.lang.setLanguage(langKeys[i]);
                    }
                }
            }
        }, paper.lang.get("cancel"));
    });

});

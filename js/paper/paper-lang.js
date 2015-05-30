(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-modal\' dependence on \'paper\'");
    }

    paper.lang = {

        version: 0.01,

        getLanguage: function () {
            return language;
        },

        get: function(key){
            var map = paper.lang.getLanguageMap();
            if(map != null){
                return map[key];
            }
            return null;
        },

        replace: function(text){
            if(text.indexOf("@+") != -1){
                var blocks = text.split("@+");
                for(var i = 1; i < blocks.length; i++){
                    var block = blocks[i];
                    if(block.indexOf("+@") != -1){
                        var key = block.split("+@")[0];
                        text = text.replace("@+" + key + "+@", paper.lang.get(key));
                    }
                }
            }
            return text;
        },

        getLanguageMap: function(lang){
            var l = lang;
            if(typeof(lang) === "undefined"){
                l = language;
            }
            if(typeof(languages[l]) !== "undefined") {
                return languages[l];
            }else{
                return null;
            }
        },

        getLanguages: function(){
            return languages;
        },

        getSupportedLanguages: function(){
            return supportedLanguages;
        },

        getBrowserLanguage: function () {
            var language = navigator.browserLanguage;
            if (navigator.appName == 'Netscape') {
                language = navigator.language;
            }
            if(language.indexOf("-") != -1){
                language = language.split("-")[0];
            }
            return language.toLowerCase();
        },

        setSupportedLanguages: function(langs){
            supportedLanguages = langs;
            var supported = false;
            for(var i = 0; i < supportedLanguages.length; i++){
                if(language === supportedLanguages[i]){
                    supported = true;
                }
            }
            if(supported == false){
                paper.lang.setLanguage(supportedLanguages[0]);
            }
        },

        setLanguage: function (lang) {
            init = false;
            var supported = false;
            for(var i = 0; i < supportedLanguages.length; i++){
                if(lang === supportedLanguages[i]){
                    supported = true;
                }
            }
            if(!supported){
                throw "Language '" + lang + "' is not supported"
            }
            language = lang;
            localStorage.setItem("language", lang);
            if(typeof(languages[lang]) !== "undefined"){
                paper.lang.updateLanguage();
            }
        },

        updateLanguage: function (element) {
            var e = $(element);
            if(typeof(element) === "undefined"){
                e = $("body");
            }
            if(typeof(languages[language]) !== "undefined") {
                var map = languages[language];
                e.find("[lang-key]").each(function(){
                    var langKey = $(this).attr("lang-key");
                    var langValue = map[langKey];
                    if(typeof(langValue) === "undefined"){
                        langValue = "";
                    }
                    $(this).html(langValue);
                });
                init = true;
            }
        },

        installLanguage: function (key, map) {
            if(key.length == 2){
                languages[key.toLowerCase()] = map;

                if(init = false && key.toLowerCase() === language){
                    paper.lang.updateLanguage();
                }
            }else{
                "Key must be two letter code (iso 639-1)";
            }
        }

    };

    var init = false;

    var languages = {};
    var supportedLanguages = [];
    var language = paper.lang.getBrowserLanguage();
    if(localStorage.getItem("language") != null){
        language = localStorage.getItem("language");
    }

})();
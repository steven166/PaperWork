/**
 * Material Framework
 * @type {{colors: {assoc}, loaded: boolean}}
 */
var paper = {

    version: "0.1.3",

    /**
     * Predefined Colors
     */
    colors: {
        red: "#F44336",
        pink: "#E91E63",
        purple: "#9C27B0",
        'deep-purple': "#673AB7",
        indigo: "#3F51B5",
        blue: "#2196F3",
        'light-blue': "#03A9F4",
        cyan: "#00BCD4",
        teal: "#009688",
        green: "#4CAF50",
        'light-green': "#8BC34A",
        lime: "#CDDC39",
        yellow: "#FFEB3B",
        amber: "#FFC107",
        orange: "#FF9800",
        'deep-orange': "#FF5722",
        brown: "#795548",
        gray: "#9E9E9E",
        'dark-gray': "#333333",
        'light-gray': "#CCCCCC",
        'blue-gray': "#607D8B",
        black: "black",
        white: "white",
        transparent: "rgba(0,0,0,0)"
    },

    /**
     * If page is fully loaded true, if not loaded false
     */
    loaded: false,

    /**
     * List of all modules
     */
    modules: ["app", "checkbox", "radio", "header", "input", "lang", "list", "alert", "snackbar", "toast", "wrippels", "loading", "progress"],

    /**
     * Get list of installed modules
     * @returns {Array}
     */
    getInstalledModules: function(){
        var installedModules = [];
        for(var i = 0; i < paper.modules.length; i++){
            var module = paper.modules[i];
            if(typeof(paper[module]) !== "undefined"){
                installedModules.push(module);
            }
        }
        return installedModules;
    },

    /**
     * Call init function on all modules
     * @param element - rootElement to initialize (default is body)
     */
    initModules: function(element){
        if(typeof(element) === "undefined"){
            var e = $("body");
        }else{
            var e = $(element);
        }
        var modules = paper.getInstalledModules();
        for(var i = 0; i < modules.length; i++){
            var module = paper[modules[i]];
            if(typeof(module["init"]) !== "undefined"){
                module["init"](e);
            }
        }
    },

    loading: {
        /**
         * Find and initialze 'paper-loader' elements
         * @param element - rootElement to initialize (default is body)
         */
        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-loading") && e.children().length === 0){
                $("<svg viewBox='0 0 52 52'><circle cx='26px' cy='26px' r='20px' fill='none' stroke-width='4px' /></svg>").appendTo(e);
            }else{
                var loaders = e.find(".paper-loading");
                loaders.each(function(){
                    if($(this).children().length === 0){
                        $("<svg viewBox='0 0 52 52'><circle cx='26px' cy='26px' r='20px' fill='none' stroke-width='4px' /></svg>").appendTo($(this));
                    }
                });
            }
        },

        /**
         * Create loader element
         * @param color - predefined color
         */
        create: function(color){
            var loader = $("<div class='paper-loading'></div>");
            paper.loading.init(loader);
            if(typeof(color) !== "undefined"){
                loader.addClass(color);
            }
            return loader;
        }
    }
};

(function(){

    //Check dependency
    if(typeof($) === "undefined"){
        console.error("\'paper\' dependence on JQuery");
    }

    //Watch loading
    $(window).load(function(){
        paper.loaded = true;
        console.info("Installed modules: " + paper.getInstalledModules());
        paper.initModules();
        $(".paper-startup").fadeOut(200, function(){
            $(this).remove();
        });
    });

    //Cookie library
    paper.cookie = {
        getItem: function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    paper.toNormalText = function(text){
        var normalText = text.replace("-", " ");
        return paper.uppercaseWord(normalText);
    };

    paper.uppercaseFirst = function(text){
        return text.substring(0,1).toUpperCase() + text.substring(1).toLowerCase();
    };

    paper.uppercaseWord = function(text){
        var out = "";
        var words = text.split(" ");
        for(var i = 0; i < words.length; i++){
            if(out !== ""){
                out += " ";
            }
            out += paper.uppercaseFirst(words[i]);
        }
        return out;
    };

})();
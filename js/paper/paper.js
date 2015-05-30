/**
 * Material Framework
 * @type {{colors: {assoc}, loaded: boolean}}
 */
var paper = {

    version: 0.01,

    /**
     * Predefined Colors
     */
    colors: {
        red: "#F44336",
        pink: "#E91E63",
        purple: "#9C27B0",
        'deep-purple': "#673AB7",
        indgo: "#3F51B5",
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

    ready: false,

    /**
     * If page is fully loaded true, if not loaded false
     */
    loaded: false
};

(function(){

    //Check dependency
    if(typeof($) === "undefined"){
        console.error("\'paper\' dependence on JQuery");
    }

    //Watch loading
    $(window).load(function(){
        paper.loaded = true;
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

})();

var _pp_wait_for_loading = false;

/**
 * Object for paper actions1 and settings
 */
var paper = {
    version: 1.00,
    isTouchDevice: 'ontouchstart' in document.documentElement
};

$(function () {
    /**
     * List of predefined colors and values
     */
    paper.colors = {
        red: "#F44336",
        pink: "#E91E63",
        purple: "#9C27B0",
        deeppurple: "#673AB7",
        indgo: "#3F51B5",
        blue: "#2196F3",
        lightblue: "#03A9F4",
        cyan: "#00BCD4",
        teal: "#009688",
        green: "#4CAF50",
        lightgreen: "#8BC34A",
        lime: "#CDDC39",
        yellow: "#FFEB3B",
        amber: "#FFC107",
        orange: "#FF9800",
        deeporange: "#FF5722",
        brown: "#795548",
        gray: "#9E9E9E",
        darkgray: "#333333",
        lightgray: "#CCCCCC",
        bluegray: "#607D8B",
        black: "black",
        white: "white"
    };

    $("body").ready(function () {
        $(".paper-loading").pp_initLoadingRotator();
    });

    /**
     * Initialize loading rotators
     * Add the correct html
     */
    $.fn.pp_initLoadingRotator = function () {
        $(this).append('<svg viewBox="0 0 52 52"><circle cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px" /></svg>');
    };

    /**
     * Add loading rotator to element
     * @param {type} position top | left | right | bottom | center | middel
     * @param {type} fgColor color of the circel (default: blue)
     * @param {type} bgColor background color (default: transparent)
     * @param {type} size small | large (default: large)
     * @returns {jQuery} loading rotator
     */
    $.fn.pp_setLoading = function (position, fgColor, bgColor, size) {
        if (!pos) {
            pos = "";
        }
        if (!fgColor) {
            fgColor = "";
        }
        if (!bgColor) {
            bgColor = "";
        }
        if (!size) {
            size = "";
        } else if (size == "small") {
            size = "small";
        } else {
            size = "";
        }
        var pos = position.trim().toLowerCase().split(" ");
        for (var i = 0; i < pos.length; i++) {
            var p = pos[i];
            if (!(p == "top" ||
                    p == "left" ||
                    p == "right" ||
                    p == "bottom" ||
                    p == "center" ||
                    p == "middel")) {
                throw "position must be one of these: top | left | right | bottom | center | middel";
            }
        }
        var align = (pos != "" ? "align" : "");
        var overlay = (bgColor != "" ? "shadow-2" : "");
        var clsFgColor = (!paper.isPredefined(fgColor) ? "fg-" + fgColor : "");
        var styleFgColor = (!paper.isPredefined(fgColor) ? "" : " style='stroke: " + fgColor + "'");
        var clsBgColor = (!paper.isPredefined(bgColor) ? bgColor : "");
        var styleBgColor = (!paper.isPredefined(bgColor) ? "" : " style='background-color: " + bgColor + "'");

        var html = "<div class='paper-loading ani hide " + align + " " + position + " " + overlay + " " + clsFgColor + " " + clsBgColor + " " + size + "'" + styleBgColor + ">";
        html += '<svg viewBox="0 0 52 52"><circle cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px"' + styleFgColor + ' /></svg>';

        var element = $(html).appendTo($(this));
        setTimeout(function () {
            element.pp_fadeIn();
        }, 20);
        return $(element);
    };

    /**
     * Fade in element
     * @param {type} duration
     * @param {type} func function when done
     * @returns {JQuery} element
     */
    $.fn.pp_fadeIn = function (duration, func) {
        if (!duration) {
            duration = 500;
        }
        var tthis = this;
        if ($(this).hasClass("hide")) {
            $(this).addClass("fadeout").removeClass("hide");
            setTimeout(function () {
                $(tthis).addClass("fadein").removeClass("fadeout");
                if (func) {
                    setTimeout(func, duration);
                }
            }, 10);
        } else {
            $(tthis).addClass("fadein").removeClass("fadeout");
        }
        return this;
    };


    /**
     * Fade out element
     * @param {type} duration
     * @param {type} func function when done
     * @returns {JQuery} element
     */
    $.fn.pp_fadeOut = function (duration, func) {
        if (!duration) {
            duration = 500;
        }
        var tthis = this;
        $(this).addClass("fadeout").removeClass("fadein");
        setTimeout(function () {
            $(tthis).addClass("hide").removeClass("fadeout");
            if (func) {
                setTimeout(func, duration);
            }
        }, duration);
        return this;
    };

    /**
     * Check if color is predefined or not
     * @param {type} color
     * @returns {Boolean} predefined true otherwise false
     */
    paper.isPredefined = function (color) {
        var clr = color.trim().toLowerCase();
        for (var i = 0; i < Object.keys(paper.colors).length; i++) {
            if (Object.keys(paper.colors)[i] === clr) {
                return true;
            }
        }
        return false;
    };
});

function error(error) {
    console.error(error);
    paper.snackbar(error);
}

function hideError(errorPop) {
}

function setLoading(isLoading) {
    if (isLoading) {
        if($(".paper-content").length > 0){
            $(".paper-content").pp_setLoading("top center", paper.colors.blue, "white");
        }else{
            $("body").pp_setLoading("top center", paper.colors.blue, "white");
        }
//        if($(".paper-loading-tip").length > 0){
//            var count = parseInt($(".paper-loading-tip").attr("data-counter")) +1;
//            $(".paper-loading-tip").attr("data-counter", count);
//            return;
//        }else{
//            var up = "";
//            if($(".paper-error").length > 0){
//                up = " up";
//            }
//            $("body").append("<div class='paper-loading-tip fadeout" + up + "' data-counter='0'>\n\
//                    <div class='paper-loading small inline-block fg-white'>\n\
//                    <svg class=\"spinner-container fg-white\" width=\"40px\" height=\"40px\" viewBox=\"0 0 52 52\">\n\
//                        <circle class=\"path\" cx=\"26px\" cy=\"26px\" r=\"20px\" fill=\"none\" stroke-width=\"4px\" />\n\
//                    </svg>\n\
//                    </div>\n\
//                    <span>Loading</span>\n\
//                </div>");
//            setTimeout(function(){
//                if($(".paper-loading-tip").length > 0){
//                    if($(".paper-loading-tip").hasClass("fadeout")){
//                        $(".paper-loading-tip").removeClass("fadeout");
//                    }
//                }
//            }, 500);
//        }
    } else {
        var loading = $("body > .paper-loading, .paper-content > .paper-loading");
        loading.pp_fadeOut(400);
        setTimeout(function () {
            loading.remove();
        }, 400);
//        if ($(".paper-loading-tip").length > 0) {
//            var count = parseInt($(".paper-loading-tip").attr("data-counter")) - 1;
//            $(".paper-loading-tip").attr("data-counter", count);
//            if (count <= 0) {
//                if ($(".paper-loading-tip").hasClass("fadeout")) {
//                    $(".paper-loading-tip").remove();
//                } else {
//                    $(".paper-loading-tip").addClass("fadeout");
//                    setTimeout(function () {
//                        var count = parseInt($(".paper-loading-tip").attr("data-counter"));
//                        if (count <= 0) {
//                            $(".paper-loading-tip").remove();
//                        }
//                    }, 500);
//                }
//            }
//        }
    }
}
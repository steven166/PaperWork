
$(function () {

    var mouseDown = function (event) {
        var tthis = this;
        //calc size
        var w = $(tthis).width();
        w += parseInt($(tthis).css("padding-left"));
        w += parseInt($(tthis).css("padding-right"));
        var h = $(tthis).height();
        h += parseInt($(tthis).css("padding-top"));
        h += parseInt($(tthis).css("padding-bottom"));
        var size = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) * 2;

        //calc pos
        var offset = $(tthis).offset();
        var x = Math.round(event.pageX - offset.left) - size / 2;
        var y = Math.round(event.pageY - offset.top) - size / 2;

        //find background
        var isLight = isLightBackground(tthis);
        var cls = "overlay" + (isLight ? " dark" : "");

        var html = "<div class='" + cls + "' style='width: " + size + "px; height: " + size + "px; top: " + y + "px; left: " + x + "px;'/>";
        var overlay = $(html).appendTo(tthis);
        setTimeout(function () {
            var tick = 0;
            var interval = window.setInterval(function () {
                tick++;
                var scale = tick / 100;
                overlay.css("transform", "scale(" + scale + "," + scale + ")");
                if (overlay.hasClass("wrippel-expand")) {
                    overlay.css("transform", "");
                    window.clearInterval(interval);
                }
                if (tick == 100) {
                    window.clearInterval(interval);
                }
            }, 20);
        }, 10);
    };

    var mouseUp = function (e) {
        var tthis = this;
        var overlay = $(tthis).children(".overlay");
        overlay.addClass("wrippel-ani");
        setTimeout(function () {
            overlay.addClass("wrippel-expand");
            setTimeout(function () {
                overlay.addClass("wrippel-hide");
                setTimeout(function () {
                    overlay.remove();
                }, 300);
            }, 200);
        }, 10);
    };

    function isLightBackground(comp) {
        try {
            bg = $(comp).css("background-color");
            if (bg === "transparent") {
                return isLightBackground($(comp).parent());
            } else if (bg.indexOf("rgba") == 0) {
                bg = bg.substring(5, bg.length - 1);
                clrs = bg.split(",");
                if (parseInt(clrs[3]) == 0) {
                    return isLightBackground($(comp).parent());
                } else {
                    return (parseInt(clrs[0]) + parseInt(clrs[1]) + parseInt(clrs[2])) / 3 > 120;
                }
            } else {
                bg = bg.substring(4, bg.length - 1);
                clrs = bg.split(",");
                return (parseInt(clrs[0]) + parseInt(clrs[1]) + parseInt(clrs[2])) / 3 > 120;
            }
        } catch (e) {
            console.error(e);
            return true;
        }
    }

    if (paper.isTouchDevice) {
        $("body").on("touchstart, mousedown", ".wrippels", mouseDown);
        $("body").on("touchend, mouseup", ".wrippels", mouseUp);
        $("body").on("touchmove", ".wrippels", mouseUp);
    } else {
        $("body").on("mousedown", ".wrippels:not(.touchonly)", mouseDown);
        $("body").on("mouseup", ".wrippels:not(.touchonly)", mouseUp);
        $("body").on("mousemove", ".wrippels:not(.touchonly)", mouseUp);
    }
});
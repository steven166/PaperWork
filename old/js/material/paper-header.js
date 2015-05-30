$(function () {

    $("body").ready(function () {
        installPaperHeaderListener();
    });

    function installPaperHeaderListener() {
        $("body").on("click", ".paper-header .paper-header-menu-right-toggle, .paper-header .paper-header-menu .overlay", function () {
            var tthis = $(".paper-header .paper-header-menu-right-toggle");
            cmp = $(tthis).next(".paper-header-menu-right");
            if ($(tthis).hasClass("active")) {
                $(tthis).removeClass("active");
                $(".paper-header .paper-header-menu .overlay").remove();
                cmp.addClass("tmp");
                cmp.removeClass("active");
                setTimeout(function () {
                    cmp.removeClass("tmp");
                }, 200);
            } else {
                $(tthis).addClass("active");
                $(tthis).parent().append("<div class='overlay'></div>");
                cmp.addClass("tmp");
                setTimeout(function () {
                    cmp.addClass("active");
                    cmp.removeClass("tmp");
                }, 10);
            }
        });
        
        $("body").on("click", ".paper-header .paper-header-menu-button:not(.active)", function () {
            menu = $(".paper-header .paper-header-menu");
            if (menu.hasClass("active")) {
                menu.removeClass("active");
                $(".paper-header .paper-header-menu-back").removeClass("active");
                setTimeout(function () {
                    $(".paper-header .paper-header-menu-back").remove();
                }, 200);
            } else {
                menu.addClass("active");
                menu.before("<div class='paper-header-menu-back'/>");
                setTimeout(function () {
                    $(".paper-header .paper-header-menu-back").addClass("active");
                    $(".paper-header .paper-header-menu-back").click(function () {
                        $(".paper-header .paper-header-menu-button").click();
                    });
                }, 10);
            }
        });
        $("body").on("click", ".paper-header .paper-header-menu-button.active", function(){
            window.history.back();
        });

        $(window).resize(function () {
            fixHeaderHeight();
        });
        $(window).scroll(function () {
            fixHeaderHeight();
        });
        $(".paper-content, .paper-content.drawer .drawer-content").scroll(function () {
            fixHeaderHeight();
        });
        fixHeaderHeight();
    }

    function fixHeaderHeight() {
        h = $(window).height();
        w = $(window).width();
        if ((h < 600 && w > 600) || (h < 480 && w <= 600)) {
            $(".paper-header.auto").removeClass("large");
            $(".paper-content.auto").removeClass("large");
            $(".paper-header.auto").css("height", "");
            $(".paper-header.auto .paper-header-content").css("margin-top", "");
            $(".paper-header.auto .paper-header-menu-button").css("top", "");
            $(".paper-content.auto.fixed").css("top", "");
            icon = $(".paper-header.auto .icon");
            icon.css("opacity", "");
            icon.css("width", "");
            icon.css("height", "");
            icon.css("margin-right", "");
            icon.css("margin-left", "");
        } else {
            $(".paper-header.auto").addClass("large");
            $(".paper-content.auto").addClass("large");
            scrollTop = $(window).scrollTop() + $(".paper-content").scrollTop() + $(".paper-content.drawer .drawer-content").scrollTop();
            if (scrollTop == 0) {
                $(".paper-header.auto").css("height", "");
                $(".paper-header.auto .paper-header-content").css("margin-top", "");
                $(".paper-header.auto .paper-header-menu-button").css("top", "");
                $(".paper-content.auto.fixed").css("top", "");
                icon = $(".paper-header.auto .icon");
                icon.css("opacity", "");
                icon.css("width", "");
                icon.css("height", "");
                icon.css("margin-right", "");
                icon.css("margin-left", "");
            } else {
                cTop = $(".paper-content.auto").scrollTop() + $(".paper-content.drawer .drawer-content").scrollTop();
                if (cTop > 54) {
                    cTop = 54;
                }
                cTop = 144 - cTop;
                $(".paper-content.auto.fixed").css("top", cTop + "px");

                sTop = scrollTop;
                if (sTop > 54) {
                    sTop = 54;
                }
                nh = 144 - sTop;
                nh2 = 54 - sTop;
                $(".paper-header.auto").css("height", nh + "px");
                $(".paper-header.auto .paper-header-content").css("margin-top", nh2 + "px");
                if (w < 600) {
                    $(".paper-header.auto .paper-header-menu-button").css("top", "30px");
                    icon = $(".paper-header.auto .icon");
                    icon.css("opacity", "0");
                    icon.css("width", "0px");
                    icon.css("height", "0px");
                    icon.css("margin-right", "0px");
                    icon.css("margin-left", "30px");
                }
            }
        }

        if ($(".paper-header.auto").hasClass("large")) {

        } else {
            $(".paper-header.auto").css("height", "");
        }
    }

});
//
//function installDrawerListener() {
//    if (DEFAULT_LIST_HTML == null) {
//        DEFAULT_LIST_ITEM = $(".paper-content .drawer-nav .paper-list-header.active");
//        DEFAULT_LIST_HTML = $(".paper-content .drawer-content").html();
//    }
//    $(".paper-content .drawer-nav .paper-list-header").unbind("click");
//    $(".paper-content .drawer-nav .paper-list-header").click(function () {
//        if (typeof ($(this).attr("data-link")) !== "undefined") {
//            if (!$(this).hasClass("active")) {
//                timeout = $(window).width() < 600 ? 300 : 200;
//                var tthis = this;
//                setTimeout(function () {
//                    $(".drawer-nav li.paper-list-header").removeClass("active");
//                    $(tthis).addClass("active");
//                    $(".paper-content .drawer-content").addClass("paper-hidden");
//                    $(".paper-content .drawer-content").addClass("active");
//                    $(".paper-content .drawer-nav").addClass("active");
//                    if ($(window).width() < 600) {
//                        $(".paper-content .drawer-content-o").html("");
//                    }
//
//                    var startTime = new Date().getTime();
//                    var title = $(tthis).children(".paper-list-title").html().trim();
//                    var key = $(tthis).attr("data-key");
//                    var url = document.URL;
//                    if (url.indexOf("#") != -1) {
//                        url = url.split("#")[0];
//                    }
//                    var url = url + "#" + key;
//
//                    var done = false;
//                    setLoading(true);
//                    getter = $.get($(tthis).attr("data-link"));
//                    getter.done(function (data) {
//                        setLoading(false);
//                        history.pushState(data, title, url);
//                        var difTime = 300 - (new Date().getTime() - startTime);
//                        if (difTime < 0) {
//                            difTime = 0;
//                        }
//                        setTimeout(function () {
//                            $(".paper-content .drawer-content-o").html(data);
//                            setTimeout(function () {
//                                $(".paper-content .drawer-content").removeClass("paper-hidden");
//                            }, 10);
//                        }, difTime);
//                    });
//                    getter.fail(function (xhr) {
//                        setLoading(false);
//                        if (xhr.status == 500) {
//                            history.pushState("e:Something went wrong", title, url);
//                            error("Something went wrong");
//                        } else {
//                            history.pushState("e:Connection error", title, url);
//                            error("Connection error");
//                        }
//                    });
//                    getter.always(function(){
//                        done = false;
//                    });
//                }, timeout);
//            }
//        }
//    });
//
//    window.onpopstate = function (event) {
//        $(".drawer-nav li.paper-list-header").removeClass("active");
//        if (document.URL.indexOf("#") != -1) {
//            var key = document.URL.split("#")[1];
//            $(".drawer-nav li.paper-list-header[data-key='" + key + "']").addClass("active");
//        } else {
//            DEFAULT_LIST_ITEM.addClass("active");
//        }
//        var timeout = $(".paper-content .drawer-content").hasClass("paper-hidden") ? 0 : 300;
//        if (timeout == 300) {
//            $(".paper-content .drawer-content").addClass("paper-hidden");
//        }
//        $(".paper-content .drawer-content").removeClass("active");
//        $(".paper-content .drawer-nav").removeClass("active");
//        setTimeout(function () {
//            if (document.URL.indexOf("#") != -1) {
//                $(".paper-content .drawer-content").addClass("active");
//                $(".paper-content .drawer-nav").addClass("active");
//                $(".paper-content .drawer-content-o").html(event.state);
//                setTimeout(function () {
//                    $(".paper-content .drawer-content").removeClass("paper-hidden");
//                }, 10);
//            } else {
//                $(".paper-content .drawer-content-o").html(DEFAULT_LIST_HTML);
//                setTimeout(function () {
//                    $(".paper-content .drawer-content").removeClass("paper-hidden");
//                }, 10);
//            }
//        }, timeout);
//    };
//
//    if (document.URL.indexOf("#") != -1) {
//        var key = document.URL.split("#")[1];
//        console.info("selected key: " + key);
//        $(".drawer-nav .paper-list-header[data-key='" + key + "']").click();
//    }
//}
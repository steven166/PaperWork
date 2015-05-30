
$(function () {

    $("body").ready(function () {
        $("body").on("click", ".paper-drawer > ul.drawer-nav li", function (event, noHistory) {
            var tthis = this;
            $(".paper-drawer > ul.drawer-nav li.selected").removeClass("selected");
            $(this).addClass("selected");
            if ($("body").width() < 600) {
                $(".paper-drawer").addClass("active");
                $(".paper-header-menu-button").addClass("active");
            } else {
                $(".paper-drawer").removeClass("active");
                $(".paper-header-menu-button").removeClass("active");
            }

            var title = $(this).children(".title").html().trim();
            var key = $(this).attr("data-key");
            var url = document.URL;
            if (url.indexOf("#") != -1) {
                url = url.split("#")[0];
            }
            var url = url + "#" + key;

            if(noHistory != true){
                history.pushState("", title, url);
            }
            $("body").trigger("draweropen", [this]);

            var link = $(this).attr("data-link");
            if (link != "" && link != null) {
                var getter = $.get(link);
                setLoading(true);
                var startTime = new Date().getTime();
                getter.done(function (data) {
                    setLoading(false);
                    var dif = 500 - (new Date().getTime() - startTime);
                    if (dif < 0) {
                        dif = 0;
                    }
                    setTimeout(function () {
                        $(".paper-drawer > div.drawer-content").html(data);
                        $(".paper-drawer").addClass("active");
                        $(".paper-header-menu-button").addClass("active");
                        $("body").trigger("drawerload", [tthis]);
                    }, dif);
                });
                getter.fail(function (xhr) {
                    setLoading(false);
                    if (xhr.status == 500) {
                        error("Server error");
                    } else if (xhr.status == 404) {
                        error("Error (404) File Not Found");
                    } else {
                        error("Connection error");
                    }
                    $("body").trigger("drawerfail", [tthis, xhr]);
                });
            }
        });

        $(window).on('popstate', function (event) {
            var selectedButton = $(".paper-drawer > ul.drawer-nav li.selected");
            var key = null;
            if (document.URL.indexOf("#") != -1) {
                key = document.URL.split("#")[1];
                if (key == "") {
                    key = null;
                }
            }
            if (key == null) {
                $(".paper-drawer").removeClass("active");
                $(".paper-header-menu-button").removeClass("active");
                selectedButton.removeClass("selected");
                $("body").trigger("drawerunload", selectedButton);
            }else{
                $(".paper-drawer > ul.drawer-nav li[data-key='" + key + "']").trigger("click", [true]);
            }
        });

    });

});
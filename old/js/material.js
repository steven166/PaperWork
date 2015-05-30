
$("body").ready(function () {
    initMaterialForms();
    initPopups();
    headerListener();
    listListener();
});

/** LIST **/

function listListener() {
    $(".paper-list div, .paper-list i").unbind("click");
    domQuery = ".paper-list .paper-list-item.expandable > .paper-list-header, .paper-list .paper-list-item.toggle > .paper-list-header";
    headers = $(domQuery).click(function () {
        header = $(this);
        parent = $(this).parent();
        ul = parent.children("ul");
        if (ul.hasClass("hidden")) {
            ul.removeClass("hidden");
        } else {
            if (!parent.hasClass("toggle")) {
                ul.addClass("hidden");
            } else if (header.hasClass("active")) {
                ul.addClass("hidden");
            }
        }

        if ($(this).parent().hasClass("toggle")) {
            $(".paper-list .paper-list-header.active").removeClass("active");
            $(this).addClass("active");

            id = $(this).parent().attr("id");
            exists = false;
            if (id.indexOf("modid_") == 0) {
                modid = id.substring(6);
                setContentPanel("data/editor/modules/mod.php?i=" + modid);
            } else if (id.indexOf("mobjectid_") == 0) {
                mobjectid = id.substring(10);
            }
        }
    });
    headers.children(".paper-list-control").click(function () {
        return false;
    });
    headers.children(".paper-list-wrap1, .paper-list-wrap2, .paper-list-wrap3, .paper-list-wrap4").children(".paper-list-control").click(function () {
        return false;
    });
}

/** HEADER **/

function headerListener() {
    $(".paper-header .paper-header-menu-right-toggle").unbind("click");
    $(".paper-header .paper-header-menu-right-toggle").click(function () {
        cmp = $(this).next(".paper-header-menu-right");
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            cmp.addClass("tmp");
            cmp.removeClass("active");
            setTimeout(function () {
                cmp.removeClass("tmp");
            }, 200);
        } else {
            $(this).addClass("active");
            cmp.addClass("tmp");
            setTimeout(function () {
                cmp.addClass("active");
                cmp.removeClass("tmp");
            }, 10);
        }
    });

    $(".paper-header .paper-header-menu-button").unbind("click");
    $(".paper-header .paper-header-menu-button").click(function () {
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

    $(window).resize(function () {
        fixHeaderHeight();
    });
    $(window).scroll(function () {
        fixHeaderHeight();
    });
    fixHeaderHeight();
}

function fixHeaderHeight() {
    h = $(window).height();
    w = $(window).width();
    if ((h < 600 && w > 600) || (h < 480 && w <= 600)) {
        $(".paper-header.auto").removeClass("large");
        $(".paper-content").removeClass("large");
        $(".paper-header.auto").css("height", "");
        $(".paper-header.auto .paper-header-content").css("margin-top", "");
        $(".paper-header.auto .paper-header-menu-button").css("top", "");
        icon = $(".paper-header.auto .icon");
        icon.css("opacity", "");
        icon.css("width", "");
        icon.css("height", "");
        icon.css("margin-right", "");
        icon.css("margin-left", "");
    } else {
        $(".paper-header.auto").addClass("large");
        $(".paper-content").addClass("large");
        if ($(window).scrollTop() == 0) {
            $(".paper-header.auto").css("height", "");
            $(".paper-header.auto .paper-header-content").css("margin-top", "");
            $(".paper-header.auto .paper-header-menu-button").css("top", "");
            icon = $(".paper-header.auto .icon");
            icon.css("opacity", "");
            icon.css("width", "");
            icon.css("height", "");
            icon.css("margin-right", "");
            icon.css("margin-left", "");
        } else {
            sTop = $(window).scrollTop();
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

/** POPUPS **/

function initPopups() {
    $(".paper-popup-action").unbind("click");
    $(".paper-popup-action").click(function () {
        var parent = $(this);
        var popup = parent.children(".paper-popup.hidden");
        if (popup.length != 0) {
            showPopup(popup, true);
        }
    });
}

function showPopup(popup, first) {
    popup.parent().before("<div class='paper-popup-overview'/>");
    popup.addClass("tmp");
    popup.removeClass("hidden");
    setTimeout(function () {
        h = popup.children("ul").height() + 20;
        popup.css("height", h + "px");
        popup.removeClass("tmp");
        if (first) {
            var overview = $(".paper-popup-overview");
            overview.unbind("click");
            overview.click(function () {
                hidePopup($(".paper-popup"));
            });
        }
    }, 10);
}

function hidePopup(popup) {
    $(".paper-popup-overview").remove();
    popup.addClass("tmp");
    setTimeout(function () {
        popup.addClass("hidden");
        popup.removeClass("tmp");
    }, 200);
}

/** FORMS **/

function initMaterialForms() {
    $(".paper-input input, .paper-input textarea").unbind("keyup");
    $(".paper-input input, .paper-input textarea").unbind("focus");
    $(".paper-input input, .paper-input textarea").unbind("blur");
    $(".paper-input input, .paper-input textarea").keyup(function () {
        $passed = validateInput(this);

        $stat = $(this).parent().children(".stat_active");
        $label = $(this).parent().children("label");
        if ($passed) {
            $stat.css("background-color", "#2196F3");
            $label.css("color", "#2196F3");
        } else {
            $stat.css("background-color", "#E87C71");
            $label.css("color", "#E87C71");
        }
    });
    $(".paper-input label").click(function () {
        $(this).next().focus();
    });
    $(".paper-input input, .paper-input textarea").focus(function () {
        $passed = validateInput(this);

        $stat = $(this).parent().children(".stat_active");
        $label = $(this).parent().children("label");
        $label.addClass("selected");
        if ($passed) {
            $stat.css("background-color", "#2196F3");
            $label.css("color", "#2196F3");
        } else {
            $stat.css("background-color", "#F44336");
            $label.css("color", "#F44336");
        }

        $stat.css("width", $stat.parent().width() - 20 + "px");
    });
    $(".paper-input input, .paper-input textarea").blur(function () {
        $(this).parent().children("label").css("color", "");
        if ($(this).val() == null || $(this).val() == "") {
            $(this).parent().children("label").removeClass("selected");
        }
        $(this).parent().children(".stat_active").css("width", "");
    });

    $(".paper-input.label input, .paper-input.label textarea").each(function () {
        if ($(this).val() == null || $(this).val() == "") {
            $(this).parent().children("label").removeClass("selected");
        } else {
            $(this).parent().children("label").addClass("selected");
        }
    });
}
;

var validateInput = function ($input) {
    $value = $($input).val();
    required = $($input).attr("required");
    $max_length = $($input).attr("max-length");
    $email = $($input)[0].type == "email";
    $youtube = false;
    $cls = $($input).attr("class");
    if ($cls != null) {
        $youtube = $cls.indexOf("ytb-field") > -1;
    }

    $passed = true;
    if (required && ($value == null || $value == "") && false) {
        $passed = false;
    }
    if ($max_length && $value != null) {
        if ($value.length > $max_length) {
            $passed = false;
        }
    }
    if ($email && $value != null) {
        var atpos = $value.indexOf("@");
        if (atpos < 1 || atpos + 1 >= $value.length) {
            $passed = false;
        }
    }

    if ($youtube) {
        if (!isValidYoutubeCode($value)) {
            $passed = false;
        }
    }

    return $passed;
};

function setButtonState(button, loading) {
    if (loading) {
        button.next().css("opacity", 0);
        if (button.children(".paper-loading").length == 0) {
            button.children("span").css("opacity", 0);
            button.append('<svg class="paper-loading small white center" style="opacity:0" viewBox="0 0 52 52"><circle class="path" cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px" /></svg>');
            setTimeout(function () {
                button.children().last().css("opacity", 1);
            }, 200);
        }
    } else {
        button.children().last().css("opacity", 0);
        setTimeout(function () {
            button.children("span").css("opacity", 1);
            button.children().last().remove();
        }, 200);
    }
}

function setButtonError(button, error) {
    button.next().html(error);
    button.next().css("opacity", 1);
}

function hideButtonError(button) {
    button.next().html("");
    button.next().css("opacity", 0);
}

/** DIALOGS **/

$THEME_INFO = 'modal-info';
$THEME_WARNING = 'modal-warning';
$THEME_ERROR = 'modal-error';
$THEME_QUESTION = 'modal-question';
$THEME_INPUT = 'modal-input';

function infoPop($action, $title, $message, $btn_ok) {
    pop($action, $THEME_INFO, $title, $message, false, $btn_ok);
}

function warningPop($action, $title, $message, $btn_cancel, $btn_ok) {
    pop($action, $THEME_WARNING, $title, $message, $btn_cancel, $btn_ok);
}

function errorPop($action, $title, $message, $btn_cancel, $btn_ok) {
    pop($action, $THEME_ERROR, $title, $message, $btn_cancel, $btn_ok);
}

function questionPop($action, $title, $message, $btn_cancel, $btn_ok) {
    pop($action, $THEME_QUESTION, $title, $message, $btn_cancel, $btn_ok);
}

function inputPop($action, $title, $value, $btn_cancel, $btn_ok, $placeholder, $required) {
    if ($value == null) {
        $value = "";
    }
    if ($placeholder == null) {
        $placeholder = "";
    }

    $message = "<form onsubmit='$(\".paper-modal .paper-modal-footer .actionbtn\").click(); return false;'>\n\
            <div class='paper-input label'>\n\
            <div class='paper-input-field'>\n\
            <label>" + $placeholder + "</label>\n\
            <input type='text' value='" + $value + "' name='modal-input'";
    if ($required) {
        $message += " required=''";
    }
    $message += ">\n\
            <div class='stat'></div>\n\
            <div class='stat_active'></div></div></form>";
    if ($btn_cancel == null) {
        $btn_cancel = "Annuleren";
    }
    if ($btn_ok == null) {
        $btn_ok = "Opslaan";
    }
    pop($action, $THEME_INPUT, $title, $message, $btn_cancel, $btn_ok);
}

function pop($action, $theme, $title, $message, $btn_cancel, $btn_ok) {
    $(".paper-modal").remove();
    $("body").append(generateModalHTML($theme, $title, $message, $btn_cancel, $btn_ok));
    setTimeout(function () {
        installListeners();
        show();
    }, 10);

    var FADE_TIME = 500;
    this.action = $action;

    var installListeners = function () {
        $(".paper-modal").click(function () {
            destroy();
        }).children().click(function () {
            return false;
        });
        $(".paper-modal .paper-modal-footer .btn-default").click(function () {
            destroy();
        });
        $(".paper-modal .paper-modal-footer .actionbtn").click(function () {
            if ($theme === $THEME_INPUT && $("input[name='modal-input']").prop('required')) {
                if ($("input[name='modal-input']").val() == null || $("input[name='modal-input']").val() === "") {
                    $("input[name='modal-input']").focus();
                    $stat = $("input[name='modal-input']").parent().children(".mat_input_stat_active");
                    $label = $("input[name='modal-input']").parent().children("label");
                    $stat.css("background-color", "#F44336");
                    $label.css("color", "#F44336");
                    return;
                }
            }
            destroy();
            if ($action && (typeof $action == "function")) {
                if ($theme === $THEME_INPUT) {
                    $action($("input[name='modal-input']").val());
                } else {
                    $action();
                }
            }
        });
        if ($theme === $THEME_INPUT) {
            initMaterialForms();
            $("input[name='modal-input']").select();
        }
    };

    var show = function () {
        $(".paper-modal").css("opacity", 1);
        $(".paper-modal").css("left", "0px");
        $(".paper-modal").css("right", "0px");
    }

    var destroy = function () {
        $(".paper-modal").css("opacity", "");
        $(".paper-modal").css("left", "");
        $(".paper-modal").css("right", "");
        setTimeout(function () {
            $(".paper-modal").remove();
        }, FADE_TIME);
    };
}

function generateModalHTML($theme, $title, $message, $btn_cancel, $btn_ok) {
    if ($theme == null) {
        $theme = $THEME_INFO;
    }
    if ($title == null) {
        $title = "Modal title";
    }
    if ($message == null) {
        $message = "One fine body...";
    }
    if ($btn_cancel == null) {
        $btn_cancel = "Annuleren";
    }
    if ($btn_ok == null) {
        $btn_ok = "Oke";
    }

    if ($theme == $THEME_INFO) {
        buttonType = "";
    } else if ($theme == $THEME_WARNING) {
        buttonType = " orange";
    } else if ($theme == $THEME_ERROR) {
        buttonType = " red";
    } else if ($theme == $THEME_QUESTION) {
        buttonType = "";
    } else if ($theme == $THEME_INPUT) {
        buttonType = "";
    } else {
        throw "Unknown theme: " + $theme;
    }

    btn_cancel_html = ($btn_cancel === false ? "" : "<button type='button' class='btn btn-default' data-dismiss='modal'>" + $btn_cancel + "</button>");
    return "<div class='paper-modal " + $theme + "'>\n\
        <div class='paper-modal-dialog'>\n\
            <div class='paper-modal-content'>\n\
                <div class='paper-modal-header'>\n\
                    <h4 class='paper-modal-title'>" + $title + "</h4>\n\
                </div>\n\
                <div class='paper-modal-body'>\n\
                    " + $message + "\n\
                </div>\n\
                <div class='paper-modal-footer" + buttonType + "'>\n\
                    " + btn_cancel_html + "\n\
                    <button type='button' class='btn actionbtn'>" + $btn_ok + "</button>\n\
                </div>\n\
            </div>\n\
        </div>\n\
    </div>";
}
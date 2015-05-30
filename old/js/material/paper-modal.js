$THEME_INFO = 'modal-info';
$THEME_WARNING = 'modal-warning';
$THEME_ERROR = 'modal-error';
$THEME_QUESTION = 'modal-question';
$THEME_INPUT = 'modal-input';

function infoPaperPop($action, $title, $message, $btn_ok) {
    paperPop($action, $THEME_INFO, $title, $message, false, $btn_ok);
}

function warningPaperPop($action, $title, $message, $btn_cancel, $btn_ok) {
    paperPop($action, $THEME_WARNING, $title, $message, $btn_cancel, $btn_ok);
}

function errorPaperPop($action, $title, $message, $btn_cancel, $btn_ok) {
    paperPop($action, $THEME_ERROR, $title, $message, $btn_cancel, $btn_ok);
}

function questionPaperPop($action, $title, $message, $btn_cancel, $btn_ok) {
    paperPop($action, $THEME_QUESTION, $title, $message, $btn_cancel, $btn_ok);
}

function inputPaperPop($action, $title, $value, $btn_cancel, $btn_ok, $placeholder, $required) {
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
        $btn_cancel = "Cancel";
    }
    if ($btn_ok == null) {
        $btn_ok = "Save";
    }
    paperPop($action, $THEME_INPUT, $title, $message, $btn_cancel, $btn_ok);
}

function paperPop($action, $theme, $title, $message, $btn_cancel, $btn_ok) {
    $(".paper-modal").remove();
    $("body").append(generatePaperModalHTML($theme, $title, $message, $btn_cancel, $btn_ok));
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
        $(".paper-modal .paper-modal-footer .d-button").click(function () {
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
        $(".paper-modal").addClass("paper-show");
    }

    var destroy = function () {
        $(".paper-modal").removeClass("paper-show");
        setTimeout(function () {
            $(".paper-modal").remove();
        }, FADE_TIME);
    };
}

function generatePaperModalHTML($theme, $title, $message, $btn_cancel, $btn_ok) {
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
        buttonType = "blue";
    } else if ($theme == $THEME_WARNING) {
        buttonType = "orange";
    } else if ($theme == $THEME_ERROR) {
        buttonType = "red";
    } else if ($theme == $THEME_QUESTION) {
        buttonType = "blue";
    } else if ($theme == $THEME_INPUT) {
        buttonType = "blue";
    } else {
        throw "Unknown theme: " + $theme;
    }

    btn_cancel_html = ($btn_cancel === false ? "" : "<button type='button' class='paper-button d-button' data-dismiss='modal'>" + $btn_cancel + "</button>");
    return "<div class='paper-modal " + $theme + "'>\n\
        <div class='paper-modal-dialog'>\n\
            <div class='paper-modal-content'>\n\
                <div class='paper-modal-header'>\n\
                    <h4 class='paper-modal-title'>" + $title + "</h4>\n\
                </div>\n\
                <div class='paper-modal-body'>\n\
                    " + $message + "\n\
                </div>\n\
                <div class='paper-modal-footer'>\n\
                    " + btn_cancel_html + "\n\
                    <button type='button' class='paper-button " + buttonType + " actionbtn'>" + $btn_ok + "</button>\n\
                </div>\n\
            </div>\n\
        </div>\n\
    </div>";
}
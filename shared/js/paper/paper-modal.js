(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-modal\' dependence on \'paper\'");
    }

    paper.modal = {

        version: 0.01,

        info: function (title, message, func, btnText) {
            paperPop(func, THEME_INFO, title, message, false, btnText);
        },

        warning: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_WARNING, title, message, cancelTxt, okText);
        },

        error: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_ERROR, title, message, cancelTxt, okText);
        },

        question: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_QUESTION, title, message, cancelTxt, okText);
        },

        input: function (title, value, placeholder, required, func, okText, cancelTxt) {
            if (value == null) {
                value = "";
            }
            if (placeholder == null) {
                placeholder = "";
            }

            var message = "<form onsubmit='$(\".paper-modal .paper-modal-footer .actionbtn\").click(); return false;'>\n\
                                <div class='paper-input paper-label'>\n\
                                <div class='paper-input-field'>\n\
                                <label>" + placeholder + "</label>\n\
                                <input type='text' value='" + value + "' name='modal-input'";
            if (required) {
                message += " required=''";
            }
            message += ">\n\
                        <div class='stat'></div>\n\
                        <div class='stat_active'></div></div></form>";
            if (cancelTxt == null) {
                cancelTxt = "Cancel";
            }
            if (okText == null) {
                okText = "Save";
            }
            paperPop(func, THEME_INPUT, title, message, cancelTxt, okText);
        },


        options: function(title, options, selectedOptions, func, cancelTxt){
            if(selectedOptions == null){
                selectedOptions = -1;
            }

            var message = "";
            for(var i = 0; i < options.length; i++){
                var checked = options[i] === selectedOptions;
                message += "<div class='paper-radio" + (checked ? " checked" : "") + "'>";
                message += '<input type="radio" name="modal-options" value="1"' + (checked ? " checked='checked'" : "") + '/>';
                message += "<div class='box-overlay wrippels'>";
                message += '<div class="box"></div>';
                message += '</div>';
                message += "<div class='paper-radio-label'>";
                message += '<h4>' + options[i] + '</h4>';
                message += '</div>';
                message += '</div>';

            }

            if (cancelTxt == null) {
                cancelTxt = "Cancel";
            }
            paperPop(func, THEME_INPUT, title, message, cancelTxt, false);
        }


    };

    var THEME_INFO = 'modal-info';
    var THEME_WARNING = 'modal-warning';
    var THEME_ERROR = 'modal-error';
    var THEME_QUESTION = 'modal-question';
    var THEME_INPUT = 'modal-input';

    function paperPop(action, theme, title, message, btnCancel, btnOk) {
        $(".paper-modal").remove();
        $("body").append(generatePaperModalHTML(theme, title, message, btnCancel, btnOk));
        setTimeout(function () {
            installListeners();
            show();
        }, 10);

        var FADE_TIME = 500;

        var installListeners = function () {
            $(".paper-modal-overlay").click(function () {
                destroy();
            });
            $(".paper-modal .paper-modal-footer .d-button").click(function () {
                destroy();
            });
            $(".paper-modal .paper-modal-footer .actionbtn").click(function () {
                if (theme === THEME_INPUT && $("input[name='modal-input']").prop('required')) {
                    if ($("input[name='modal-input']").val() == null || $("input[name='modal-input']").val() === "") {
                        $("input[name='modal-input']").focus();
                        var stat = $("input[name='modal-input']").parent().children(".mat_input_stat_active");
                        var label = $("input[name='modal-input']").parent().children("label");
                        stat.css("background-color", "#F44336");
                        label.css("color", "#F44336");
                        return;
                    }
                }
                destroy();
                if (action && (typeof action == "function")) {
                    if (theme === THEME_INPUT) {
                        action($("input[name='modal-input']").val());
                    } else {
                        action();
                    }
                }
            });
            if (theme === THEME_INPUT) {
                $("input[name='modal-input']").select();
            }
            $(".paper-modal .paper-radio").click(function(){
                var value = $(this).find("h4").html();
                destroy();
                if (action && (typeof action == "function")) {
                    if (theme === THEME_INPUT) {
                        action(value);
                    } else {
                        action();
                    }
                }
            });
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

    function generatePaperModalHTML(theme, title, message, btnCancel, btnOk) {
        if (theme == null) {
            theme = THEME_INFO;
        }
        if (title == null) {
            title = "Modal title";
        }
        if (message == null) {
            message = "One fine body...";
        }
        if (btnCancel == null) {
            btnCancel = "Cancel";
        }
        if (btnOk == null) {
            btnOk = "Ok";
        }

        var buttonType;
        if (theme == THEME_INFO) {
            buttonType = "blue";
        } else if (theme == THEME_WARNING) {
            buttonType = "orange";
        } else if (theme == THEME_ERROR) {
            buttonType = "red";
        } else if (theme == THEME_QUESTION) {
            buttonType = "blue";
        } else if (theme == THEME_INPUT) {
            buttonType = "blue";
        } else {
            throw "Unknown theme: " + theme;
        }

        var btn_cancel_html = (btnCancel === false ? "" : "<button type='button' class='paper-button wrippels d-button' data-dismiss='modal'>" + btnCancel + "</button>");
        var btn_ok_html = (btnOk === false ? "" : "<button type='button' class='paper-button wrippels " + buttonType + " actionbtn'>" + btnOk + "</button>");
        return "<div class='paper-modal " + theme + "'>\n\
                    <div class='paper-modal-overlay'></div>\n\
                    <div class='paper-modal-dialog'>\n\
                        <div class='paper-modal-content'>\n\
                            <div class='paper-modal-header'>\n\
                                <h4 class='paper-modal-title'>" + title + "</h4>\n\
                            </div>\n\
                            <div class='paper-modal-body'>\n\
                                " + message + "\n\
                            </div>\n\
                            <div class='paper-modal-footer'>\n\
                                " + btn_cancel_html + "\n\
                                " + btn_ok_html + "\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>";
    }

})();


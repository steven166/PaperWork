
(function () {

    $("body").ready(function () {
        $("body").on("keyup", ".paper-input input, .paper-input textarea", function () {
            var passed = validatePaperInput(this);

            var stat = $(this).parent().children(".stat_active");
            var label = $(this).parent().children("label");
            if (passed) {
                stat.css("background-color", "#2196F3");
                label.css("color", "#2196F3");
            } else {
                stat.css("background-color", "#E87C71");
                label.css("color", "#E87C71");
            }
        });

        $("body").on("focus", ".paper-input input, .paper-input textarea", function () {
            var passed = validatePaperInput(this);

            var stat = $(this).parent().children(".stat_active");
            var label = $(this).parent().children("label");
            label.addClass("selected");
            if (passed) {
                stat.css("background-color", "#2196F3");
                label.css("color", "#2196F3");
            } else {
                stat.css("background-color", "#F44336");
                label.css("color", "#F44336");
            }

            stat.css("width", stat.parent().width() - 20 + "px");
        });

        $("body").on("change focus", ".paper-input select", function () {
            var stat = $(this).parent().children(".stat_active");
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
            stat.css("background-color", "#2196F3");
            label.css("color", "#2196F3");
            stat.css("width", stat.parent().width() - 20 + "px");
        });

        $("body").on("blur", ".paper-input input, .paper-input textarea", function () {
            $(this).parent().children("label").css("color", "");
            if ($(this).val() == null || $(this).val() == "") {
                $(this).parent().children("label").removeClass("selected");
            }
            $(this).parent().children(".stat_active").css("width", "");
        });
        
        $("body").on("blur", ".paper-input select", function(){
            $(this).parent().children("label").css("color", "");
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
            $(this).parent().children(".stat_active").css("width", "");
        });

        $(".paper-input.paper-label input, .paper-input.paper-label textarea").each(function () {
            if ($(this).val() == null || $(this).val() == "") {
                $(this).parent().children("label").removeClass("selected");
            } else {
                $(this).parent().children("label").addClass("selected");
            }
        });

        $(".paper-input").each(function () {
            if ($(this).children(".stat").length == 0) {
                $(this).append("<div class='stat'></div>");
            }
            if ($(this).children(".stat_active").length == 0) {
                $(this).append("<div class='stat_active'></div>");
            }
        });
    });

    function validatePaperInput(input) {
        var value = $(input).val();
        var required = $(input).attr("required");
        var max_length = $(input).attr("max-length");
        var email = $(input)[0].type == "email";
        var youtube = false;
        var cls = $(input).attr("class");
        if (cls != null) {
            youtube = cls.indexOf("ytb-field") > -1;
        }

        var passed = true;
        if (required && (value == null || value == "") && false) {
            passed = false;
        }
        if (max_length && value != null) {
            if (value.length > max_length) {
                passed = false;
            }
        }
        if (email && value != null) {
            var atpos = value.indexOf("@");
            if (atpos < 1 || atpos + 1 >= value.length) {
                passed = false;
            }
        }

        if (youtube) {
            if (!isValidYoutubeCode(value)) {
                passed = false;
            }
        }

        return passed;
    }

})();
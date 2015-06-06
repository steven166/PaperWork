
(function () {

    paper.form = {

        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-input")){
                if(e.children(".stat").length === 0){
                    e.append("<div class='stat'></div>");
                }
                if(e.children(".stat-active").length === 0){
                    e.append("<div class='stat-active'></div>");
                }
                if(e.children("label").length > 0){
                    e.addClass("paper-label");
                }
            }else{
                e.find(".paper-input").each(function(){
                    paper.form.init(this);
                });
            }
        }

    }

    $("body").ready(function () {
        $("body").on("keyup, focus", ".paper-input input, .paper-input textarea", function () {
            var passed = validatePaperInput(this);
            if(passed){
                $(this).parent().removeClass("danger");
            }else{
                $(this).parent().addClass("danger");
            }
        });

        $("body").on("blur", ".paper-input.paper-label input, .paper-input.paper-label textarea", function () {
            var val = $(this).val();
            if(val === "" || val === null){
                $(this).parent().children("label").removeClass("selected");
            }else{
                $(this).parent().children("label").addClass("selected");
            }
        });

        $("body").on("click", ".paper-input.paper-label label", function(){
            $(this).parent().children("input, textarea, select").focus();
        });

        $("body").on("change focus", ".paper-input select", function () {
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
            $(this).removeClass("danger");
        });
        
        $("body").on("blur", ".paper-input select", function(){
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
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
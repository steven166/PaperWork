app.activity("download-builder", new function(){

    $("body").on("click", "#e-download-builder .project-color div", function(){
        var tthis = this;
        $(tthis).parent().children(".selected").removeClass("selected").html("");
        $(tthis).addClass("selected").html('<i class="mdi-navigation-check"></i>');
        var clss = $(tthis).attr("class");
        clss = clss.replace("selected", "").replace("wrippels", "").trim();
        app.setTheme(clss);
        $("#e-download-builder #selected-theme").html(paper.toNormalText(clss));
    });

    $("body").on("change", "#e-download-builder #check-build", function(){
        var height = $("#e-download-builder .project-settings").height();
        $("#e-download-builder .project-settings-wrapper").css("height", height + "px");
        if(!$(this).hasClass("checked")){
            setTimeout(function(){
                $("#e-download-builder input[name='project-name']").removeAttr("required");
                $("#e-download-builder .project-settings-wrapper").css("height", 0);
            }, 20);
        }else{
            $("#e-download-builder input[name='project-name']").attr("required", "true");
            $("#e-download-builder input[name='project-name']").focus();
        }
    });

    $("body").on("click", "#e-download-builder #submit-button", function(){
        $("#e-download-builder form #hide-submit-button").click();
    });

    this.onVisible = function(){
        $("#e-download-builder input[name='project-name']").attr("required", "true");
        $("#e-download-builder input[name='project-name']").focus();
    };

});
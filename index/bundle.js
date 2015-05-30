(function(){
var app = paper.app.create(false, "green", "paperwork");app.activity("download-builder", new function(){

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

});app.activity("get-started", new function(){

});app.activity("index", new function(){

    this.actions = [
        {
            id: "language-button",
            icon: "mdi-action-language",
            showAsAction: "always"
        }
    ];

    $("body").on("click", "#e-index #github-button", function(){
        setTimeout(function(){
            window.open("https://github.com/steven166/PaperWork", "_black");
        }, 200);
    });

    $("body").on("click", "#e-index #download-button", function(){
        setTimeout(function(){
            app.goToGroup("download");
        }, 200);
    });

    $("body").on("click", "#e-index #get-started-button", function(){
        setTimeout(function(){
            app.goToGroup("get-started");
        }, 200);
    });

    $("body").on("click", "#a-index #language-button", function(){
        paper.modal.options("Language", ["Engels", "Nederlands"], "Engels", function(){}, "Cancel");
    });

    this.onVisible = function(){
        if(sessionStorage.getItem("firsttime") !== "true"){
            setTimeout(function(){
                $("#e-index .index-title").removeClass("fade");
            }, 500);
            setTimeout(function(){
                $("#e-index .index-title .paper-icon").eq(2).removeClass("fade");
            }, 700);
            setTimeout(function(){
                $("#e-index .index-title .paper-icon").eq(1).removeClass("fade");
            }, 900);
            setTimeout(function(){
                $("#e-index .index-title .paper-icon").eq(0).removeClass("fade");
            }, 1100);
            setTimeout(function(){
                $("#e-index article").removeClass("fade");
                $("#e-index .index-title h2").removeClass("fade");
                sessionStorage.setItem("firsttime", "true");
            }, 1500);
        }else{
            $("#e-index .fade").removeClass("fade");
        }
    };

});app.group("home", new function(){
    this.activity_1 = "index";
    this.activity_1_type = "large";
});

app.group("download", new function(){
    this.color = "blue";
    this.title = "@+download+@";
    this.leftAction = "back";
    this.activity_1 = "download-builder";
    this.activity_1_type = "large";
});

app.group("get-started", new function(){
    this.color = "green";
    this.title = "@+get-started+@";
    this.leftAction = "back";
    this.activity_1 = "get-started";
});

app.init();
})();
app.activity("index", new function(){

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

});
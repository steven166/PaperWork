$("body").ready(function(){
    installPaperListListener();
});

function installPaperListListener() {
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
        }
    });
    headers.children(".paper-list-control").click(function () {
        return false;
    });
    headers.children(".paper-list-wrap1, .paper-list-wrap2, .paper-list-wrap3, .paper-list-wrap4").children(".paper-list-control").click(function () {
        return false;
    });
}
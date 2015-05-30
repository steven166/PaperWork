
$("body").ready(function(){
    installPaperPopupListener();
});

function installPaperPopupListener() {
    $(".paper-popup-action").unbind("click");
    $(".paper-popup-action").click(function () {
        var parent = $(this);
        var popup = parent.children(".paper-popup.hidden");
        if (popup.length != 0) {
            showMDPopup(popup, true);
        }
    });
}

function showMDPopup(popup, first) {
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
                hideMDPopup($(".paper-popup"));
            });
        }
    }, 10);
}

function hideMDPopup(popup) {
    $(".paper-popup-overview").remove();
    popup.addClass("tmp");
    setTimeout(function () {
        popup.addClass("hidden");
        popup.removeClass("tmp");
    }, 200);
}
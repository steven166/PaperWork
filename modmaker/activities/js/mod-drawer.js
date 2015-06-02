app.activity("mod-drawer", new function(){

    var testData = [
        {id: 1, title: "Fight Till Death"},
        {id: 2, title: "Test Mod"},
        {id: 3, title: "Other Mod"},
        {id: -1, title: "Login", topBorder: true},
        {id: -2, title: "Settings"}
    ];

    this.onCreate = function(eActivity) {
        var listHead = $("<div class='drawer-head'></div>").appendTo(eActivity);
        listHead.css("background-image", "url(moviewatcher/images/wallpaper.jpg)");
        var listContainer = $("<div class='drawer-container'></div>").appendTo(eActivity);

        var list = paper.list.create(listContainer, function (li, item, isHeader) {
            if (isHeader) {
                li.addClass("header");
                li.html(item);
            } else {
                li.addClass("wrippels");
                li.html(item.title);
                li.attr("data-key", item.id);
                if(item.topBorder === true){
                    li.addClass("sep-top");
                }
            }
        });

        list.render(testData);


    };
});
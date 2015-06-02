app.group("home", new function(){
    this.leftAction = "menu";
    this.activity_1 = "index-panel";
    this.activity_2_type = "medium";
    this.drawer = "index-drawer";
});

app.group("settings", new function(){
    this.color = "blue-gray";
    this.title = "@+settings+@";
    this.leftAction = "back";
    this.activity_1 = "settings";
});

app.group("watchlist", new function(){
    this.color = "teal";
    this.title = "Watchlist";
    this.leftAction = "back";
    this.activity_1 = "watchlist";
    this.activity_2_type = "medium";
});

app.init();
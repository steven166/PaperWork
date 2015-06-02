
app.group("home", new function(){
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
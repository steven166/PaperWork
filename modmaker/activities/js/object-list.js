
app.activity("object-list", new function(){

    var testData = {
        "Blocks":[
            {id: 1, author: "Deathlykiller", title:"Block 1"},
            {id: 2, author: "Deathlykiller", title:"Block 2"},
            {id: 3, author: "Deathlykiller", title:"Block 3"},
            {id: 4, author: "Deathlykiller", title:"Block 4"},
            {id: 5, author: "Deathlykiller", title:"Block 5"}
        ],
        "Items":[
            {id: 1, author: "Deathlykiller", title:"Item 1"},
            {id: 2, author: "Deathlykiller", title:"Item 2"},
            {id: 3, author: "Deathlykiller", title:"Item 3"},
            {id: 4, author: "Deathlykiller", title:"Item 4"},
            {id: 5, author: "Deathlykiller", title:"Item 5"}
        ],
        "Recipies":[
            {id: 1, author: "Deathlykiller", title:"Block 1"},
            {id: 2, author: "Deathlykiller", title:"Block 2"},
            {id: 3, author: "Deathlykiller", title:"Block 3"},
            {id: 4, author: "Deathlykiller", title:"Block 4"},
            {id: 5, author: "Deathlykiller", title:"Block 5"}
        ]
    };

    this.onCreate = function(eActivity){

        var list = paper.list.create(eActivity, function(li, item, isHeader){
            if(isHeader){
                li.addClass("header").addClass("sep-top");
                li.html(item);
            }else{
                li.attr("data-key", item.id);
                li.addClass("wrippels").addClass("push-left");
                li.addClass("medium");

                $("<div class='title main'>" + item.title + "</div>").appendTo(li);
                $("<div class='title sub'><b>" + item.author + "</b></div>").appendTo(li);
            }
        });

        list.render(testData);

    };

});
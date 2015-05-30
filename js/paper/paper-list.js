(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper\'");
    }

    /**
     * Material List Framework
     * @type {{version: number, create: Function}}
     */
    paper.list = {

        version: 0.01,

        create: function(element, render){
            return new List(element, render);
        }

    };

    function List(element, render){
        this.element = $(element);
        this.renderFunction = render;
    }

    List.prototype.setRender = function(func){
        this.renderFunction = func;
    };

    List.prototype.append = function(array, timeout){
        var tthis = this;
        if(this.element.children(".paper-list").length == 0){
            $("<ul></ul>").addClass("paper-list").appendTo(this.element);
        }
        var eList = this.element.children(".paper-list");
        doRender(tthis, eList, array, timeout);
    };

    List.prototype.render = function(array, timeout){
        var tthis = this;
        if(this.element.children(".paper-list").length == 0){
            $("<ul></ul>").addClass("paper-list").appendTo(this.element);
        }
        var eList = this.element.children(".paper-list");
        if(eList.children().length > 0){
            eList.children().addClass("fade");
            setTimeout(function(){
                eList.children().remove();
                doRender(tthis, eList, array, timeout);
            }, 200);
        }else{
            doRender(tthis, eList, array, timeout);
        }
    };

    function doRender(list, eList, array, timeout){
        if(Array.isArray(array)){
            for(var i = 0; i < array.length; i++){
                var li = $("<li></li>");
                var ret = list.renderFunction(li, array[i], false);
                if(ret !== false) {
                    li.addClass("fade");
                    li.appendTo(eList);
                }
            }
        }else if(!isNumeric(array)){
            for(var key in array){
                var li = $("<li></li>");
                var ret = list.renderFunction(li, key, true);
                if(ret !== false) {
                    li.addClass("fade");
                    li.appendTo(eList);
                }
                var subArray = array[key];
                for(var i = 0; i < subArray.length; i++){
                    var li2 = $("<li></li>");
                    var ret = list.renderFunction(li2, subArray[i], false);
                    if(ret !== false) {
                        li2.addClass("fade");
                        li2.appendTo(eList);
                    }
                }
            }
        }else{
            throw "Can only render arrays and associative arrays";
        }

        var t = 70;
        if(typeof(timeout) !== "undefined"){
            t = timeout;
        }

        setTimeout(function(){
            var interval = setInterval(function(){
                eList.children(".fade").first().removeClass("fade");
                if(eList.children(".fade").length == 0){
                    clearInterval(interval);
                }
            }, t);
        }, 20);

    }

    function isNumeric(obj) {
        try {
            return (((obj - 0) == obj) && (obj.length > 0));
        } catch (e) {
            return false;
        }
    }

})();
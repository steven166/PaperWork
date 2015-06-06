(function(){

    paper.progress = {

        /**
         * Find and initialze 'paper-progress' elements
         * @param element - rootElement to initialize (default is body)
         */
        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-progress")){
                if(e.find(".container").length === 0){
                    e.append("<div class='container'></div>");
                }
                if(e.find(".bar").length === 0){
                    e.append("<div class='bar'></div>");
                }
                paper.progress.update(e);
            }else{
                e.find(".paper-progress").each(function(){
                    paper.progress.init($(this));
                });
            }
        },

        /**
         * Update paper-progress, check new value and type
         * @param element - rootElement to update (default is body)
         * @param value - new value (0 - 100)
         */
        update: function(element, value){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-progress")){
                var type = "determinate";
                var attr = e.attr("type");
                if(attr === "indeterminate"){
                    type = attr;
                }else if(attr === "reverse-indeterminate"){
                    type = attr;
                }else {
                    e.attr("type", attr);
                    var v = value;
                    if (typeof(value) !== "undefined") {
                        e.attr("value", value);
                    } else {
                        v = e.attr("value");
                    }
                    if (typeof(v) === "undefined") {
                        v = 0;
                    }
                    try {
                        v = parseInt(v);
                    } catch (e) {
                        v = 0;
                    }
                    if (v > 100) {
                        v = 100;
                    }
                    v = 100 - v;
                    e.find(".bar").css("right", v + "%");
                }
            }else{
                e.find(".paper-progress").each(function(){
                    paper.progress.update($(this));
                });
            }
        }

    };



})();

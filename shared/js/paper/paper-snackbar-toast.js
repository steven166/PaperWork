
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-snackbar-toast\' dependence on \'paper\'");
    }

    $("body").on("click", ".paper-toast, .paper-snackbar", function(){
        var tthis = this;
        $(tthis).addClass("fade");
        setTimeout(function(){
            $(tthis).remove();
        }, 200);
    });

    /**
     * Material Snackbar and Toast Framework
     * @type {{version: number}}
     */
    paper["snackbar-toast"] = {
        version: 0.01
    };

    /**
     * Create and show snackbar
     * @param {type} msg snackbar text
     * @param {type} actionText text of the button: eg. 'Undo' or 'Dismiss'
     * @param {type} color the color of the button
     * @param {type} func when the button is clicked
     * @returns {jQuery} snackbar
     */
    paper.snackbar = function(msg, actionText, color, func){
        if(msg == null || msg == ""){
            throw "Can't create empty snackbar";
        }

        if($(".paper-snackbar").length > 0){
            var oldSnack = $(".paper-snackbar").addClass("fade");
            setTimeout(function(){
                oldSnack.remove();
            }, 200);
        }

        var html = "<div class='paper-snackbar fade'><span>" + msg + "</span>";

        if(actionText && color){
            var cls = "";
            var styls = "";
            cls = " class='fg-" + color + "'";
            html += "<button" + cls + styls + ">" + actionText + "</button>";
            if(typeof(func) !== 'function'){
                throw "Second argument should be a function";
            }
        }
        html += "</div>";
        var snackbar = $(html).appendTo($("body"));
        setTimeout(function(){
            snackbar.removeClass("fade");
            $(snackbar).children("button").click(function(){
                if(typeof(func) !== 'function'){
                    func();
                }
            });
        }, 20);
        return $(snackbar);
    };

    /**
     * Create and show toast
     * @param {type} msg toast test
     * @param {type} hideTimeout timeout to fadeout (null == never)
     * @returns {jQuery} toast
     */
    paper.toast = function(msg, hideTimeout){
        if(msg == null || msg == ""){
            throw "Can't create empty toast";
        }

        if($(".paper-toast").length > 0){
            var oldToast = $(".paper-toast").addClass("fade");
            setTimeout(function(){
                oldToast.remove();
            }, 200);
        }

        var html = "<div class='paper-toast fade'><span>" + msg + "</span></div>";
        var toast = $(html).appendTo($("body"));
        setTimeout(function(){
            toast.removeClass("fade");
            if(hideTimeout !== null){
                if(!hideTimeout){
                    hideTimeout = 3000;
                }
                setTimeout(function(){
                    $(toast).click();
                }, hideTimeout);
            }
        }, 20);

        return $(toast);
    };

})();
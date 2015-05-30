
$(function(){
    
    $("body").on("click", ".paper-snackbar, .paper-snackbar", function(){
        var tthis = this;
        $(this).pp_fadeOut(300, function(){
            $(tthis).remove();
        });
    });
    
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
            $(".paper-snackbar").pp_fadeOut(100);
        }
        
        var html = "<div class='paper-snackbar hide align bottom ani-short'><span>" + msg + "</span>";
        
        if(actionText && color){
            var cls = "";
            var styls = "";
            if(paper.isPredefined(color)){
                cls = " class='fg-" + color + "'";
            }else{
                styls = " style='color: " + color + "'";
            }
            html += "<button" + cls + styls + ">" + actionText + "</button>";
            if(typeof(func) !== 'function'){
                throw "Second argument should be a function";
            }
        }
        html += "</div>";
        var snackbar = $(html).appendTo($("body"));
        $(snackbar).pp_fadeIn(300);
        setTimeout(function(){
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
            $(".paper-toast").pp_fadeOut(100);
        }
        
        var html = "<div class='paper-toast hide align bottom ani-short'><span>" + msg + "</span></div>";
        var toast = $(html).appendTo($("body"));
        $(toast).pp_fadeIn(300);
        if(hideTimeout !== null){
            if(!hideTimeout){
                hideTimeout = 5000;
            }
            setTimeout(function(){
                $(toast).click();
            }, hideTimeout);
        }
        
        return $(toast);
    };
    
});
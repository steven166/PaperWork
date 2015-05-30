$("body").ready(function () {
    installCheckboxListeners();
});
    
function installCheckboxListeners(){
    $(".paper-checkbox, .paper-checkbox .box-overlay, .paper-checkbox .box").bind("click touchend", function () {
        if (typeof ($(this).children("input").attr("checked")) !== "undefined") {
            $(this).children("input").removeAttr("checked")
            $(this).removeClass("checked");
        } else {
            $(this).children("input").attr("checked", true);
            $(this).addClass("checked");
        }
    });
    
    $(".paper-radio, .paper-radio .box-overlay, .paper-radio .box").bind("click touchend", function () {
        $("input[name='" + $(this).children("input").attr("name") + "']").removeAttr("checked");
        $("input[name='" + $(this).children("input").attr("name") + "']").parent().removeClass("checked");
        if (!(typeof ($(this).children("input").attr("checked")) !== "undefined")){
            $(this).children("input").attr("checked", true);
            $(this).addClass("checked");
        }
    });
    
    $(".paper-radio input[type='radio']").each(function(){
        if($(this).prop("checked")){
            $(this).parent().click();
        }
    });
    $(".paper-radio.checked input[type='radio']").each(function(){
        if(!$(this).prop("checked")){
            $(this).parent().click();
        }
    });
}
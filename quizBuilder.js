var gameElements = $("#gameElements");

gameElements.on("input", ".optionText", optionError);

function optionError(){
    if ($(this).val() == "") {
        $(this).addClass("is-invalid");
        $(this).parent().find(".txtOptionError").show();
    } else {
        $(this).removeClass("is-invalid");
        $(this).parent().find(".txtOptionError").hide();
    }
}


gameElements.on("input", ".questionText", questionError); 

function questionError(){
    if ($(this).val() == "") {
        $(this).addClass("is-invalid");
        $(this).siblings(".txtError").show();
    } else {
        $(this).removeClass("is-invalid");
        $(this).siblings(".txtError").hide();
    }
}
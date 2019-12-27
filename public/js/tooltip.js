function simple_tooltip(name, new_id, text){
    $("#" + new_id).remove();
    $("body").append("<span class='"+name+"' id='"+ new_id +"' opened = '0'><p>" + text + "</p></span>");
}

$(document).ready(function(){
    $("#mainContainer").on("mouseleave", "[id ^= address-]", function() {
        var my_tooltip = $("#addr_tip_" + $(this).attr("id").substr(8));
            my_tooltip.fadeOut(200);
    });

    $("#mainContainer").on("mouseenter", "[id ^= address-]", function() {
        var my_tooltip = $("#addr_tip_" + $(this).attr("id").substr(8));
        my_tooltip.css({
            display: "none",
            opacity: 0.6,
            left: $(this).offset().left + $(this).closest("div").outerWidth() / 2 - my_tooltip.outerWidth() / 2,
            top: $(this).offset().top + $(this).outerHeight() + 4,
        }).fadeIn(200);
    });
});
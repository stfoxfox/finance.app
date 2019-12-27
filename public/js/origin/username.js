/**
 * Created by KonstruktorUser-1 on 14.11.2016.
 */
/*if name is to long, text scroll script*/
$(document).ready(function(){
    var span = $("#username");
    var div = $(".user-name");
    if (div.innerWidth() == '300px' && span.innerWidth() > div.innerWidth()) {
        var sl;
        setInterval(function () {
            sl = div.scrollLeft();
            div.scrollLeft(div.scrollLeft() + 1);
            if (sl == div.scrollLeft()) {
                div.scrollLeft(0);
            }
        }, 85);
    }
});
/*if title is to long, text scroll script*/
$(document).ready(function(){
    var span = $("#bigtitle");
    var div = $(".bigtitle");
    if (span.innerWidth() > div.innerWidth()) {
        var sl;
        setInterval(function () {
            sl = div.scrollLeft();
            div.scrollLeft(div.scrollLeft() + 1);
            if (sl == div.scrollLeft()) {
                div.scrollLeft(0);
            }
        }, 85);
    }
});
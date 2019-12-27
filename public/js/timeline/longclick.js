$.fn.longclick = function(ms, callback){
    var timeout;
    var flag = false;
    var locked = false;

    $(this).on("mousedown touchstart", function(e){
        if(locked) return;
        locked = true;
        flag = true;
        var closure = $(this);
        timeout = setTimeout(function () {
            clearTimeout(timeout);
            if(flag == true) {
                callback.apply(closure, [e]);
            }
            locked = false;
            flag = false;
        }, ms)
    }).on("touchend mouseup", function(){
        clearTimeout(timeout);
        locked = false;
        flag = false;
    });
};

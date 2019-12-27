$(document).ready(function() {
    $.views.settings.allowCode(true);

    $.views.tags({
        build: function rec(array){
            if(array) {
                var res = "";
                $.each(array, function (key, value) {
                    if(value) {
                        if(value.pAvailable != undefined && value.pAvailable == false) return "";

                        value.pType = value.pType != undefined ? value.pType : "template";
                        switch (value.pType) {
                            case "template":
                                res += $.templates("#" + key).render(value.pData);
                                break;
                            case "element":
                                var element = document.createElement(key);
                                if(value.pAttrs){
                                    $.each(value.pAttrs, function (attr_name, attr_value) {
                                        $(element).attr(attr_name, attr_value);
                                    });
                                }
                                if(value.pChilds){
                                    for(var i = 0; i < value.pChilds.length; i++)
                                    $(element).append(rec(value.pChilds[i]));
                                }
                                res += $('<div/>').append($(element)).html();
                                break;
                            default:
                                res += array;
                                break;
                        }
                    }
                });
                return res;
            }
        },
        deep:function(tmpl_id, data){
            return $(tmpl_id).render(data);
        }
    });
});


function kDropdown(el,elements){
    this.el = el;
    this.elements = elements;
    this.Init();
}

kDropdown.prototype.Init = function(elements) {
    if(elements) this.elements = elements;
    var dropHtml = $('#kSelectDrop').render({
        elements:this.elements
    });

    $(this.el).html(dropHtml);
    this.initHandlers();
}

kDropdown.prototype.initHandlers = function () {
    var element = this.el;
    $(element).find('.konstruktorDropDown .ddScroll').scrollbar();
    $(element).find('.konstruktorDropDown .active').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(element).find(".konstruktorDropDown .elList").slideToggle('fast');
        var kDD = $(element).find(".konstruktorDropDown");
        if ($(kDD).hasClass("opened")) {
            $(kDD).removeClass("opened");
        }
        else {
            $(kDD).addClass("opened");
        }
    });
    var i = 0;
    var closure = this;
    $(element).find('li').each(function () {
        for (var j in closure.elements[i].ddHandler) {
            if (closure.elements[i].ddHandler.hasOwnProperty(j)) {
                for (var f in closure.elements[i].ddHandler[j]) {
                    if (closure.elements[i].ddHandler[j].hasOwnProperty(f)) {
                        $(this).on(j, closure.elements[i].ddHandler[j][f]);
                    }
                }
            }
        }
        i++;
    });
}


function setTitle(el,title,prefix) {
    var parent = $(el).closest('.konstruktorDropDown');
    $('.ddChoosed', parent).html('');
    if (prefix) {
        $('.ddPrefix', parent).html(prefix);
        $('.ddChoosed', parent).html('«'+ title + '»');
    }
    else {
        $('.ddPrefix', parent).html(title);
        $('.ddChoosed', parent).html('');
    }
    $('.elList',parent).slideToggle('fast');
    if($(parent).hasClass("opened"))
    {
        $(parent).removeClass("opened");
    }
    else
    {
        $(parent).addClass("opened");
    }

}
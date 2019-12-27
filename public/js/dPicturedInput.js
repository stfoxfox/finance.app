    $.fn.appendAttr = function(attrName, suffix) {
        this.attr(attrName, function(i, val) {
            if(val)
                return val + " " + suffix;
            else
                return suffix;
        });
        return this;
    };

    function dPicturedInput(selector, options){
        this.element = selector;
        this.settings = $.extend( {
            'parent-attrs': {},
            'icon-attrs': {},
            'input-attrs':{
                'name' : 'myevent',
                'type' : 'text'
            }
        }, options);

        this.init();
    }

    dPicturedInput.prototype.init = function(){
        var dParent = document.createElement("div");
        var glyph = document.createElement("i");
        var mainContainer = document.createElement("span");
        var inputField = document.createElement("input");
        var hiddenText = document.createElement("span");

        $(dParent).addClass("dPIParent");
        $(mainContainer).addClass("dPIContainer");
        $(inputField).addClass("dPIInput");
        $(hiddenText).addClass("dPIHiddenText");
        $(glyph).addClass("dPIGlyph");

        for (var i in this.settings['parent-attrs'])
        {
            $(dParent).appendAttr(i, this.settings['parent-attrs'][i]);
        }

        for (var i in this.settings['icon-attrs'])
        {
            $(glyph).appendAttr(i, this.settings['icon-attrs'][i]);
        }

        for (var i in this.settings['input-attrs'])
        {
            $(inputField).appendAttr(i, this.settings['input-attrs'][i]);
        }

        $(dParent).append($(glyph));
        $(dParent).append($(mainContainer));
        $(mainContainer).append($(inputField));
        $(mainContainer).append($(hiddenText));

        this.element.append($(dParent));

        var closure = this;

        $(inputField).on("keyup change input propertychange", function(){
            $(hiddenText).css("font", $(inputField).css("font"));
            closure.update();
        });

        $(dParent).focus(function(){
            $(inputField).focus();
        });

        this.update();
    };

    dPicturedInput.prototype.update = function(){
        var val = this.element.find(".dPIInput").val();
        this.element.find(".dPIHiddenText").html(val);
        this.element.find(".dPIContainer").css("width", this.element.find(".dPIHiddenText").outerWidth(true) + 6);
        if(this.element.find(".dPIInput").val() == "" && this.settings["min-width"]){
            this.element.find(".dPIContainer").css("width", this.settings["min-width"]);
        }
    };
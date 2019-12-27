function konstruktorDropDown(settings) {
    if(typeof settings.ddInstance === "string") {
        this.ddInstance = $(settings.ddInstance);
    }
    else {
        this.ddInstance = settings.ddInstance;
    }

    this.ddWidth = settings.ddWidth;
    this.ddHeight = settings.ddHeight;
    this.ddBackground = settings.ddBackground;
    this.ddButtonBackground = settings.ddButtonBackground;
    this.ddButtonOnly = settings.ddButtonOnly;
    this.ddElements = settings.ddElements;
    this.ddActiveElement = settings.ddActiveElement;

    this.ddIconUrl = settings.ddIconUrl;

    this.refresh();

}

function isDefined(element){
    return element != undefined ? element : "";
}

konstruktorDropDown.prototype.refresh = function()
{
    var prefix;

    if(this.ddIconUrl != undefined){
        prefix = "<i class = 'kglyphs " + this.ddIconUrl + " ddLogo'></i>";
    }
    else{
        if(this.ddElements[this.ddActiveElement].ddPrefix != undefined){
            prefix = "<span class = 'ddPrefix'>" + this.ddElements[this.ddActiveElement].ddPrefix + "</span>";
        }
        else{
            prefix = "<span class = 'ddPrefix'></span>";
        }
    }

    var ddListStructure = '<div class = "konstruktorDropDown"><div class="active"><div class="ddBtn"> </div><span class = "ddContainer">' + prefix + '<div class = "ddChoosed">' + this.ddElements[this.ddActiveElement].ddTitle +'</div></span></div>';

    ddListStructure += "<ul class = 'elList'> <i class = 'ddUpArrow'></i>";
    for(var i = 0; i < this.ddElements.length; i++)
    {
        var elLogo = this.ddElements[i].ddElLogo != undefined ? "<span class = 'ddElLogo'>" + this.ddElements[i].ddElLogo + "</span>":"";
        var align = (this.ddElements[i].ddAlignmentClass != undefined)?this.ddElements[i].ddAlignmentClass:'';
        ddListStructure += "<div class = 'ddFlex " + align +"'>" +  elLogo + "<li onclick = '" + isDefined(this.ddElements[i].ddHandler) + "' class = '" + isDefined(this.ddElements[i].ddClassInfo) + "'>" + this.ddElements[i].ddTitle + "</li></div>"
    }
    ddListStructure += "</ul></div>";

    var founded = this.ddInstance;

    $(founded).html(ddListStructure);
    if(this.ddButtonOnly == false)
    {
        founded.find(".konstruktorDropDown .active").on('click',
            function(e){
                event.stopPropagation();
                event.preventDefault();
                founded.find(".konstruktorDropDown .elList").slideToggle('fast');
                var kDD = founded.find(".konstruktorDropDown");
                if($(kDD).hasClass("opened"))
                {
                    $(kDD).removeClass("opened");
                }
                else
                {
                    $(kDD).addClass("opened");
                }
            });
    }
    else
    {
         founded.find(".konstruktorDropDown .active .ddBtn").on('click',
            function(event){
                event.stopPropagation();
                event.preventDefault();

                founded.find(".konstruktorDropDown .elList").slideToggle('fast');

                var kDD = founded.find(".konstruktorDropDown");
                if($(kDD).hasClass("opened"))
                {
                    $(kDD).removeClass("opened");
                }
                else
                {
                    $(kDD).addClass("opened");
                }
            });
    }

    var elements = this.ddElements;

    founded.find(".konstruktorDropDown ul.elList li").each(function(i) {
        $(this).click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            var tx = $(this).html();
            founded.find(".konstruktorDropDown .elList").slideUp('fast');
            founded.find(".konstruktorDropDown .active .ddChoosed").html(tx);
            founded.find(".konstruktorDropDown .ddPrefix").html(isDefined(elements[i].ddPrefix));
            var kDD = founded.find(".konstruktorDropDown");
            $(kDD).removeClass("opened");
        });
    });

    /*$(document).on("mouseup touchend",function (e){
        var div = $(founded);
        var kDDel = founded.find(".konstruktorDropDown .elList")
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            kDDel.slideUp("fast");
            founded.find(".konstruktorDropDown").removeClass("opened");
        }
    });*/
}

$(document).ready(function(){
    jQuery.fn.extend(
        {
            DropDown : function(settings){
                return new konstruktorDropDown(settings);
            }
        });

    });




function konstruktorDropDown(settings) {
    this.ddID = "#" + settings.ddID;
    this.ddClass = "." + settings.ddClass;
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

    var founded = "";


    this.ddID != "#" ? founded = this.ddID : founded = this.ddClass;
    $(founded).html(ddListStructure);
    if(this.ddButtonOnly == false)
    {
        $(founded + " " + ".konstruktorDropDown .active").on('click',
            function(){
                $(founded + " .konstruktorDropDown .elList").slideToggle('fast');
                var kDD = $(founded + " .konstruktorDropDown");
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
        $(founded + " .konstruktorDropDown .active .ddBtn").on('click',
            function(){
                $(founded + " .konstruktorDropDown .elList").slideToggle('fast');

                var kDD = $(founded + " .konstruktorDropDown");
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

    $( founded + " .konstruktorDropDown ul.elList li").each(function(i) {
        $(this).click(function (event) {
            var tx = $(this).html();
            $(founded + " .konstruktorDropDown .elList").slideUp('fast');
            $(founded + " .konstruktorDropDown .active .ddChoosed").html(tx);
            $(founded + " .konstruktorDropDown .ddPrefix").html(isDefined(elements[i].ddPrefix));
            var kDD = $(founded + " .konstruktorDropDown");
            $(kDD).removeClass("opened");
        });
    });

    $(document).mouseup(function (e){ // событие клика по веб-документу
        var div = $(founded); // тут указываем ID элемента
        var kDDel = $(founded + " .konstruktorDropDown .elList")
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            kDDel.slideUp("fast");
            $(founded + " .konstruktorDropDown").removeClass("opened");
        }
    });
}

$(document).ready(function(){
    jQuery.fn.extend(
        {
            DropDown : function(settings){
                return new konstruktorDropDown(settings);
            }
        });
    });
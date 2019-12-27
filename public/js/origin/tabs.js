/**
 * Created by KonstruktorUser-1 on 14.11.2016.
 */
/* tabs scipt*/
(function($){
    jQuery.fn.lightTabs = function(options){

        var createTabs = function(){
            tabs = this;
            i = 0;

            showPage = function(i){
                $('.tabs-content').children("div").children("div").hide();
                $('.tabs-content').children("div").children("div").eq(i).show();
                $(tabs).children("ul").children("li").removeClass("active");
                $(tabs).children("ul").children("li").eq(i).addClass("active");
            };

            showPage(0);

            $(tabs).children("ul").children("li").each(function(index, element){
				if(typeof($(element).data('page')) === 'undefined'){
					$(element).attr("data-page", i);
					i++;
				}
            });

            $(tabs).children("ul").children("li").click(function(){
                showPage(parseInt($(this).attr("data-page")));
            });
        };
        return this.each(createTabs);
    };
})(jQuery);
$(document).ready(function(){
    $(".tabs").lightTabs();
});

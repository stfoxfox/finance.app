$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});


/*
$(function () {
	$('form input, form checkbox, form select, form radio').attr('autocomplete', 'off');

    $('*[rel="tooltip"]').tooltip()
    $('*[rel="tooltip-bottom"]').tooltip({
        placement: "bottom"
    })
    $(".time").setMask('time');

    var listItem = $('#accordion > div > div > ul > li.active').parent().parent().addClass('active-accordion')
    var Index = $('#accordion > div > div').index(listItem)
    $('#accordion > div').each(function(i){
        if (i==Index){
            $(this).accordion({active: 0, heightStyle: "content" ,collapsible: true});
        }else {
            $(this).accordion({active: false, heightStyle: "content" ,collapsible: true});
        }
    })

	$('.navbar-inner li.dropdown .dropdown-menu').hover(function(){
		$(this).closest('.navbar-inner li.dropdown').addClass('open');
	}, function(){
		$(this).closest('.navbar-inner li.dropdown').removeClass('open');
	});

    $('.date').datepicker({
        dateFormat: "dd.mm.yy",
        buttonImage: "/Icons/img/calendar.png",
        showOn: "button",
        buttonImageOnly: true,
        changeYear: true,
        changeMonth: true
    });

    $('.open-fieldset').on('click', function () {
        var content = $(this).parent().next('.fieldset-content')
        if (content.is(':visible')) {
            content.hide(200);
            $(this).children('i').removeClass('opened');
        } else {
            content.show(200);
            $(this).children('i').addClass('opened');
        }
        return false;
    })

    $('.show-popover-content').popover({
        html: true,
        placement: 'bottom',
        trigger: "hover",
        content: function () {
            return $(this).next('.popover-content').html();
        }
    });
})
function sendToPrint() {
    selectedId = new Array();
    $('input[name="gridChecked[]"]').each(function(id) {
        if ($(this).is(':checked')) {
            selectedId.push($(this).val());
        }
    })
    $('input[name="aID"]').val(selectedId.join(','));
    $('#printXls').submit();
}
String.prototype.ucFirst = function() {
	var str = this;
	if (str.length) {
		str = str.charAt(0).toUpperCase() + str.slice(1);
	}
	return str;
};
*/

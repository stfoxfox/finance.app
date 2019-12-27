$(function () {
    $('.terms-of-use input[type="checkbox"]').each(function () {
        $(this).removeAttr('checked');
        $(this).change(function () {
            if ($(this).is(':checked')) {
                $(this).parent().removeClass('checkedOut');
                $(this).parent().addClass('checkedIn');
            } else {
                $(this).parent().addClass('checkedOut');
                $(this).parent().removeClass('checkedIn');
            }
        });
        $(this).change();
    });

    //$(window).resize(function(){
    //   var terms_popup_width = $('.terms-popup').width()/2;
    //    $('.terms-popup').css({'margin-left':-terms_popup_width})
    //});
});
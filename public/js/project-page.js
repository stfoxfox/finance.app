$(function () {
    $('.title-end-under-project span').on('click', function(){
        $(this).parent().parent().find('.end-under-project-block').stop(true,false).slideToggle();
    });
});
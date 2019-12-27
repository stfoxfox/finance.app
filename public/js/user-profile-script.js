$(function() {

    $('.add-event-block .close-block').on('touchstart click', function(){
        $(this).parent().removeClass('open');
    });

    $('.row-day-events .day-calendar').on('click', function(){
       $(this).parent().parent().find('.time-line-list').stop(true,false).slideToggle('slow');
    });

});
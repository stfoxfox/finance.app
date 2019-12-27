$(function () {
    $('.group-hide-view input[type="checkbox"]').each(function(){
        $(this).change(function(){
            if($(this).is(':checked')){
                $(this).parent().removeClass('checkedOut');
                $(this).parent().addClass('checkedIn');
            }else{
                $(this).parent().addClass('checkedOut');
                $(this).parent().removeClass('checkedIn');
            }
        });
        $(this).change();
    });
    $('.group-hide-view input[type="checkbox"]').change();


    $('.gallery-add .add-video').on('click', function(){
        $('.gallery-add .drop-add-video').addClass('open');
    });
    $('.gallery-add .drop-add-video .close-block').on('click', function(){
        $('.gallery-add .drop-add-video').removeClass('open');
    });

    $('.panel-users-block .remove').on('click', function(){
        if($(this).parent().parent().hasClass('remove-open')){
            $(this).parent().parent().removeClass('remove-open');
        }else{
            $('.panel-users-block').removeClass('remove-open');
            $(this).parent().parent().addClass('remove-open');
        }
        $('.remove-button a').on('click', function(){
            $('.panel-users-block').removeClass('remove-open');
        });
        $(document).click( function(event){
            if ($(event.target).closest($('.panel-users-block')).length) return false;
                $('.panel-users-block').removeClass('remove-open');
            event.stopPropagation();
        });
    });


});
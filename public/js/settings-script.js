$(function () {
    $('select.formstyler').styler();

    //$('#tokenfield').tokenfield({
    //    autocomplete: {
    //        source: ['Jumla','pyton','Ruby','C++','CSS3','HTML5','DOTA2','Ruby - on - Rails','ModX'],
    //        delay: 100
    //    },
    //    showAutocompleteOnFocus: true,
    //    tokens: ['Jumla','Ruby','C++']
    //});

    $('.settings-input-row input[type="checkbox"]').each(function(){
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
    $('.settings-input-row input[type="checkbox"]').change();
});
//footer language script

function language_panel(){

    var page_w = $("html").width() + 17;

    var lang = $('#lang > .li_l');
    var other_lang =  $("#other_lang > .li_l");
    var mor_lang = $('.more_lang')[0];

    if(page_w > 992){

        if(lang.length > 9) {

            for (var i = 0; i < lang.length; i++) {
                if (i > 8) {
                    $("#other_lang").append(lang[i]);
                }
            }
        }

        else{

            if(other_lang.length > 0){
                other_lang.insertBefore(mor_lang);
                language_panel();
            }
        }
    }

    if(page_w <= 992){
        if(lang.length > 6) {

            for (var i = 0; i < lang.length; i++) {
                if (i > 5) {
                    $("#other_lang").append(lang[i]);
                }
            }
        }

        else{

            if(other_lang.length > 0){
                other_lang.insertBefore(mor_lang);
                language_panel();
            }
        }
    }

    if(page_w <= 767){
        if(lang.length > 5) {

            for (var i = 0; i < lang.length; i++) {
                if (i > 4) {
                    $("#other_lang").append(lang[i]);
                }
            }
        }

        else{

            if(other_lang.length > 0){
                other_lang.insertBefore(mor_lang);
                language_panel();
            }
        }
    }

}

$(document).ready(language_panel());
$(document).ready($(window).bind("resize", language_panel()));

//-----------------------------

//smile link in header (responsive)

function displacementSmile(){

    var page_w = $("html").width() + 17;
    var smile = $('#smile');
    var smile_mobile = $('#smile_mobile');
    var smile_desktop = $('#smile_desktop');

    if(page_w < 768){
        smile_mobile.prepend(smile);
    }
    else {
        smile_desktop.append(smile);
    }

}

$(document).ready(displacementSmile());
$(document).ready($(window).bind("resize", displacementSmile()));

//------------------------


//table responsive script

function table_responsive(){
    var page_w = $("html").width() + 17;
    var td1 = $(".my_table tr td:nth-child(1)");
    var td2 = $(".my_table tr td:nth-child(2)");
    var td3 = $(".my_table tr td:nth-child(3)");
    var first = $(".my_table tr td:first-child");

    var clone_td1 = td1.clone();
    var clone_td2 = td2.clone();

    if(page_w <= 767) {

        if(first.attr("class").indexOf('table-active') == -1){
            td1.empty();
            td2.empty();

            for (var i = 0; i < clone_td2.length; i++) {

                td1[i].innerHTML = clone_td2[i].innerHTML;

            }

            for (var i = 0; i < clone_td1.length; i++) {

                td2[i].innerHTML = clone_td1[i].innerHTML;

            }

            if(clone_td1.attr('class')){
                if(clone_td2.attr('class')) td2.removeClass();
                td2.addClass(clone_td1.attr('class'));
                td1.removeClass();
            }

            if(clone_td2.attr('class')){
                if(clone_td1.attr('class')) td1.removeClass();
                td1.addClass(clone_td2.attr('class') + ' table-active');
            }

            else td1.addClass('table-active');

            td3.addClass('hidden-xs');
        }

    }

    else{

        if(first.attr("class").indexOf('table-active') > -1){

            td1.empty();
            td2.empty();

            for (var i = 0; i < clone_td2.length; i++) {

                td1[i].innerHTML = clone_td2[i].innerHTML;

            }

            for (var i = 0; i < clone_td1.length; i++) {

                td2[i].innerHTML = clone_td1[i].innerHTML;

            }

            if(clone_td1.attr('class')){
                if(td2.attr('class')) td2.removeClass();
                td2.addClass(clone_td1.attr('class'));
                td1.removeClass();
                td2.removeClass('table-active');
            }
            else td2.removeClass('table-active');

            if(clone_td2.attr('class')){
                if(td1.attr('class')) td1.removeClass();
                td1.addClass(clone_td2.attr('class'));
            }

            td3.removeClass('hidden-xs');

        }

    }

}

$(document).ready(table_responsive());
$(document).ready($(window).bind("resize", table_responsive()));


function select(){
    $('.selectBox').selectator({
        prefix: 'selectator_',             // CSS class prefix
        height: 42,                    // auto or element
        useDimmer: false,                  // dims the screen when option list is visible
        useSearch: false,                   // if false, the search boxes are removed and
                                           //   `showAllOptionsOnFocus` is forced to true
        keepOpen: false,                   // if true, then the dropdown will not close when
                                           //   selecting options, but stay open until losing focus
        showAllOptionsOnFocus: false,      // shows all options if input box is empty
        selectFirstOptionOnSearch: true,   // selects the topmost option on every search
        searchCallback: function(value){}, // Callback function when enter is pressed and
                                           //   no option is active in multi select box
        labels: {
            search: ' '            // Placeholder text in search box in single select box
        }
    });
}

$(document).ready(select());
$(document).ready($(window).bind("resize", select()));
function blocks() {
    var turn = $('.turn');
    var section_info = $('.section_info');


    section_info.bind('click', function () {
        section_info.fadeIn(800);
        $(this).fadeOut(800);

        var clone1 = $(this).children('.big_block').clone();
        var clone2 = $(this).children('.last_tikets').clone();
        $('.delete').detach();

        $('.after').after(clone1.fadeIn(1000).addClass('delete').css('display', 'table'));
        $('.delete').after(clone2.fadeIn(1000).addClass('delete'));

    });


    $(document).on('click', '.turn', function () {
        $('.delete').fadeOut(1000);
        section_info.fadeIn(1000);
    });


}

$(document).ready(blocks);


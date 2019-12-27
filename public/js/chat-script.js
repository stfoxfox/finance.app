$(document).ready(function () {

    $(window).resize(function() {

        //var dialogHeight = $(window).height() - $(".bottom").height();
        //$(".dialog").height(dialogHeight);

        $('.dialog').css({'max-height':$(window).height() - $('.bottom').height()});


    });

    $('.dialog').css({'max-height':$(window).height() - $('.bottom').height()});

    //var dialogHeight = $(window).height() - $(".bottom").height();
    //$(".dialog").height(dialogHeight);

    $(".dialog").scrollTop($(".innerDialog").height() - $(".dialog").height() + 97);

});

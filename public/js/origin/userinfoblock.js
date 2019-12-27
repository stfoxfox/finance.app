$(window).resize(function() {
    if ($(window).width() < 765) {
        $('div.permission').append( $('div.user-rbac') );
    }
    else {
        $('.user-other-info .user-repost').after( $('.user-rbac') );
    }
});
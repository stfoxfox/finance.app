$(document).ready(function() {

    // возвращает cookie с именем name, если есть, если нет, то undefined
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    var cookieNotify = getCookie("notify");
    if (notifyProfile && cookieNotify != 'hide') {
        $("#menu .menu-wrapper .logo img").popover({
            content: userLocale.notifyProfile + ' <span class="glyphicons circle_remove"></span>',
            html: true,
            container: ".main-panel",
            trigger: "manual"
        });
        $("#menu .menu-wrapper .logo img").popover('show');
        $(".popover .circle_remove").click ( function() {
            $("#menu .menu-wrapper .logo img").popover('hide');
            document.cookie="notify=hide";
        });

        //resize block
        $(".main-panel-wrapper").scroll( function() {
            var coordinateY = $("#menu .menu-wrapper .logo img").offset().top;
            $(".main-panel .popover.right").offset({top: coordinateY});
        });
        $(window).resize(function() {
            console.log($("#menu .menu-wrapper .logo img"));
            var coordinateY = $("#menu .menu-wrapper .logo img").offset().top;
            $(".main-panel .popover.right").offset({top: coordinateY});
        });
    }
})

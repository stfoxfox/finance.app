$(function () {
    $('.embed-player').each(function () {
        initVideo({
            url: $(this).attr('data-movie'),
            id: $(this).attr('data-id'),
            width: $(this).attr('data-width'),
            height: $(this).attr('data-height')
        });
    });
});

var video_isplay = false;

function initVideo(options) {
    var player = $().videoPlayer({
        containerID: "embed-player-" + options.id,
        playerID: "jquery_jplayer-" + options.id,
        videoSrc: {
            m4v: options.url
        },
        size: {
            width: options.width,
            height: options.height,
            cssClass: ''
        },
        solution: "html"
    });
    player.onPlay(function () {
        $(".status_line").fadeOut(500);
        $(".status_line span").fadeOut(500);
    });
    player.onPause(function () {
        $(".status_line").fadeIn(500);
        $(".status_line span").fadeIn(500);
    });
}
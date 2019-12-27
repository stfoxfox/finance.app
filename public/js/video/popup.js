$(function () {
    $('.video-popup-btn').click(function (e) {
        e.preventDefault();
        $(".video-popup").fadeIn(300);
        initVideo($(this).attr("url-down"));
    });
});

var video_isplay = false;

function initVideo(url) {
    $(".video-popup .videoContainer").remove();
    var vid_id = "videoPlayer" + Math.floor(Math.random() * 1000);
    var player_html = $(".video_player_tpl").html();
    player_html = player_html.replace("videoPlayer", vid_id);
    $(".video-popup").append(player_html);
    var player = $().videoPlayer({
        containerID: vid_id,
        playerID: "jquery_jplayer",
        videoSrc: {
            m4v: url
        },
        size: {
            width: "100%",
            height: "367px"
        },
        solution: "html"
    });
    player.onPlay(function () {
        $(".status_line").fadeOut(500);
        $(".status_line span").fadeOut(500);
        video_isplay = true;
    });
    player.onPause(function () {
        $(".status_line").fadeIn(500);
        $(".status_line span").fadeIn(500);
        video_isplay = false;
    });
    $(".backdrop").click(function () {
        $(".video-popup").fadeOut(300);
        $(".wrapper-container").css({"z-index": "0", "position": "auto"});
        $("#header").css({"z-index": "500"});
        if ($("#" + vid_id).hasClass("jp-state-playing")) {
            $("button.jp-play").trigger("click");
        }
    });
    $("button.volume_button").on('touchend', function () {
        $(".video-popup .volume_slider_block").toggleClass("volume_slider_block_display");
    });
    $(".video-popup div.play_bar_style").on('touchend', function () {
        $(".video-popup .play_bar_style").trigger("click");
    });
}
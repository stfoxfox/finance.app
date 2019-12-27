function konstruktorPlayer(settings){
    this.containerID = "#" + settings.containerID;
    this.jplayerID = this.containerID + " #" + settings.playerID;
    this.ppButtonID = this.containerID + " .pp_button";
    this.muteVolume = false;
    this.playEvents = [];
    this.pauseEvents = [];

    $(this.jplayerID).jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", settings.videoSrc);
        },
        cssSelectorAncestor : this.containerID,
        swfPath: "jPlayer/dist/jplayer",
        solution: settings.solution,
        supplied: "webmv, ogv, m4v",
        size: settings.size,
        autohide:
        {
            full:false
        },
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: false,
        keyEnabled: true,
        remainingDuration: false,
        toggleDuration: true
    });

    this.BuildEvents();

}


function SyncGui(containerID, jplayerID, m_left, m_right)
{
    /*$(containerID).css("width", $(jplayerID).css("width"));
     SetTimeLineWidth(containerID + " .timeline_style", containerID + " .jp-gui", [containerID + " .jp-controls", containerID + " .jp-toggles", containerID + " .jp-volume-controls"], m_left, m_right);*/
}

function StartHiding(containerID, hideTimer)
{
    clearTimeout(hideTimer);
    $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
    hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
}

function ChangeVolume(event, containerID, jplayerID, volumeID, volumeMuteID){
    var seek_bar = $(containerID + ' .seek_bar_style');
    var parentHeight = parseInt(seek_bar.css("height"), 10);
    var posY;
    if(device.desktop())
    {
        posY = event.pageY;
    }
    else {
        posY = event.originalEvent.touches[0].pageY;
    }
    var childHeight = posY - seek_bar.offset().top;
    var volumePercent = (parentHeight-childHeight) / parentHeight;

    if(volumePercent > 1){
        volumePercent = 1;
    }

    if(volumePercent <= 0){
        volumePercent = 0;
        $(volumeID).addClass("volume_button_mute");
        $(volumeMuteID).removeClass("volume_button");
    }
    else
    {
        $(volumeMuteID).addClass("volume_button");
        $(volumeMuteID).removeClass("volume_button_mute");
    }

    $(jplayerID).jPlayer("volume", volumePercent);
    $(containerID + ' .play_bar_style').css("height", (volumePercent * 100) + "%");
    $(containerID + ' .play_bar_align').css("height", ((1 - volumePercent) * 100) + "%");
    return volumePercent;
}

konstruktorPlayer.prototype.onPlay = function(func){
    this.playEvents.push(func);
}

konstruktorPlayer.prototype.onPause = function(func){
    this.pauseEvents.push(func);
}

konstruktorPlayer.prototype.BuildEvents = function(){
    var playEvents = this.playEvents;
    var pauseEvents = this.pauseEvents;
    function PlayPauseHandler(event, jplayerID){
        event.preventDefault();
        var $jp = $(jplayerID);
        var status = $jp.data('jPlayer').status;
        if(status.paused) {
            for(var i = 0; i < playEvents.length; i++)
            {
                playEvents[i](event);
            }

            $jp.jPlayer('play');
        } else {
            for(var i = 0; i < pauseEvents.length; i++)
            {
                pauseEvents[i](event);
            }
            $jp.jPlayer('pause');
        }

        $(this.containerID).focus();
    }

    var jplayerID = this.jplayerID;
    var ppButtonID = this.ppButtonID;
    var containerID = this.containerID;
    var volumeID = this.containerID + ' .volume_button';
    var volumeMuteID = this.containerID + ' .volume_button_mute';
    var volumeSliderID = this.containerID + ' .volume_slider_block';
    var durationID = this.containerID + ' .jp-duration';
    var volumeChange = 0;
    var hideTimer;

    $(this.jplayerID).bind('click', function(event){
        PlayPauseHandler(event, jplayerID);
    });

    $(this.ppButtonID).bind('click', function(event){
        PlayPauseHandler(event, jplayerID);
    });

    $(this.jplayerID).bind($.jPlayer.event.play, function(event) {
        $(ppButtonID).hide();
    });

    $(this.jplayerID).bind($.jPlayer.event.pause, function(event) {
        $(ppButtonID).show();
    });

    if(device.desktop())
    {
        SyncGui(containerID, jplayerID, 20, 20);
        $(jplayerID).bind($.jPlayer.event.resize, function(event) {
            /*$(containerID + " .timeline_style").css("width", "75%");
             var str = 'SyncGui("'+containerID+'"," ' + jplayerID+ '", ' + 20 + ', ' + 20 + ')';
             setTimeout(str, 100);*/
        });

        $(this.containerID).keyup(function(e){

            if((e.keyCode ? e.keyCode : e.which) == 32){
                e.preventDefault();
                $(containerID + ' #pp_button').click();
            }
        });

        $(volumeID).click(
            function(event){
                event.preventDefault();
                var status = $(jplayerID).data('jPlayer').options;

                if(status.muted == false)
                {
                    $(volumeID).addClass("volume_button_mute");
                    $(volumeID).removeClass("volume_button");
                }
                else
                {
                    $(volumeMuteID).addClass("volume_button");
                    $(volumeMuteID).removeClass("volume_button_mute");
                }

                $(jplayerID).jPlayer("mute", !status.muted);
            }
        );



        $(volumeSliderID).mousedown(
            function(event){
                event.preventDefault();
                volumeChange = 1;
                ChangeVolume(event, containerID, jplayerID, volumeID, volumeMuteID);

                if($(jplayerID).data('jPlayer').options.volume > 0)
                {
                    $(jplayerID).jPlayer("mute", false);
                    $(volumeMuteID).addClass("volume_button");
                    $(volumeMuteID).removeClass("volume_button_mute");
                }
            }
        );

        $(volumeSliderID).mouseup(
            function(event){
                event.preventDefault();
                volumeChange = 0;
            }
        );

        $(volumeSliderID).mouseleave(
            function(){
                if(volumeChange == 1)
                {
                    $(volumeSliderID).mouseup();
                }
            }
        );

        $(volumeSliderID).mousemove(
            function(event){
                if(volumeChange == 1)
                {
                    event.preventDefault();
                    ChangeVolume(event, containerID, jplayerID, volumeID, volumeMuteID);
                    $(jplayerID).jPlayer("mute", false);
                }
            }
        );

        $(containerID).bind('mousemove', function(event) {
            clearTimeout(hideTimer);
            $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
            hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
        });

        $(durationID).bind('click', function(event) {
            SyncGui(containerID, jplayerID, 20, 20);
        });

    }else// if(device.mobile()||device.ios())
    {
        SyncGui(containerID, jplayerID, 10, 10);

        $(jplayerID).bind($.jPlayer.event.resize, function(event) {
            clearTimeout(hideTimer);
            $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
            hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
            SyncGui(containerID, jplayerID, 10, 10);
        });

        window.addEventListener("orientationchange", function(event) {
            clearTimeout(hideTimer);
            $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
            hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
            SyncGui(containerID, jplayerID, 10, 10);
        });


        window.addEventListener("resize", function(event){
            clearTimeout(hideTimer);
            $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
            hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
            SyncGui(containerID, jplayerID, 10, 10);
        });


        $(volumeSliderID).bind("touchstart",
            function(event){
                event.preventDefault();

                ChangeVolume(event, containerID, jplayerID, volumeID, volumeMuteID);

                volumeChange = 1;

                if($(jplayerID).data('jPlayer').options.volume > 0)
                {
                    $(jplayerID).jPlayer("mute", false);
                    $(volumeMuteID).addClass("volume_button");
                    $(volumeMuteID).removeClass("volume_button_mute");
                }
            }
        );

        $(volumeSliderID).bind("touchend",
            function(event){
                event.preventDefault();
                volumeChange = 0;
            }
        );


        $(volumeSliderID).bind("touchmove",
            function(event){
                if(volumeChange == 1)
                {
                    event.preventDefault();
                    ChangeVolume(event, containerID, jplayerID, volumeID, volumeMuteID);
                    $(jplayerID).jPlayer("mute", false);
                }
            }
        );

        $(containerID).bind('touchmove', function(event) {
            clearTimeout(hideTimer);
            $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
            hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
        });

        $(containerID).bind('touchend', function(event) {
            clearTimeout(hideTimer);
            $(containerID + ' .jp-gui').fadeIn(containerID + " .jp-gui").fadeIn(500);
            hideTimer = setTimeout('$("' + containerID + ' .jp-gui").fadeOut(500)', 4000);
        });

        $(durationID).bind('click', function(event) {
            SyncGui(containerID, jplayerID, 10, 10);
        });

    }


};

function GetFullWidth(name)
{
    return $(name).outerWidth(true);
}

function GetFreeSpace(parent_name, sub_names)
{
    var sum = 0;

    for(var i = 0; i < sub_names.length; i++)
    {
        sum += GetFullWidth(sub_names[i]);
    }

    return $(parent_name).outerWidth() - sum;
}

function SetTimeLineWidth(name, parent_name, sub_names, margin_left, margin_right)
{
    var space = GetFreeSpace(parent_name, sub_names) - (margin_left + margin_right);

    $(name).css("width", space-1);
    $(name).css("margin-left", margin_left);
    $(name).css("margin-right", margin_right);
}


jQuery.fn.extend({
    videoPlayer : function(settings) {
        return new konstruktorPlayer(settings);
    }
});
//Проверка данных на форме
function checkCreate(form){

    var create = true;
    var type = "";

    $(form).find('.kEventType').each(function () {
        type = $(this).val();
    });

    /*$(form).find('.kPlaceCoords').each(function () {
        if (!$(this).val())
            create = false;
    });
    $(form).find('#UserEventPlaceName').each(function () {
        if (!$(this).val())
            create = false;
    });*/
   /* $(form).find('#UserMoneyInput').each(function () {
        if (!$(this).val())
            create = false;
    });*/
  /*  if(type!='mail' && !$(form).closest('.kModalBodyContainer').hasClass('kModalChange')){
        $(form).find('#userEventSenderType').each(function () {
            if (!$(this).val())
                create = false;
            if ($(this).val() == 'user') {
                var user = false;
                $(form).find('.kUsers ul li[for_find=find]').each(function(){
                    user = true;
                });
                if (!user)
                    create = false;
            }
        });
    }
*/
    if ($(form).find('.kEmailBlock').length > 0) {
        if ($(form).find('.kEmailTag').length < 1) {
            create = false;
        }
    }
    $(form).find('#kEDTextarea').each(function () {
        if (!$(this).val())
            create = false;
    });


    var sub =  $(form).find('#kSubmit');
    if (create) {
        sub.attr('disabled',false);
        sub.removeClass("kDisabled");
    }
    else {
        sub.attr('disabled','disabled');
        sub.addClass("kDisabled");
    }
}

//Подверждение ивента
function acceptEvent(selector,type){
    var event = $(selector).closest('.kNotification');

    var ev_height = event.closest(".kEvent").outerHeight();
    var timeline = $("#kNewTimeline").Instancer();
    timeline.ScrollTo($(this).parent(), "slow");
    if(event.attr('duplicated') == "true"){
        timeline.ScrollTo("-=" + ev_height + "px", "slow");
    }

    $(".id_" + event.attr('event-id')).parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/acceptUserEvent.json", {
        id:event.attr('event-id'),
        owner_id:event.attr('owner-id'),
        type: type? "change":event.attr('type'),
        event_data:type?event.find('.kNoteEventData').val():""
    });
}
//Отмена ивента
function declineEvent(selector,type) {
    var event = $(selector).closest('.kNotification');

    var ev_height = event.closest(".kEvent").outerHeight();
    var timeline = $("#kNewTimeline").Instancer();
    timeline.ScrollTo($(this).parent(), "slow");
    if(event.attr('duplicated') == "true"){
        timeline.ScrollTo("-=" + ev_height + "px", "slow");
    }

    $(".id_" + event.attr('event-id')).parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
            done: function () {
                $(this).remove();
            }});

    $.post("/TimelineAjax/declineUserEvent.json", {
        id:event.attr('event-id'),
        type: type? "change":event.attr('type'),
        owner_id:type?event.attr('owner-id'):""
    });
}
//Удаление ивента
function deleteEvent(selector) {
    var event = $(selector).closest('.kNotification');

    var ev_height = event.closest(".kEvent").outerHeight();
    var timeline = $("#kNewTimeline").Instancer();
    timeline.ScrollTo($(this).parent(), "slow");
    if(event.attr('duplicated') == "true"){
        timeline.ScrollTo("-=" + ev_height + "px", "slow");
    }

    $(".id_" + event.attr('event-id')).parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/deleteUserEvent.json", {
        id:event.attr('event-id')
    });
}

//Подтверждение приглашения в группу
//acceptGroup
function acceptGroup(selector) {
    var event = $(selector).closest('.kNotification');
    event.parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/acceptGroup.json", {
        id:event.attr('event-id'),
        owner_id:event.attr('owner-id'),
        group_id:event.attr('group-id')
    });
}

function declineGroup(selector) {
    var event = $(selector).closest('.kNotification');
    event.parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/declineGroup.json", {
        id:event.attr('event-id'),
        group_id:event.attr('group-id'),
        owner_id:event.attr('owner-id')
    });
}

function acceptJoinGroup(selector) {
    var event = $(selector).closest('.kNotification');
    event.parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/acceptJoinGroup.json", {
        id:event.attr('event-id'),
        group_id:event.attr('group-id'),
        user_id:event.attr('owner-id')
    });
}

function declineJoinGroup(selector) {
    var event = $(selector).closest('.kNotification');
    event.parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/declineJoinGroup.json", {
        id:event.attr('event-id'),
        group_id:event.attr('group-id'),
        user_id:event.attr('owner-id')
    });
}

function acceptProject(selector) {
    var event = $(selector).closest('.kNotification');
    event.parent().css('opacity', 1)         .slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }});
    $.post("/TimelineAjax/acceptProject.json", {
        id:event.attr('event-id'),
        group_id:event.attr('group-id'),
        owner_id:event.attr('owner-id'),
        project_id:event.attr('project-id')
    });
}

function declineProject(selector) {
    var event = $(selector).closest('.kNotification');
    event.parent().css('opacity', 1).slideUp('slow').animate({ opacity: 0 },{ queue: false, duration: 'slow',
        done: function () {
            $(this).remove();
        }
    });
    $.post("/TimelineAjax/declineProject.json", {
        id:event.attr('event-id'),
        group_id:event.attr('group-id'),
        owner_id:event.attr('owner-id'),
        project_id:event.attr('project-id')
    });
}

function updateStats(){
    var stats = $(".kEventStats");
    if(stats.size() == 0) return;

    $(".kMeetingEvents>.kStatValue").html($(".kNotification[type='meet'][duplicated!='true']").size());
    $(".kCallEvents>.kStatValue").html($(".kNotification[type='call'][duplicated!='true']").size());
    $(".kSportEvents>.kStatValue").html($(".kNotification[type='sport'][duplicated!='true']").size());
    $(".kEntertaimentEvents>.kStatValue").html($(".kNotification[type='entertain'][duplicated!='true']").size());
    $(".kDocumentlEvents>.kStatValue").html($(".kNotification[type='document'][duplicated!='true']").size());
    $(".kPayEvents>.kStatValue").html($(".kNotification[type='pay'][duplicated!='true']").size());
    $(".kTaskEvents>.kStatValue").html($(".kNotification[type='task'][duplicated!='true']").size());

    $(".kRedEvents > .kStatValue").html(tData.chain("Counters", "red"));
    $(".kOrangeEvents > .kStatValue").html(tData.chain("Counters", "orange"));
    $(".kBlueEvents > .kStatValue").html(tData.chain("Counters", "blue"));

    var ok = false;

    $(".kStatValue").each(function(){
        if($(this).html() == "0"){
            $(this).parent().hide();
        }else{
            $(this).parent().show();
            ok = true;
        }

       /* $(this).parent().show();
        ok = true;*/
    });

    //if(ok && !isRendered(stats.get(0))){
    if(!isRendered(stats.get(0)))
        stats.slideDown();
    /*}else{
        if(!ok){
            stats.slideUp();
        }
    }*/
}

function correctMessage(message){
    if(!message && message == "") return "";
    var msg = message;
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    return jQuery('<div/>').append(msg.replace(replacePattern1, '<a href="$1" target="_blank"><span>$1</span></a>')).html();
}

function callModal(e, mt, sel_item, custom){
    if(!mt){
        mt = MyTime;
    };

    if(!MyTime) return;

    if(!sel_item) sel_item = $(this);
    var ev_closure = sel_item.closest(".event-select");

    if(ev_closure.hasClass("kLocked")) return false;

    var selectedItem = sel_item;
    if (sel_item.hasClass('alreadyDrag') && !custom) {
        return;
    }else{
        ev_closure.addClass("kLocked");
    }

    if(selectedItem.data('type') != 'document'){
        e.stopPropagation();
        e.preventDefault();
    }

    //setTimeout(function() {
    ev_closure.off();
    ev_closure.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
        if (selectedItem.data('type') != 'document') {
            event.stopPropagation();
            event.preventDefault();

            var flower = new CustomEvent('kTimeline.flower-event', { 'detail': {
                sender: mt,
                date: ev_closure.attr("date"),
                side: ev_closure.attr("side"),
                action: selectedItem.data('action'),
                target: selectedItem.data('type'),
                user: custom
            } });

            mt.instance.each(function(){
                this.dispatchEvent(flower);
            });
            $('html').removeClass("mfp-helper");
            /*Timeline.showEventPopup(sql_date, hours, action, side, selectedItem.data('type'),data);*/
        }

        ev_closure.remove();
        mt.eventSelector = 0;
    });

    $('html').removeClass("mfp-helper");
    ev_closure.addClass('collapsed');
    //}, 500);
}

function sortNotifications(note1, note2){
    var time1 = Date.fromSqlDate(note1.find(".kNotification").attr("publication-time"));
    var time2 = Date.fromSqlDate(note2.find(".kNotification").attr("publication-time"));

    if (!(time1 > time2)){
        return true;
    }

    return false;
}
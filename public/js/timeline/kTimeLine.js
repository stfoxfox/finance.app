MyTime = false;

function isRendered(domObj) {
    if ((domObj.nodeType != 1) || (domObj == document.body)) {
        return true;
    }
    if (domObj.currentStyle && domObj.currentStyle["display"] != "none" && domObj.currentStyle["visibility"] != "hidden") {
        return isRendered(domObj.parentNode);
    } else if (window.getComputedStyle) {
        var cs = document.defaultView.getComputedStyle(domObj, null);
        if (cs.getPropertyValue("display") != "none" && cs.getPropertyValue("visibility") != "hidden") {
            return isRendered(domObj.parentNode);
        }
    }
    return false;
}

function getAmPmTime(hour, minutes, lang) {
    if(lang == "en"){
        var hours = hour == 0 ? "12" : hour > 12 ? hour - 12 : hour;
        var minutes = (minutes < 10 ? "0" : "") + minutes;

        var ampm = hour < 12 ? "am" : "pm";
        var formattedTime = hours + ":" + minutes + " " + ampm;
    }else{
        var hours = (hour < 10 ? "0" : "") + hour;
        var minutes = (minutes < 10 ? "0" : "") + minutes;

        var formattedTime = hours + ":" + minutes
    }


    return formattedTime;
}

function IsLeapYear(year) {
    return ( year % 4 == 0 ) && ( year % 100 != 0 || year % 400 == 0 );
}

function  getDataFromAttr(element){
    var year = parseInt(element.attr("data-year"));
    var month = parseInt(element.attr("data-month"));
    var day = parseInt(element.attr("data-day"));
    var hour = parseInt(element.attr("data-hour"));

    return new Date(year ? year : 0, month ? month : 0, day ? day : 1, hour ? hour : 0);
}

function kTimeline(selector, settings){
    this.instance = selector;
    this.content = "";

    this.options = $.extend({
        'ranges' : {
            day: {begin:new Date(), end: new Date()},
            week: {begin:new Date(), end: new Date()},
            month: {begin:new Date(), end: new Date()},
            year: {begin:new Date(), end: new Date()},
            allTime : {begin:new Date(), end: new Date()}
        },
        'increment' : {
            day: {up: 2, down: 2},
            week: {up: 1, down: 1},
            month: {up: 1, down: 1},
            year: {up: 1, down: 1},
            allTime : {up: 2, down: 2}
        },
        'dataType': 'day',
        'dataMonth': {
            day:['January','February','March','April','May','June','July','August','September','October','November','December'],
            week:['January','February','March','April','May','June','July','August','September','October','November','December'],
            month:['January','February','March','April','May','June','July','August','September','October','November','December'],
            year:['January','February','March','April','May','June','July','August','September','October','November','December'],
            allTime:['January','February','March','April','May','June','July','August','September','October','November','December'],
        },
        format:{},
        'dataDaysOfWeek': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        'monthNumDays': [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        'useScrollbar': true,
        'mobileWidth' : 767,
        'currentDate' : new Date(),
        'useScrollTrigger' : true,
        'lang' : "ru",
        'hideTimestamps' : false
    }, settings);

    this.modalEvents = {
        close : []
    };

    this.isModalOpened = false;
    this.viewportTimeout = 0;
    this.fixRanges();

    jQuery.fn.reverseElements = [].reverse;

    jQuery.fn.slideLeftHide = function(speed, callback) {
        this.css("opacity", 1).animate({
            opacity:0,
            width: "hide",
            paddingLeft: "hide",
            paddingRight: "hide",
            marginLeft: "hide",
            marginRight: "hide"
        }, speed, callback);
    }

    jQuery.fn.slideLeftShow = function(speed, callback) {
        this.css("opacity", 0).animate({
            opacity: 1,
            width: "show",
            paddingLeft: "show",
            paddingRight: "show",
            marginLeft: "show",
            marginRight: "show"
        }, speed, callback);
    }

    jQuery.fn.invisible = function() {
        return this.css('visibility', 'hidden').css('opacity', 0);
    };

    jQuery.fn.visibilityToggle = function() {
        return this.css('visibility', function(i, visibility) {
            return (visibility == 'visible') ? 'hidden' : 'visible';
        });
    };

    (function () {

        if ( typeof window.CustomEvent === "function" ) return false;

        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    })();
}

kTimeline.prototype.fixRanges = function(){
    switch (this.options.dataType) {
        case 'allTime':
            this.options.ranges.allTime.begin.setMonth(0);
            this.options.ranges.allTime.end.setMonth(11);
            break;
        case 'year':
        {
            this.options.ranges.year.begin.setMonth(0);
            this.options.ranges.year.end.setMonth(11);
        }
        case 'month':
        {
            var month = this.options.ranges.month.end.getMonth();
            var day = this.options.monthNumDays[month];
            if(month == 1 && IsLeapYear(this.options.ranges.month.end.getFullYear())){
                day++;
            }

            this.options.ranges.month.begin.setDate(1);
            this.options.ranges.month.end.setDate(day);
            break;
        }
    }

    jQuery.fn.visible = function(delay) {
        if(!delay) {
            return this.css('visibility', 'visible').css("opacity", 1);
        }
        else{
            this.css('visibility', 'visible');

            if(this.css("opacity") > 0){
                return this;
            }else{
                return this.css('opacity', 0)
                        .slideDown('slow')
                        .animate(
                            { opacity: 1 },
                            { queue: false, duration: 'slow'}
                        );
            }
        }
    };
};

kTimeline.prototype.init = function (settings) {
    if(settings){
        this.options = $.extend(this.options, settings);
    }

    this.fixRanges();

    if(this.options.useScrollbar){
        this.instance.html($("<div class = 'wrapper-scroll scrollbar-inner'><div class = 'kTimelineContent'></div></div>"));
    }
    else {
        this.instance.html("<div class = 'kTimelineContent'></div>");
        this.content = this.instance;
    }

    switch(this.options.dataType){
        case "day": this.instance.addClass("kTimelineDayMode");
            this.instance.removeClass("kTimelineWeekMode");
            this.instance.removeClass("kTimelineMonthMode");
            this.instance.removeClass("kTimelineYearMode");
            this.instance.removeClass("kTimelineAllTimeMode");
            break;
        case "week": this.instance.addClass("kTimelineWeekMode");
            this.instance.removeClass("kTimelineDayMode");
            this.instance.removeClass("kTimelineMonthMode");
            this.instance.removeClass("kTimelineYearMode");
            this.instance.removeClass("kTimelineAllTimeMode");
            break;
        case "month": this.instance.addClass("kTimelineMonthMode");
            this.instance.removeClass("kTimelineWeekMode");
            this.instance.removeClass("kTimelineDayMode");
            this.instance.removeClass("kTimelineYearMode");
            this.instance.removeClass("kTimelineAllTimeMode");
            break;
        case "year": this.instance.addClass("kTimelineYearMode");
            this.instance.removeClass("kTimelineWeekMode");
            this.instance.removeClass("kTimelineMonthMode");
            this.instance.removeClass("kTimelineDayMode");
            this.instance.removeClass("kTimelineAllTimeMode");
            break;
        case "allTime": this.instance.addClass("kTimelineAllTimeMode");
            this.instance.addClass("kTimelineWeekMode");
            this.instance.addClass("kTimelineMonthMode");
            this.instance.addClass("kTimelineYearMode");
            this.instance.addClass("kTimelineDayMode");
            break;
    }

    this.content = this.instance.find(".kTimelineContent:first");


    this.content.append(this.content.append($('#kYearBuilder').render({
        from : this.options.ranges[this.options.dataType].begin,
        to : this.options.ranges[this.options.dataType].end,
        dataType: this.options.dataType,
        titleType: this.options.dataType,
        dataMonth: this.options.dataMonth,
        dataDaysOfWeek: this.options.dataDaysOfWeek,
        monthNumDays: this.options.monthNumDays,
        currentDate: this.options.currentDate,
        hideHours: this.options.dataType != "day" ? true : false,
        format: this.options.format
    })));

    if(this.options.hideTimestamps){
        this.content.find(".kTimelineStamp").hide();
    }

    this.initDefaultHandlers();
    this.initScrollbar();

    var closure = this;
    if(this.options.dataType == "day"){
        this.content.append($("<div />").addClass("kFloatingTime"));
        this.initFloatingTime();
        this.floatInterval = setInterval(function(){
            closure.initFloatingTime();
        }, 10);
    }
};

kTimeline.prototype.SendReady = function(){
    var ready = new CustomEvent('kTimeline.ready', { 'detail': {
        sender:this,
        dataType : this.options.dataType,
        range : this.options.ranges[this.options.dataType]
    } });

    this.instance.each(function(){
        this.dispatchEvent(ready);
    });
}

kTimeline.prototype.initScrollbar = function(){
    var closure = this;
    var wrap_scroll = this.instance.find(".wrapper-scroll:first").scrollbar({
       autoScrollSize: false
    });

    this.instance.find(".scroll-bar").height("30px");

    this.scroller = wrap_scroll;
    this.SSaver = new ScrollSaver(this.scroller.get(0));
    $(wrap_scroll).not('.scroll-wrapper').on('scroll', function (e) {
        if(!e.isTrigger && closure.options.useScrollTrigger) {
            var element = e.target;

            if (Math.floor(element.scrollHeight - element.scrollTop) === Math.floor(element.clientHeight)) {
                var coeff = 1;

                switch (closure.options.dataType) {
                    case 'allTime':
                        closure.options.ranges.allTime.begin.setFullYear(closure.options.ranges.allTime.begin.getFullYear() - closure.options.increment.allTime.down);
                        closure.options.ranges.allTime.end.setFullYear(closure.options.ranges.allTime.end.getFullYear() - closure.options.increment.allTime.down);
                        break;
                    case 'year':
                    {
                        closure.options.ranges.year.begin.setFullYear(closure.options.ranges.year.begin.getFullYear() - closure.options.increment.year.down);
                        closure.options.ranges.year.end.setFullYear(closure.options.ranges.year.end.getFullYear() - closure.options.increment.year.down);
                        break;
                    }
                    case 'month':
                    {
                        closure.options.ranges.month.begin.setMonth(closure.options.ranges.month.begin.getMonth() - closure.options.increment.month.down);
                        closure.options.ranges.month.end.setMonth(closure.options.ranges.month.end.getMonth() - closure.options.increment.month.down);
                        break;
                    }
                    case 'week':
                    {
                        closure.options.ranges.week.begin.setDate(closure.options.ranges.week.begin.getDate() - closure.options.increment.week.down * 7);
                        closure.options.ranges.week.end.setDate(closure.options.ranges.week.end.getDate() - closure.options.increment.week.down * 7);
                        coeff = 7;
                        break;
                    }
                    case 'day':
                    {
                        closure.options.ranges.day.begin.setDate(closure.options.ranges.day.begin.getDate() - closure.options.increment.day.down);
                        closure.options.ranges.day.end.setDate(closure.options.ranges.day.end.getDate() - closure.options.increment.day.down);
                        break;
                    }
                }

                $(wrap_scroll).scrollTop(element.scrollHeight - element.clientHeight - 2);
                var toDel = closure.options.increment[closure.options.dataType].down * coeff;

                closure.updateRangeDown(toDel, element);

            } else if ($(this).scrollTop() == 0) {
                var coeff = 1;

                switch (closure.options.dataType) {
                    case 'allTime':
                        closure.options.ranges.allTime.end.setFullYear(closure.options.ranges.allTime.end.getFullYear() + closure.options.increment.allTime.up);
                        closure.options.ranges.allTime.begin.setFullYear(closure.options.ranges.allTime.begin.getFullYear() + closure.options.increment.allTime.up);
                        break;
                    case 'year':
                        closure.options.ranges.year.end.setFullYear(closure.options.ranges.year.end.getFullYear() + closure.options.increment.year.up);
                        closure.options.ranges.year.begin.setFullYear(closure.options.ranges.year.begin.getFullYear() + closure.options.increment.year.up);
                        break;
                    case 'month':
                        closure.options.ranges.month.end.setMonth(closure.options.ranges.month.end.getMonth() + closure.options.increment.month.up);
                        closure.options.ranges.month.begin.setMonth(closure.options.ranges.month.begin.getMonth() + closure.options.increment.month.up);
                        break;
                    case 'week':
                        closure.options.ranges.week.end.setDate(closure.options.ranges.week.end.getDate() + closure.options.increment.week.up * 7);
                        closure.options.ranges.week.begin.setDate(closure.options.ranges.week.begin.getDate() + closure.options.increment.week.up * 7);
                        coeff = 7;
                        break;
                    case 'day':
                        closure.options.ranges.day.end.setDate(closure.options.ranges.day.end.getDate() + closure.options.increment.day.up);
                        closure.options.ranges.day.begin.setDate(closure.options.ranges.day.begin.getDate() + closure.options.increment.day.up);
                        break;
                }

                $(wrap_scroll).scrollTop(2);

                var toDel = closure.options.increment[closure.options.dataType].up * coeff;
                closure.updateRangeUp(toDel, element);
            }
        }
       /* else{
            closure.SetScrollTrigger(true);
        }*/

        /*clearInterval(closure.viewportTimeout);
        closure.viewportTimeout = setTimeout(function(){
            closure.content.find(".kEvent").each(function(){
                closure.Viewport($(this));
            });
        }, 200);*/
        $(".kCurrentTimestamp").html(closure.GetCurrentTimestamp());
    });
}

kTimeline.prototype.initFloatingTime = function(){
    var dateTime = new Date();
    var currBlock = this.content.find(".kTimelineTime[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "][data-day = " + dateTime.getDate() + "][data-hour = " + parseInt(dateTime.getHours()) + "]");
    var time = this.content.children(".kFloatingTime");

    if(!currBlock.size()){
        time.hide();
        return;
    } else {
        time.show();
    }

    var timeBlock = currBlock.prev();

    var closest = currBlock.closest(".kTimelineDay");

    if(dateTime.getHours() != 0)
    currBlock = currBlock.find(".kTimeTitle");
    if(timeBlock.size() > 0){
        timeBlock = timeBlock.find(".kTimeTitle");
    }
    else{
        timeBlock = closest;
        timeBlock = timeBlock.children(".kTitle");
    }

    time.html("" + getAmPmTime(dateTime.getHours(), dateTime.getMinutes(), this.options.lang));

    var top = timeBlock.offset().top + timeBlock.height();
    var bottom = currBlock.offset().top - time.height();
    time.offset({top :  (bottom - (bottom - top) * dateTime.getMinutes() / 60.0)});
}

kTimeline.prototype.initDefaultHandlers = function() {
    var closure = this;

    this.content.on("click", ".kTimelineYear > .kTitle", function (e) {
        e.stopPropagation();
        var parent = $(this).parent();
        var sib = parent.children(".kCollapsable.kContent");
        if (!sib.hasClass("kLocked")) {
            if (sib.children().length == 0) {
                sib.addClass("kLocked");
                AsyncWorker.Pause();
                sib.html($("#kMonthBuilder").render({
                    currYear: parent.attr("data-year"),
                    from: closure.options.ranges[closure.options.dataType].begin,
                    to: closure.options.ranges[closure.options.dataType].end,
                    dataType: "month",
                    titleType: closure.options.dataType,
                    dataMonth: closure.options.dataMonth,
                    dataDaysOfWeek: closure.options.dataDaysOfWeek,
                    monthNumDays: closure.options.monthNumDays,
                    currentDate: closure.options.currentDate,
                    hideHours: closure.options.dataType != "day" ? true : false,
                    format: closure.options.format
                }));

                /*if(closure.options.hideTimestamps){
                    sib.find(".kTimelineStamp").hide();
                }*/

                sib.hide().find(".kCollapsable").hide();

                var notes = parent.children(".kTimelineBlock").find(".kEvent");

                if(notes.size() > 0) {
                    notes.css('opacity', 1)
                        .slideUp('slow')
                        .animate(
                            { opacity: 0 },
                            { queue: false, duration: 'slow',
                                done: function(){
                                    closure.goDown(parent, $(this), "year").css('opacity', 0)
                                    .slideDown('slow')
                                    .animate(
                                        { opacity: 1 },
                                        { queue: false, duration: 'slow' }
                                    );
                                    }});
                    sib.show();
                    sib.children(".kCollapsable").delay(800).show(500, function () {
                        sib.removeClass("kLocked");
                        AsyncWorker.Start();
                    });
                }
                else {
                    sib.show();
                    sib.children(".kCollapsable").show(500, function () {
                        sib.removeClass("kLocked");
                        AsyncWorker.Start();
                    });
                }
            } else {
                sib.addClass("kLocked");
                AsyncWorker.Pause();
                var all_events = sib.find(".kEvent");

                if (all_events.size() > 0) {
                    all_events.css('opacity', 1)
                        .slideUp('slow')
                        .animate(
                            { opacity: 0 },
                            { queue: false, duration: 'slow',
                                done:function(){
                                    closure.goUp($(this), "year").css('opacity', 0)
                                        .slideDown('slow')
                                        .animate(
                                            { opacity: 1 },
                                            { queue: false, duration: 'slow'}
                                        );
                                }
                            });

                    sib.delay(800).hide(400, function () {
                        sib.children(".kCollapsable").hide();
                        sib.html("");

                        sib.removeClass("kLocked");
                        AsyncWorker.Start();
                    });
                } else {
                    sib.hide(400, function () {
                        sib.children(".kCollapsable").hide();
                        sib.html("");
                        sib.removeClass("kLocked");
                        AsyncWorker.Start();
                    });
                }
            }
        }
    });

    this.content.on("click", ".kTimelineMonth > .kTitle", function(e){
        e.stopPropagation();
        var parent = $(this).parent();
        var sib = parent.children(".kCollapsable.kContent");
        if(!sib.hasClass("kLocked")) {
            if (sib.children().length == 0) {
                sib.addClass("kLocked");
                AsyncWorker.Pause();

                sib.html($("#kDayBuilder").render({
                    currYear: parent.attr("data-year"),
                    currMonth: parent.attr("data-month"),
                    from: closure.options.ranges.month.begin,
                    to: closure.options.ranges.month.end,
                    dataType: "month",
                    titleType: closure.options.dataType,
                    dataMonth: closure.options.dataMonth,
                    dataDaysOfWeek: closure.options.dataDaysOfWeek,
                    monthNumDays: closure.options.monthNumDays,
                    currentDate: closure.options.currentDate,
                    hideHours: closure.options.dataType != "day" ? true : false,
                    format: closure.options.format
                }));
                /*if(closure.options.hideTimestamps){
                    sib.find(".kTimelineStamp").hide();
                }*/
                sib.hide().find(".kCollapsable").hide();

                var notes = parent.children(".kTimelineBlock").find(".kEvent");

                if(notes.size() > 0) {
                    notes.css('opacity', 1)
                        .slideUp('slow')
                        .animate(
                            { opacity: 0 },
                            { queue: false, duration: 'slow',
                            done: function() {
                                closure.goDown(parent, $(this), "month").css('opacity', 0)
                                    .slideDown('slow')
                                    .animate(
                                        { opacity: 1 },
                                        { queue: false, duration: 'slow' }
                                    );
                            }});
                    sib.show();
                    sib.children(".kCollapsable").delay(800).show(500, function () {
                        sib.removeClass("kLocked");
                        //AsyncWorker.Start();
                    });
                }
                else {
                    sib.show();
                    sib.children(".kCollapsable").show(500, function () {
                        sib.removeClass("kLocked");
                        //AsyncWorker.Start();
                    });
                }
            }
            else {
                sib.addClass("kLocked");
                AsyncWorker.Pause();
                var all_events = sib.find(".kEvent");

                if (all_events.size() > 0) {
                    all_events.css('opacity', 1)
                        .slideUp('slow')
                        .animate(
                            { opacity: 0 },
                            { queue: false, duration: 'slow',
                                done:function(){
                                    closure.goUp($(this), "month").css('opacity', 0)
                                        .slideDown('slow')
                                        .animate(
                                            { opacity: 1 },
                                            { queue: false, duration: 'slow'}
                                        );
                                }
                            });

                        sib.delay(800).hide(400, function () {
                            sib.children(".kCollapsable").hide();
                            sib.html("");

                            sib.removeClass("kLocked");
                            AsyncWorker.Start();
                        });
                } else {
                    sib.hide(400, function () {
                        sib.children(".kCollapsable").hide();
                        sib.html("");
                        sib.removeClass("kLocked");
                        AsyncWorker.Start();
                    });
                }
            }
        }
    });

    if(this.options.dataType != "day"){
        this.content.on("click", ".kTimelineDay > .kTitle", function(e){
            e.stopPropagation();
            var parent = $(this).parent();
            var sib = parent.children(".kCollapsable.kContent");
            if(!sib.hasClass("kLocked")) {
                if (sib.children().size() > 0 && !isRendered(sib.get(0))) {
                    sib.addClass("kLocked");
                    AsyncWorker.Pause();

                  /*  if(closure.options.hideTimestamps){
                        sib.find(".kTimelineStamp").hide();
                    }*/
                    sib.hide().find(".kCollapsable").hide();

                    var notes = parent.children(".kTimelineBlock").find(".kEvent");

                    if(notes.size() > 0) {
                        notes.css('opacity', 1)
                            .slideUp('slow')
                            .animate(
                            { opacity: 0 },
                            { queue: false, duration: 'slow',
                                done: function() {
                                    closure.goDown(parent, $(this), "week").css('opacity', 0)
                                        .slideDown('slow')
                                        .animate(
                                        { opacity: 1 },
                                        { queue: false, duration: 'slow' }
                                    );
                                }});
                        sib.show();
                        sib.children(".kCollapsable").delay(800).show(500, function () {
                            sib.removeClass("kLocked");
                            //AsyncWorker.Start();
                        });
                    }
                    else {
                        sib.show();
                        sib.children(".kCollapsable").show(500, function () {
                            sib.removeClass("kLocked");
                            //AsyncWorker.Start();
                        });
                    }
                }
                else {
                    sib.addClass("kLocked");
                    AsyncWorker.Pause();
                    var all_events = sib.find(".kEvent");

                    if (all_events.size() > 0) {
                        all_events.css('opacity', 1)
                            .slideUp('slow')
                            .animate(
                            { opacity: 0 },
                            { queue: false, duration: 'slow',
                                done:function(){
                                    closure.goUp($(this), "week").css('opacity', 0)
                                        .slideDown('slow')
                                        .animate(
                                        { opacity: 1 },
                                        { queue: false, duration: 'slow'}
                                    );
                                }
                            });

                        sib.delay(800).hide(400, function () {
                            sib.children(".kCollapsable").hide();

                            sib.removeClass("kLocked");
                            AsyncWorker.Start();
                        });
                    } else {
                        sib.hide(400, function () {
                            sib.children(".kCollapsable").hide();
                            sib.removeClass("kLocked");
                            AsyncWorker.Start();
                        });
                    }
                }
            }
        });
    }
    else{
        this.content.on("click", ".kTimelineDay > .kTitle", function(e){
            e.stopPropagation();

            var parent = $(this).parent();
            var sib = parent.children(".kCollapsable.kContent");
            sib.toggle(600);
        });
    }

    this.content.on("click", function(e){
        if($(e.target).hasClass("kSelectable"))
            closure.ShowEventSelector($(e.target), e);
    })
};

kTimeline.prototype.updateRangeUp = function(del, target){
    if(!this.options.useScrollTrigger) return;

    lockItem(this.instance);
    var end_date;
    var element;
    var elements;
    switch (this.options.dataType){
        case 'allTime':
        case 'year':
            elements = this.content.children(".kTimelineYear");

            element = elements.filter(":first");
            end_date = new Date(parseInt(element.attr("data-year")) + 1, 0, 1);
            break;
        case 'month':
            elements = this.content.children(".kTimelineMonth");
            element = elements.filter(":first");
            end_date = new Date(element.attr("data-year"), parseInt(element.attr("data-month")) + 1, 1);
            break;
        case 'week':
            elements = this.content.children(".kTimelineDay");
            element = elements.filter(":first");
            end_date = new Date(element.attr("data-year"), element.attr("data-month"), parseInt(element.attr("data-day")) + 1);
            break;
        case 'day':
            elements = this.content.children(".kTimelineDay");
            element = elements.filter(":first");
            end_date = new Date(element.attr("data-year"), element.attr("data-month"), parseInt(element.attr("data-day")) + 1);
            break;
    }

    var index = 0;
    var rev = elements.get().reverse();
    $(rev).each(function(){
        if(index >= del) return false;
        $(this).remove();
        index++;
    });

    this.fixRanges();


    var up_elem = $($('#kYearBuilder').render({
        from : end_date,
        to : this.options.ranges[this.options.dataType].end,
        dataType: this.options.dataType,
        titleType: this.options.dataType,
        dataMonth: this.options.dataMonth,
        dataDaysOfWeek: this.options.dataDaysOfWeek,
        monthNumDays: this.options.monthNumDays,
        currentDate: this.options.currentDate,
        hideHours: this.options.dataType != "day" ? true : false,
        format: this.options.format
    }));

    if(this.options.hideTimestamps){
        up_elem.find(".kTimelineStamp").hide();
    }

    this.SetScrollTrigger(false);
    this.content.prepend(up_elem);

    var closure = this;

    closure.ScrollTo(element.offset().top - closure.scroller.offset().top + closure.scroller.scrollTop(), 0);

    if(Math.floor(target.scrollHeight - target.scrollTop) === Math.floor(target.clientHeight)) {
        closure.scroller.scrollTop(target.scrollHeight - target.clientHeight - 2);
    }

    setTimeout(function(){
        closure.ScrollTo(element.offset().top - closure.scroller.offset().top + closure.scroller.scrollTop(), 0);

        if(Math.floor(target.scrollHeight - target.scrollTop) === Math.floor(target.clientHeight)) {
            closure.scroller.scrollTop(target.scrollHeight - target.clientHeight - 2);
        }
        closure.SetScrollTrigger(true);
        unlockItem(closure.instance);
    }, 3000);

    var updated = new CustomEvent('kTimeline.updateRange', { 'detail': {
        begin : end_date,
        end : this.options.ranges[this.options.dataType].end,
        sender:this
    } });

    this.instance.each(function(){
        this.dispatchEvent(updated);
    });
};

kTimeline.prototype.updateRangeDown = function(del, target){
    if(!this.options.useScrollTrigger) return;

    lockItem(this.instance);
    var begin_date;
    var elements;
    switch (this.options.dataType){
        case 'allTime':
        case 'year':
            elements = this.content.children(".kTimelineYear");
            var year = elements.filter(":last");
            begin_date = new Date(parseInt(year.attr("data-year")) - 1, 0, 1);
            break;
        case 'month':
            elements = this.content.children(".kTimelineMonth");
            var month = elements.filter(":last");
            begin_date = new Date(month.attr("data-year"), parseInt(month.attr("data-month")) - 1, 1);

            var mt = begin_date.getMonth();
            var day = this.options.monthNumDays[mt];
            if(mt == 1 && IsLeapYear(begin_date.getFullYear())){
                day++;
            }

            begin_date.setDate(day);

            break;
        case 'week':
            elements = this.content.children(".kTimelineDay");
            var day = elements.filter(":last");
            begin_date = new Date(day.attr("data-year"), day.attr("data-month"), parseInt(day.attr("data-day")) - 1);
            break;
        case 'day':
            elements = this.content.children(".kTimelineDay");
            var day = elements.filter(":last");
            begin_date = new Date(day.attr("data-year"), day.attr("data-month"), parseInt(day.attr("data-day")) - 1);
            break;
    }

    var index = 0;
    elements.each(function(){
        if(index >= del) return false;
        $(this).remove();
        index++;
    });

    this.fixRanges();


    var down_elem = $($('#kYearBuilder').render({
        from : this.options.ranges[this.options.dataType].begin,
        to : begin_date,
        dataType: this.options.dataType,
        titleType: this.options.dataType,
        dataMonth: this.options.dataMonth,
        dataDaysOfWeek: this.options.dataDaysOfWeek,
        monthNumDays: this.options.monthNumDays,
        currentDate: this.options.currentDate,
        hideHours: this.options.dataType != "day" ? true : false,
        format: this.options.format
    }));

    if(this.options.hideTimestamps){
       down_elem.find(".kTimelineStamp").hide();
    }

    this.SetScrollTrigger(false);
    this.content.append(down_elem);

    var closure = this;

    closure.scroller.scrollTop(down_elem.offset().top - closure.scroller.offset().top + closure.scroller.scrollTop());
    if(Math.floor(target.scrollHeight - target.scrollTop) === Math.floor(target.clientHeight)) {
        closure.scroller.scrollTop(target.scrollHeight - target.clientHeight - 2);
    }

    setTimeout(function(){
        closure.scroller.scrollTop(down_elem.offset().top - closure.scroller.offset().top + closure.scroller.scrollTop());
        if(Math.floor(target.scrollHeight - target.scrollTop) === Math.floor(target.clientHeight)) {
            closure.scroller.scrollTop(target.scrollHeight - target.clientHeight - 2);
        }

        closure.SetScrollTrigger(true);
        unlockItem(closure.instance);
    }, 3000);

    var updated = new CustomEvent('kTimeline.updateRange', {
        detail: {
        begin : this.options.ranges[this.options.dataType].begin,
        end : begin_date,
        sender:this
    } });

    this.instance.each(function(){
        this.dispatchEvent(updated);
    });
};

kTimeline.prototype.FindBlock = function(dateTime, side){
    switch(this.options.dataType) {
        case "allTime":
        case "year":{
            var founded = this.content.children(".kTimelineYear[data-year = " + dateTime.getFullYear() + "]");
            var month_founded = founded.children(".kContent").children(".kTimelineMonth[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "]");
            if(month_founded && month_founded.length > 0){
                var time_founded = month_founded.children(".kContent").find(".kTimelineTime[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "][data-day = " + dateTime.getDate() + "][data-hour = " + parseInt(dateTime.getHours()) + "]");

                if(time_founded && time_founded.length > 0){
                    switch(side){
                        case 'left':
                            return time_founded.find(".kTimelineBlock>.kTimelineLeft");
                            break;
                        case 'right':
                            return time_founded.find(".kTimelineBlock>.kTimelineRight");
                            break;
                    }

                }else{
                    switch (side) {
                        case 'left':
                            return month_founded.find(".kTimelineBlock>.kTimelineLeft");
                            break;
                        case 'right':
                            return month_founded.find(".kTimelineBlock>.kTimelineRight");
                            break;
                    }
                }
            }else{
                switch (side) {
                    case 'left':
                        return founded.find(".kTimelineBlock>.kTimelineLeft");
                        break;
                    case 'right':
                        return founded.find(".kTimelineBlock>.kTimelineRight");
                        break;
                }
            }

            break;
        }
        case "month":{
            var founded = this.content.children(".kTimelineMonth[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "]");
            var time_founded = founded.children(".kContent").find(".kTimelineTime[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "][data-day = " + dateTime.getDate() + "][data-hour = " + parseInt(dateTime.getHours()) + "]");

            if(time_founded && time_founded.length > 0){
                switch (side) {
                    case 'left':
                        return time_founded.find(".kTimelineBlock>.kTimelineLeft");
                        break;
                    case 'right':
                        return time_founded.find(".kTimelineBlock>.kTimelineRight");
                        break;
                }
            }else{
                switch (side) {
                    case 'left':
                        return founded.find(".kTimelineBlock>.kTimelineLeft");
                        break;
                    case 'right':
                        return founded.find(".kTimelineBlock>.kTimelineRight");
                        break;
                }
            }
            break;
        }
        case "week":{
            var founded = this.content.find(".kTimelineDay[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "][data-day = " + dateTime.getDate() + "]");
            switch (side) {
                case 'left':
                    return founded.children(".kTimelineBlock").children(".kTimelineLeft");
                    break;
                case 'right':
                    return founded.children(".kTimelineBlock").children(".kTimelineRight");
                    break;
            }

            break;
        }
        case "day":{
            var founded = this.content.find(".kTimelineTime[data-year = " + dateTime.getFullYear() + "][data-month = " + dateTime.getMonth() + "][data-day = " + dateTime.getDate() + "][data-hour = " + parseInt(dateTime.getHours()) + "]");
            switch (side) {
                case 'left':
                    return founded.find(".kTimelineBlock>.kTimelineLeft");
                    break;
                case 'right':
                    return founded.find(".kTimelineBlock>.kTimelineRight");
                    break;
            }

            break;
        }
    }

    return undefined;
}

kTimeline.prototype.Push = function(dateTime, body, side, needDuplicate, status){
    var ev = $("<div></div>").html(body).addClass("kEvent").attr("data-side", side).attr("data-year", dateTime.getFullYear()).attr("data-month", dateTime.getMonth()).attr("data-day", dateTime.getDate()).attr("data-hour", parseInt(dateTime.getHours()));

    switch(status){
        case "orange":
            ev.append('<div class="kEventArrow"><img src="/img/timeline/orangeArrow.png"></div>');
            ev.addClass("kOrangeEvent");
            break;
        case "red":
            ev.append('<div class="kEventArrow"><img src="/img/timeline/redArrow.png"></div>');
            ev.addClass("kRedEvent");
            break;
        default:
            ev.append('<div class="kEventArrow"><img src="/img/timeline/arrow_action_new.png"></div>');
            break;
    }
    if(status){
        ev.attr("color", status);
    }

    var closure = this;
    var block = closure.FindBlock(dateTime, side);

    if(block) {
        this.SSaver.prepareFor('up');

        if (side == "right") {
            if (closure.instance.width() >= closure.options.mobileWidth) {
                closure.pushSorted(block, ev);
            } else {
                var left = block.parent().children(".kTimelineLeft");
                closure.pushSorted(left, ev);
            }
        } else {
            closure.pushSorted(block, ev);
        }
        if(this.options.hideTimestamps) {
            this.SetScrollTrigger(false);
            ev.parents(".kTimelineStamp").show();
        }

        if(ev.offset().top - this.scroller.offset().top > 10) {
            this.SSaver.prepareFor('down');
        }
        this.SSaver.restore();

        if(this.options.hideTimestamps) {
            this.SetScrollTrigger(true);
        }
        //ev.hide().css("opacity", 0);

       // this.Viewport(ev);




        var pushed = new CustomEvent('kTimeline.item-pushed', {
            'detail': {
                sender: closure,
                event: ev,
                /*oldHeight: old_height,
                newHeight: closure.content.height(),
                oldScrollTop: old_top,
                newScrollTop: closure.scroller.scrollTop(),
                itemHeight: ev.outerHeight(true),*/
            }
        });

        closure.instance.each(function () {
            this.dispatchEvent(pushed);
        });
    }

    if( needDuplicate && (this.options.dataType == "day" || this.options.dataType == "week")){

        var today = new Date();
        today.setDate(today.getDate() + 1);
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);

        if(dateTime > today){
            this.Push(new Date(), body.clone(true, true).attr("duplicated", true), side, false);
        }
    }

    if(!block) return undefined;
};

kTimeline.prototype.GetEventDate = function(eventBlock){
    return new Date(eventBlock.data("year"), eventBlock.data("month") ? eventBlock.data("month") : 0, eventBlock.data("day") ? eventBlock.data("day") : 1, eventBlock.data("hour") ? eventBlock.data("hour") : 0, eventBlock.data("minutes") ? eventBlock.data("minutes") : 0);
};

kTimeline.prototype.pushSorted = function(block, item){
    var eventList = block.children(".kEvent");
    var closure = this;

    if(eventList.size() > 0) {
        var itemDate = this.GetEventDate(item);
        var itemBefore = false;

        eventList.each(function () {
            if(closure.options.sortFunction){
                if(closure.options.sortFunction($(this), item)){
                    itemBefore = $(this);
                    return false;
                }
            }
            else{
                var dt = closure.GetEventDate($(this));

                if (!(dt > itemDate)){
                    itemBefore = $(this);
                    return false;
                }
            }
        });

        if(itemBefore) {
            item.insertBefore(itemBefore);
        }else{
            block.append(item);
        }
    }
    else {
        block.append(item);
    }

    return item;
};

kTimeline.prototype.OpenModalBlock = function(dateTime, customInfo){
    var modal = $("<div/>").addClass("kModal").append($("<div/>").addClass("kModalContent"));
    var parentModal = this.FindBlock(dateTime, "left").parent().parent();

    var closure = this;

    this.CloseModalBlock(
        function(){
            if(parentModal.hasClass("kTimelineTime")){
                parentModal.prepend(modal);
            }else{
                modal.insertAfter(parentModal.find(".kTitle:first"));
            }
            parentModal.closest(".kContent").show(200);
            $(closure.scroller).scrollTo(modal, 1000);
            closure.isModalOpened = true;

            var ready = new CustomEvent('kTimeline.open-modal', { 'detail': {
                sender: closure,
                dataType : closure.options.dataType,
                range : closure.options.ranges[closure.options.dataType],
                modal: modal.children(),
                customInfo: customInfo
            } });

            closure.instance.each(function(){
                this.dispatchEvent(ready);
            });
        }
    );

    //return modal.children();
}

kTimeline.prototype.CloseModalBlock = function(callback){
    var modal = this.instance.find('.kModal');
    if(modal.size() > 0) {
        for (var i = 0; i < this.modalEvents.close.length; i++) {
            this.modalEvents.close[i](modal);
        }

        var closure = this
        modal.css('opacity', 1)
            .slideUp('slow')
            .animate(
                {opacity: 0},
                {
                    queue: false, duration: 'slow',
                    done: function () {
                        $(this).remove();
                        closure.isModalOpened = false;
                        if (callback)
                            callback();
                    }
                });
    }else{
        if(callback) callback();
    }
}

kTimeline.prototype.OnModalClose = function(func){
    this.modalEvents.close.push(func);
}

kTimeline.prototype.ShowEventSelector = function(element, mouseEvent){
    if(this.eventSelector)
    {
        if(!this.eventSelector.hasClass("kLocked")){
            this.eventSelector.remove();
            this.eventSelector = false;
        }
    }

    if(this.isModalOpened) return;

        var closure = this;
        var eSelector = $("#kEventSelector").render({
            action: "create"
        });

        this.eventSelector = $(eSelector);

        var ev_closure = this.eventSelector;

    var block;

    if(element.parent().hasClass("kTimelineBlock"))
    {
        element.prepend(this.eventSelector);
        this.eventSelector.attr("side", element.hasClass("kTimelineLeft") ? "left" : "right");
        this.eventSelector.attr("date", getDataFromAttr(element.parent()));
    }
    else {
        if (element.hasClass("kTimeTitle")) {
            block = element.parent().find(".kTimelineBlock:first");
        } else {
            if(element.hasClass("kTimelineDay")){
                element.find(".kCollapsable").show(500);
            }

            block = element.find(".kTimelineBlock:first");
        }

        if (block) {
            var pWidth = element.innerWidth(); //use .outerWidth() if you want borders
            var pOffset = element.offset();
            var x = mouseEvent.pageX - pOffset.left;

            var side;

            if (this.instance.width() < this.options.mobileWidth || pWidth / 2 > x) {
                side = block.children(".kTimelineLeft").append(this.eventSelector);
                side.closest(".kContent").show(200);
            }
            else {
                side = block.children(".kTimelineRight").append(this.eventSelector);
                side.closest(".kContent").show(200);
            }

            this.eventSelector.attr("side", side.hasClass("kTimelineLeft") ? "left" : "right");
            this.eventSelector.attr("date", getDataFromAttr(side.parent()));
        }
    }

    this.eventSelector.removeClass('collapsed');

    if(this.eventSelector) {
        $(this.scroller).scrollTo(this.eventSelector, 1000, {
            offset: {
                left: 0,
                top: -this.instance.height() / 2 + this.eventSelector.outerHeight(true) / 2
            }
        });
    }

    //this.scroller.scrollTop(this.eventSelector.offset().top - this.scroller.offset().top + this.scroller.scrollTop() - 100 );

       // setTimeout((function () {
            ev_closure.find("#menu-open").prop('checked', true);
       // }), 100);
        var inst = this;

        this.eventSelector.find(".menu-inner-item").each(function(){
            var closure = $(this);
            $(this).droppable({
                accept: ".user-list-item",
                drop: function (event, ui) {
                    event.preventDefault();
                    callModal(event, inst, closure, $(ui.draggable));
                }
            });
        });

        this.eventSelector.find('.menu-inner-item').on('click', callModal);

        /** Start - drag 'n' drop function on flower events */
        this.eventSelector.find('.menu-inner-item')/*.on("mousedown", function(){
            $('html').addClass("mfp-helper");
        })*/.draggable({
            start: function(event, ui) {
                $(this).addClass('alreadyDrag');
                $(this).hide();
                ui.helper.addClass('flower-item-dragging');
            },
            stop: function() {
                $(this).removeClass('alreadyDrag');
                $(this).show();
                /*$('html').removeClass("mfp-helper");*/
            },
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        /** END - drag 'n' drop function on flower events */
        this.eventSelector.find('.menu-open-button').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            ev_closure.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
                ev_closure.addClass('collapsed');
                ev_closure.remove();
                closure.eventSelector = 0;
                $('html').removeClass("mfp-helper");
            });

            $('html').removeClass("mfp-helper");
            ev_closure.addClass('collapsed');
            ev_closure.find("#menu-open").prop('checked', false);
        });
}

kTimeline.prototype.SetType = function(type){
    this.options.dataType = type;
    AsyncWorker.Clear();
    AsyncWorker._execute();
    var closure = this;
   // this.instance.fadeOut(500, function(){
        closure.CloseModalBlock();
        closure.destroy();
        closure.init();
   // });
        this.ScrollToCurrent();
   // this.instance.fadeIn(500, function(){
        closure.SendReady();
  //  });
};

kTimeline.prototype.destroy = function(){
    if(this.content)
        this.content.off();
    if(this.floatInterval) {
        clearInterval(this.floatInterval);
    }

    this.instance.find("[instance-key]").each(function(){
        $(this).DestroyInstance();
    });
    this.instance.off().html("");
};

kTimeline.prototype.goDown = function(from, el, type){
    var founded;
    switch(type) {
        case "year":{
            founded = from.find(".kTimelineMonth[data-year = " + el.attr("data-year") + "][data-month = " + el.attr("data-month") + "]");
            break;
        }
        case "month":{
            founded = from.find(".kTimelineDay[data-year = " + el.attr("data-year") + "][data-month = " + el.attr("data-month") + "][data-day = " + el.attr("data-day") + "]");
            break;
        }
        case "week":{
            founded = from.find(".kTimelineTime[data-year = " + el.attr("data-year") + "][data-month = " + el.attr("data-month") + "][data-day = " + el.attr("data-day") + "][data-hour = " + el.attr("data-hour") + "]");
            break;
        }
    }
    if(this.instance.width() >= this.options.mobileWidth){
        switch (el.attr("data-side")) {
            case 'left':
                var unhide = founded.children(".kTimelineBlock").children(".kTimelineLeft").append(el.detach());
                if(this.options.hideTimestamps){
                    unhide.parents(".kTimelineStamp").show();
                }
                break;
            case 'right':
                var unhide = founded.children(".kTimelineBlock").children(".kTimelineRight").append(el.detach());
                if(this.options.hideTimestamps){
                    unhide.parents(".kTimelineStamp").show();
                }
                break;
        }
    }else{
        founded.children(".kTimelineBlock").children(".kTimelineLeft").append(el.detach());
    }
    return el;
}

kTimeline.prototype.goUp = function(el, type){
    var founded;
    switch(type) {
        case "year":{
            founded = el.closest(".kTimelineYear[data-year = " + el.attr("data-year") + "]");
            break;
        }
        case "month":{
            founded = el.closest(".kTimelineMonth[data-year = " + el.attr("data-year") + "][data-month = " + el.attr("data-month") + "]");
            break;
        }
        case "week":{
            founded = el.closest(".kTimelineDay[data-year = " + el.attr("data-year") + "][data-month = " + el.attr("data-month") + "][data-day = " + el.attr("data-day") + "]");
            break;
        }
    }

    if(this.instance.width() >= this.options.mobileWidth){
        switch (el.attr("data-side")) {
            case 'left':
                var unhide = founded.children(".kTimelineBlock").children(".kTimelineLeft").append(el.detach());
                if(this.options.hideTimestamps){
                    unhide.parents(".kTimelineStamp").show();
                }
                break;
            case 'right':
                var unhide = founded.children(".kTimelineBlock").children(".kTimelineRight").append(el.detach());
                if(this.options.hideTimestamps){
                    unhide.parents(".kTimelineStamp").show();
                }
                break;
        }
    }else{
        founded.children(".kTimelineBlock").children(".kTimelineLeft").append(el.detach());
    }

    return el;
};

kTimeline.prototype.GetCurrentRange = function(){
    return this.options.ranges[this.options.dataType];
};

kTimeline.prototype.ScrollTo = function(target, delay, settings){
    $(this.scroller).scrollTo(target, delay, settings);
};

kTimeline.prototype.SetScrollTrigger = function(use){
    this.options.useScrollTrigger = use;
}

kTimeline.prototype.ScrollToCurrent = function(){
    var closure = this;

    this.SetScrollTrigger(false);
    switch (closure.options.dataType) {
        case 'allTime':
        case 'year':
            this.scrollTarget = this.instance.find(".kCurrYear");
            break;
        case 'month':
            this.scrollTarget = this.instance.find(".kCurrMonth");
            break;
        case 'week':
            this.scrollTarget = this.instance.find(".kCurrDay");
            break;
        case 'day':
            this.scrollTarget = this.instance.find(".kFloatingTime");
            break;
    }

    if(this.scrollTarget.size() > 0) {
        this.scroller.scrollTop(this.scrollTarget.offset().top - this.scroller.offset().top);
    }

    this.SetScrollTrigger(true);
};

kTimeline.prototype.Viewport = function(event){
    event.show();

    if(Math.abs(event.offset().top) > 2 * this.scroller.outerHeight()){
        event.invisible();
    }else{
        event.visible(500);
    }
};

kTimeline.prototype.GetCurrentTimestamp = function(){
    var result = "";
    var arr;
    switch (this.options.dataType) {
        case 'allTime':
        case 'year':
            arr = this.content.children(".kTimelineYear");
            break;
        case 'month':
            arr = this.content.children(".kTimelineMonth");
            break;
        case 'week':
        case 'day':
            arr = this.content.children(".kTimelineDay");
            break;
    }

    var closure = this;

    if(arr.size() > 0){
        arr.each(function(){
            if(isRendered($(this).get(0))) {
                var offs = $(this).offset().top - closure.instance.offset().top;
                if (offs > 0) {
                    return false;
                }
                result = $(this).children(".kTitle").html();
            }
        });
    }

    return result;
};

kTimeline.prototype.HideTimestamps = function() {
    /*this.SetScrollTrigger(false);
        this.content.find(".kTimelineStamp").each(function(){
           if($(this).find(".kEvent").size() > 0){
               $(this).show();
           } else {
               $(this).hide();
           }
        });*/
   // this.SetScrollTrigger(true);
}
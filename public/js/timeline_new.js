var Timeline = {
    canvas: null,
    tempCanvas: null,
    tempCanvasLock: false,
    topDay: 0,
    bottomDay: 0,
    topYear: 0,
    bottomYear: 0,
    loadPeriod: 0,
    loadPeriodSmall: 3,
    loadPeriodNormal: 14,
    topDate: null,
    bottomDate: null,
    lEnableUpdate: true,
    lEnableAnimation: true,
    eventPopupAllowed: true,
    eventPopupActive: false,
    clockTimer: null,
    updateTimer: null,
    updateTime: null,
    initialLoad: true,
    language: null,
    scrollLoad: false,
    alreadyDownload: false,
    prevUpdateData: {events: '', join: '', invites: ''},
    eventPopupElement: null,
    expand: false,
    viewState: null, //'0 = day', '1 = week', '2 = month', '3 = year'
    search: '',
    groupViewState: false,
    VIEW_STATE_DAY: 0,
    VIEW_STATE_WEEK: 1,
    VIEW_STATE_MONTH: 2,
    VIEW_STATE_YEAR: 3,
    cacheArray: {},
    init: function (options, data) {
        Timeline = $.extend(Timeline, options);
        Timeline.lEnableUpdate = false;
        $('.wrapper-container').off('scroll');

        Timeline.topDate = Date.fromSqlDate(todayDate).addDays(Timeline.topDay);
        Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(Timeline.bottomDay);

        var html = Timeline.renderEvents(data);
        $(Timeline.canvas).append(html);

        Timeline.insertCurrentTime();
        for (var i = 0; i < 100; i++) {
            if ($('.curr-time-cell', Timeline.canvas).length) {
                break;
            }
        }
        Timeline.collapseEmptyCells();
        Timeline.initCollapsibles();
        //Timeline.scrollCurrentTime();

        if (Timeline.updateTime) {
            Timeline.updateTimer = setInterval(function () {
                Timeline.updateState();
            }, Timeline.updateTime);
            Timeline.updateComment = setInterval(function () {
                Timeline.setCommentsHandler();
            }, 100);
        }

        Timeline.initHandlers();

        setTimeout((function () {
            Timeline.lEnableUpdate = true;
        }), 500);
    },
    setSearch: function (query) {
        Timeline.search = query;
    },
    setViewState: function (state) {
        if (state >= 0 && state < 5) {

            Timeline.initialLoad = true;

            $('.ajax-loader').show();
            Timeline.lEnableUpdate = false;
            var prevstate = Timeline.viewState;
            Timeline.viewState = state;

            $(Timeline.canvas).animate({
                opacity: 0
            }, 600, 'easeOutExpo', function () {
                switch (state) {
                    case Timeline.VIEW_STATE_DAY:
                        if (Timeline.search.length > 0) {
                            Timeline.topDate = Date.fromSqlDate(todayDate).addDays(2);
                            Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(-2);
                            Timeline.topDay = (1);
                            Timeline.bottomDay = (-1);
                            Timeline.eventPopupAllowed = false;
                        } else {
                            Timeline.topDate = Date.fromSqlDate(todayDate).addDays(14);
                            Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(-14);
                            Timeline.topDay = (14);
                            Timeline.bottomDay = (-14);
                            Timeline.eventPopupAllowed = true;
                        }
                        Timeline.lEnableUpdate = true;
                        $(Timeline.canvas).empty();
                        Timeline.update();
                        break;
                    case Timeline.VIEW_STATE_WEEK:
                        Timeline.topDate = Date.fromSqlDate(todayDate).addDays(14);
                        Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(-14);
                        Timeline.topDay = (14);
                        Timeline.bottomDay = (-14);
                        Timeline.lEnableUpdate = true;
                        $(Timeline.canvas).empty();
                        Timeline.update();
                        break;
                    case Timeline.VIEW_STATE_MONTH:
                        Timeline.topDate = Date.fromSqlDate(todayDate).addDays(8 * 30);
                        Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(-8 * 30);
                        Timeline.topDay = (14);
                        Timeline.bottomDay = (-14);
                        Timeline.lEnableUpdate = true;
                        $(Timeline.canvas).empty();
                        Timeline.update();
                        break;
                    case Timeline.VIEW_STATE_YEAR:
                        Timeline.topDate = Date.fromSqlDate(todayDate).addDays(30 * 12 * 8);
                        Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(-30 * 12 * 8);
                        $(Timeline.canvas).empty();
                        Timeline.update();
                        break;
                }

                if (Timeline.viewState == Timeline.VIEW_STATE_DAY) {
                    setTimeout((function () {
                        Timeline.lEnableUpdate = true;
                        $(Timeline.canvas).animate({
                            opacity: 1
                        }, 600, 'easeOutExpo');

                        if (Timeline.search.length == 0) {
                            Timeline.scrollCurrentDay();
                        } else {
                            Timeline.scrollTarget('.searchHeader:first');
                        }

                        $('.ajax-loader').hide();
                    }), 500);
                }
            });
        }
    },
    update: function (lPrepend, sDate, eDate, vState) {
        var offsetTop = 0;
        Timeline.lEnableUpdate = false;
        Timeline.scrollLoad = false;
        $('.ajax-loader').show();

        sDate = typeof sDate !== 'undefined' ? sDate : Timeline.bottomDate;
        eDate = typeof eDate !== 'undefined' ? eDate : Timeline.topDate;
        vState = typeof vState !== 'undefined' ? vState : Timeline.viewState;
        var search = typeof Timeline.search !== 'undefined' ? Timeline.search : '';

        if ( ((sDate.toSqlDate() + eDate.toSqlDate()) in Timeline.cacheArray)
            &&(Timeline.cacheArray[sDate.toSqlDate() + eDate.toSqlDate()] == search) ){
            Timeline.parseResponse(
                    Timeline.cacheArray[sDate.toSqlDate() + eDate.toSqlDate()],
                    lPrepend,
                    sDate,
                    eDate
            );
        } else {
            doneEvent = function (response) {
                response['search'] = search;
                //if (Timeline.lEnableUpdate != false){
                    Timeline.parseResponse(response, lPrepend, sDate, eDate);
                //}
            };
            //if(highWay.isOpen()){
            //    highWay.call(
            //        'transport.proxy.mytime.events.update',
            //        [{
            //            userId: KonstruktorAdapterOptions.CURRENT_USER_ID,
            //            date: sDate.toSqlDate(),
            //            date2: eDate.toSqlDate(),
            //            view: vState,
            //            search: search
            //        }]
            //    ).then(doneEvent);
            //} else {
                $.post(profileURL.timelineEvents, {
                    data: {
                        date: sDate.toSqlDate(),
                        date2: eDate.toSqlDate(),
                        view: vState,
                        search: search
                    }
                }).done(doneEvent);
            //}
        }
    },
    parseResponse: function (response, lPrepend, sDate, eDate) {
        if (checkJson(response)) {
            Timeline.cacheArray[sDate.toSqlDate() + eDate.toSqlDate()] = response;

            Timeline.render(response.data, lPrepend, sDate, eDate);
            offsetTop = $(Timeline.tempCanvas).height();

            if (lPrepend && $('#day' + sDate.toSqlDate()).length) {
                $(Timeline.canvas).prepend($(Timeline.tempCanvas).html());
            } else {
                $(Timeline.canvas).append($(Timeline.tempCanvas).html());
            }
            $(Timeline.tempCanvas).html('');

            $('.ajax-loader').hide();
            //buggy scroll to current date even if not needed.
            // Fix jumping after loading new data,
            // added second value to function scrollTarget and added animated scroll with little delay for a smooth transition
            if (lPrepend){
                Timeline.scrollTarget($('#day' + sDate.toSqlDate()), 60);
                setTimeout((function () {
                    Timeline.scrollTargetAnimated($('#day' + sDate.toSqlDate()));
                }), 100);

            }
        }

        if (lPrepend && (Timeline.viewState == Timeline.VIEW_STATE_DAY || Timeline.viewState == Timeline.VIEW_STATE_WEEK)) {
            //$('.wrapper-container').scrollTop(offsetTop);
        }

        setTimeout((function () {
            Timeline.initHandlers();
            Timeline.lEnableUpdate = true;
        }), 0);

        if (Timeline.viewState != Timeline.VIEW_STATE_DAY) {
            Timeline.lEnableUpdate = true;

            if (Timeline.initialLoad && !Timeline.scrollLoad) {
                if (Timeline.scrollLoad)
                    Timeline.scrollCurrentDay();
                Timeline.initialLoad = false;
            }
            Timeline.scrollLoad = false;

            $(Timeline.canvas).animate({
                opacity: 1
            }, 100, 'easeOutExpo');

            $('.ajax-loader').hide();
        }
        Timeline.enableScrolling();
        if (Timeline.scrollLoad)
            Timeline.scrollCurrentDay();
        Timeline.alreadyDownload = false;
		Timeline.addDrag();
    },
    insertCurrentTime: function () {
        if (!$('.currentTime').length) {
            $('.currentTime').css('width', 35);

            var _now = new Date();
            var id = 'timeline_' + _now.toSqlDate() + '_' + zeroFormat(_now.getHours()) + '00';
            $('#' + id).before(tmpl('curr-time', {
                time: Date.HoursMinutes(_now, locale)
            }));
            clearInterval(Timeline.clockTimer);
            Timeline.clockTimer = setInterval(function () {
                var _now = new Date();
                var time = Date.HoursMinutes(_now, locale);
                if ($('.currentTime .value').length) {
                    if ($('.currentTime .value').html().indexOf(':') > -1) {
                        time = time.replace(/\:/, ' ');
                    }
                    $('.currentTime .value').html(time);
                }
            }, 500);
        }
    },
    scrollCurrentTime: function () {
        if ($('.currentDate').length > 0) {
            var offset = $('.currentDate').position().top;
            offset = offset - $('.headerTimeline').height();
            $('.wrapper-container').scrollTop(offset - 40);
        }
    },
    scrollCurrentDay: function () {
        if ($('.currentDate').length > 0) {
            var offset = $('.calendar.currentDate').position().top;
            offset = offset - $('.headerTimeline').height();
            $('.wrapper-container').scrollTop(offset - 40);
        }
    },
    scrollCurrentDayAnimated: function () {
        if ($('.currentDate').length > 0) {
            var offset = $('.calendar.currentDate').position().top;
            offset = offset - $('.headerTimeline').height();
            $('.wrapper-container').animate({
                scrollTop: offset - 40
            }, 600, 'easeOutExpo');
        }
    },
    scrollTargetAnimated: function (target) {
        var offset = typeof $(target).position() !== 'undefined' ? $(target).position().top : $('.headerTimeline').height();
        offset = offset - $('.headerTimeline').height();
        $('.wrapper-container').animate({
            scrollTop: offset - 40
        }, 600, 'easeOutExpo');
    },
    scrollTarget: function (target, offsetVal) {
        window.setTimeout(function(){
            var offset = typeof $(target).position() !== 'undefined' ? $(target).position().top : $('.headerTimeline').height();
            offset = offset - $('.headerTimeline').height();

            // offsetVal for scroll Up or Down without jumping
            if (offsetVal) {
                $('.wrapper-container').scrollTop(offset + offsetVal);
            } else {
                $('.wrapper-container').scrollTop(offset - 40);
            }
        }, 500);
    },
    renderEvents: function (data, vState, sDate, eDate) {
        sDate = typeof sDate !== 'undefined' ? sDate : Timeline.bottomDate;
        eDate = typeof eDate !== 'undefined' ? eDate : Timeline.topDate;
        vState = typeof vState !== 'undefined' ? vState : Timeline.viewState;

        switch (vState) {
            case Timeline.VIEW_STATE_DAY:
                return Timeline.renderDayWeek(data, sDate, eDate);
            case Timeline.VIEW_STATE_WEEK:
                return Timeline.renderWeek(data, sDate, eDate);
            case Timeline.VIEW_STATE_MONTH:
                return Timeline.renderMonth(data, sDate, eDate);
            case Timeline.VIEW_STATE_YEAR:
                return Timeline.renderYear(data);
            default:
                return '';
        }
    },
    renderDayWeek: function (data, sDate, eDate) {

        var jsDate = Date.fromSqlDate(todayDate),
                html = '';
        for (var time = eDate.getTime(); time >= sDate.getTime(); time -= Date.timeDays(1)) {
            jsDate.setTime(time);
            html += tmpl('row-day-event', {
                globalData: data,
                sql_date: jsDate.toSqlDate(),
                data: (data.days && data.days[jsDate.toSqlDate()]) ? data.days[jsDate.toSqlDate()] : {}
            });
        }
        if (jsDate.toSqlDate() == startDate && $('.defaultEvent').length == 0 && Timeline.search == '') {
            html += tmpl('timeline-bottom', {
                globalData: data
            });
        }
        return html;
    },
    renderWeek: function (data, sDate, eDate) {
        var jsDate = Date.fromSqlDate(todayDate),
                html = '';
        for (var time = eDate.getTime(); time >= sDate.getTime(); time -= Date.timeDays(1)) {
            jsDate.setTime(time);
            html += tmpl('row-week-event', {
                globalData: data,
                sql_date: jsDate.toSqlDate(),
                data: (data.days && data.days[jsDate.toSqlDate()]) ? data.days[jsDate.toSqlDate()] : {}
            });
        }
        if (jsDate.toSqlDate() == startDate && !$('.defaultEvent').length && Timeline.search == '') {
            html += tmpl('timeline-bottom', {
                globalData: data
            });
        }
        return html;
    },
    renderMonth: function (data, sDate, eDate) {
        var firstDate = moment().add(8, 'months').date(1);
        var lastDate = moment().subtract(8, 'months').date(1);

        if (Timeline.expand) {
            firstDate = moment(eDate);
            lastDate = moment(sDate);

            var months = new Object();
            for (var i = 0; i < 12; i++) {
                var interDate = firstDate.subtract(1, 'months');

                if (data.months[interDate.format('YYYY-MM')]) {
                    months[interDate.format('YYYY-MM') + '-01'] = data.months[interDate.format('YYYY-MM')];
                } else {
                    months[interDate.format('YYYY-MM') + '-01'] = '';
                }
            }
            data.months = months;
        } else {
            var months = new Object();
            for (var i = 0; i < 17; i++) {
                var interDate = firstDate.subtract(1, 'months');

                if (data.months[interDate.format('YYYY-MM')]) {
                    months[interDate.format('YYYY-MM') + '-01'] = data.months[interDate.format('YYYY-MM')];
                } else {
                    months[interDate.format('YYYY-MM') + '-01'] = '';
                }
            }
            data.months = months;
        }


        html = '';
        $.each(data.months, function (index, value) {
            html += tmpl('row-month-event', {
                globalData: data,
                sql_date: index,
                data: (data.months && data.months[index]) ? data.months[index] : {}
            });
        });

        if (!Timeline.expand) {
            html += tmpl('konstruktor-start', {});
            html += '<br><br>'
        }

        return html;
    },
    renderYear: function (data) {
        var firstDate = moment().add(8, 'years').dayOfYear(1);
        var lastDate = moment().subtract(8, 'years').dayOfYear(1);

        var years = new Object();
        for (var i = 0; i < 17; i++) {
            var interDate = firstDate.subtract(1, 'years');

            if (data.years[interDate.format('YYYY')]) {
                years[interDate.format('YYYY') + '-01-01'] = data.years[interDate.format('YYYY')];
            } else {
                years[interDate.format('YYYY') + '-01-01'] = '';
            }
        }
        data.years = years;

        html = '';
        $.each(data.years, function (index, value) {
            html += tmpl('row-year-event', {
                globalData: data,
                sql_date: index,
                data: (data.years && data.years[index]) ? data.years[index] : {}
            });
        });

        html += tmpl('konstruktor-start', {});
        return html + '<br><br>';
    },
    render: function (data, lPrepend, sDate, eDate) {
        var html = Timeline.renderEvents(data, Timeline.viewState, sDate, eDate);
        $(Timeline.tempCanvas).html('');
        if (lPrepend) {
            $(Timeline.tempCanvas).prepend(html);
        } else {
            $(Timeline.tempCanvas).append(html);
        }

        if (Timeline.viewState == Timeline.VIEW_STATE_DAY) {
            Timeline.collapseEmptyCells();
            Timeline.initCollapsibles();
        }

        Timeline.initHandlers();
        Timeline.tempCanvasLock = false;
    },
    collapseEmptyCells: function () {

        var lGroup = false,
                groupID = 0,
                html = '';
        $('.periodItem .eventListBlock').each(function () {
            var leftEvents = $('.leftSide .event', $(this));
            var rightEvents = $('.rightSide .event', $(this));
            if (leftEvents.length == 0 && rightEvents.length == 0) {
                //$(this).addClass('emptyEventList');
                kjsAddClass(this, 'emptyEventList');
                $('.time', $(this)).addClass('emptyTime');
            }
        });

        if (Timeline.initialLoad) {
            $('.emptyEventList').hide();
            Timeline.initialLoad = false;
        } else {
            $('.emptyEventList:not(:visible)').hide();
        }

        if (Timeline.language == 'eng') {
            $('.event').removeClass('eng').addClass('eng');
        }
    },
    initCollapsibles: function () {
        var i = 0;
        var prev = false;

        $('.periodItem').each(function () {
            prev = false;
            i = 0;
            $('.eventListBlock', $(this)).each(function () {
                if (!$(this).hasClass('[class^="eventGroup-"]')) {
                    if ($(this).hasClass('emptyEventList') && !$(this).is('[class*="eventGroup-"]')) {
                        if (!prev) {
                            i++;
                            //JQ EDITION
                            //$(this).before(tmpl('threeDots'));

                            //PURE JS EDITION
                            var html = tmpl('threeDots')();
                            this.insertAdjacentHTML('beforebegin', html);

                            prev = true;
                        }
                        //JQ EDITION
                        //$(this).addClass('eventGroup-' + i);

                        //PURE JS EDITION
                        kjsAddClass(this, 'eventGroup-' + i);
                    } else {
                        prev = false;
                    }
                }
            });
        });
    },
    initHandlers: function () {
        $('.threeDots').unbind('click');
        $('.threeDots').on('click', function () {
            var classes = $($(this).next('.emptyEventList')).attr('class');
            var eventPopoverTarget = $($(this).next('.emptyEventList:first')).attr('id');
            classes = '.' + classes.split(' ').join('.');
            $(this).fadeOut('fast', function () {
                $(classes, $(this).parent()).animate({
                    opacity: "toggle",
                    height: "toggle"
                }, 800, 'easeOutQuint');
            });

            setTimeout(function () {
                date = eventPopoverTarget.substr(9, 10);
                time = eventPopoverTarget.substr(20, 2) + ':00';
                Timeline.addEventPopup(date, time, 'right');
            }, 850);

            if (Timeline.updateTime) {
                clearInterval(Timeline.updateTimer);
                Timeline.updateTimer = setInterval(function () {
                    if ($('.currentDate').length) {
                        Timeline.updateState();
                    }
                }, Timeline.updateTime);
            }
        });

        $('.periodItem .calendar').off('click');
        $('.periodItem .calendar').on('click', function () {
            if (Timeline.lEnableAnimation) {
                Timeline.lEnableAnimation = false;
                var hide = true;
                if ($(this).hasClass('closed')) {
                    $(this).removeClass('closed');
                    hide = false;
                } else {
                    $(this).removeClass('closed').addClass('closed');
                    hide = true;
                }
                parent = $(this).parent();

                if (hide) {
                    parent.removeClass('collapsed');//.addClass('collapsed');

                    setTimeout((function () {
                        $('.eventListBlock', $(parent)).css('display', 'none');
                        $('.threeDots', $(parent)).css('display', 'none');
                        $('.currentTime', $(parent)).css('display', 'none');
                        $('.currentTime', $(parent)).css('display', 'block');
                        if ($('.eventModalContent', $(parent)).length > 0) {
                            Timeline.closeEventPopup();
                        }
                    }), 600);
                } else {
                    $('.eventListBlock:not(.emptyEventList)', $(parent)).show();
                    $('.threeDots', $(parent)).show();
                    $('.duration', $(parent)).addClass('hidden');

                    parent.removeClass('collapsed');
                }
                if ($(this).data("type") != "day") {
                    if (parent.next().hasClass('exp-' + $(this).data("type"))) {
                        $('.exp-' + $(this).data("type")).animate({
                            opacity: "toggle",
                            height: "toggle"
                        }, 600, 'easeOutQuint');
                    } else {
                        $('.periodItem .calendar').off('click');
                        switch ($(this).data("type")) {
                            case "week":
                                Timeline.expandDay($(this).data('date'));
                                break;
                            case "month":
                                Timeline.expandMonth($(this).data('date'));
                                break;
                            case "year":
                                Timeline.expandYear($(this).data('date'));
                                break;
                            default:
                                return;
                        }
                    }
                }

                setTimeout((function () {
                    Timeline.lEnableAnimation = true;
                }), 850);
            }
        });

        $('.wrapper-container').off('scroll');
        $('.wrapper-container').off('scroll');
        $('.wrapper-container').scroll(function (event) {
            //event.stopPropagation();
            if (event.target.scrollTop == 0) {
                if ($('.wrapper-container').scrollTop() == 0) {
                    if (Timeline.alreadyDownload)
                        return;
                    Timeline.onScrollTop();
                }
            } else if ($('.wrapper-container').scrollTop() >= ($(Timeline.canvas).height() - $(this).height())) {
                if (Timeline.alreadyDownload)
                    return;

                Timeline.onScrollBottom();
            }



        });

        $('.periodItem').off('click');
        $('.periodItem').on('click', function (e) {
            await = 0;

            if ($(e.target).parents('#eventModalContent').length == 0 && !$(e.target).hasClass('close')) {
                item = $(this);
                if (!Timeline.eventPopupActive) {
                    if (!$('.dropdown-panel.dropdown-open').length && Timeline.viewState != Timeline.VIEW_STATE_MONTH && Timeline.viewState != Timeline.VIEW_STATE_YEAR) {
                        var id = $(e.target).attr('id');
                        var pClass = $(e.target).parent().attr('class');
                        var date = '';
                        var time = '';
                        timeDOM = '';

                        if (pClass && pClass.indexOf('eventListBlock') != -1) {
                            timeDOM = $('.time', $(e.target).parent());
                        } else if ($(e.target).hasClass('eventListBlock') || $(item).attr('class') == $(e.target).attr('class')) {
                            timeDOM = $('.time', $(e.target));
                        } else if ($(e.target).parent().attr('class') == 'time') {
                            timeDOM = $($(e.target).parent());
                        } else if ($(e.target).attr('class') == 'time') {
                            timeDOM = $(e.target);
                        }

                        date = $(timeDOM).data('date');
                        time = $(timeDOM).data('hour');

                        var position = (e.pageX - 90) / (($(window).width() - 90) / 2);
                        position = position <= 1 ? 'left' : 'right';

                        if (timeDOM != '') {
                            Timeline.addEventPopup(date, time + ':00', position);
                        }
                    }
                }
            }

        });


        if (is_touch_device()) {

            $(Timeline.canvas).off('touchstart touchmove touchend scroll');

            $(Timeline.canvas).on('scroll', function (e) {
                if (Timeline.disableScroll) {
                    e.preventDefault();
                    return false;
                }
            });

            $(Timeline.canvas).on('touchstart', function (e) {
                if (Timeline.disableScroll) {
                    e.preventDefault();
                    return false;
                }
                Timeline.lEnableUpdate = false;
            });

            $(Timeline.canvas).on('touchmove', function (e) {
                if (Timeline.disableScroll) {
                    e.preventDefault();
                    return false;
                }
                Timeline.lEnableUpdate = false;
            });

            $(Timeline.canvas).on('touchend', function (e) {
                if (Timeline.disableScroll) {
                    e.preventDefault();
                    return false;
                }

                Timeline.lEnableUpdate = true;
            });

        }
        Timeline.setCommentsHandler();

        //Long touch group/project expand
        $(".project-block a").on('click touchend', function(event){
            clearTimeout(pressTimer)
            // Clear timeout
            if(needPrevent) {
                event.preventDefault();
            } else {
                 window.location = $(this).attr('href');
            }
        }).on('mousedown touchstart', function(){
            // Set timeout
            needPrevent = false;
            var pressLink = $(this);
            pressTimer = window.setTimeout(function() {
                var groupId = $(pressLink).data('project-id');
                needPrevent = true;
                Timeline.switchToProject(groupId);
            },600)
            return false;
        });

        $(".group-block a").on('click touchend', function(event){
            clearTimeout(pressTimer)
            // Clear timeout
            if(needPrevent) {
                event.preventDefault();
            } else {
                 window.location = $(this).attr('href');
            }
        }).on('mousedown touchstart', function(){
            // Set timeout
            needPrevent = false;
            var pressLink = $(this);
            pressTimer = window.setTimeout(function() {
                var groupId = $(pressLink).data('group-id');
                needPrevent = true;
                Timeline.switchToGroup(groupId);
            },600)
            return false;
        });

        $(".taskExpand").on('click touchend', function(event){
            clearTimeout(pressTimer)
            if(needPrevent) {
                event.preventDefault();
            } else {
                window.location = $(this).attr('href');
            }
        }).on('mousedown touchstart', function(){
            needPrevent = false;
            var pressLink = $(this);
            pressTimer = window.setTimeout(function() {
                var taskId = $(pressLink).data('task-id');
                needPrevent = true;
                Timeline.switchToTask(taskId);
            },600)
            return false;
        });
    },
    showDay: function () {
        $('.periodItem .calendar').each(function () {
            $(this).removeClass('closed');
            $('.eventListBlock:not(.emptyEventList)', $(this).parent()).animate({
                opacity: 'show',
                margin: 'show',
                padding: 'show',
                height: 'show'
            }, 800, 'easeOutQuint');
            $('.threeDots', $(this).parent()).slideDown(800, 'easeOutQuint');
        });
    },
    /*
    showEventPopup - отображение попапа для создания/редактирования событий

    sql_date: блок даты в которой создания попапа
    hours: блок времени, в котором создаётся попап
    action: определение позиции для редактирования/создания
    side: сторона, на которой создаётся попап
    type: исходный тип события при создании/редактировании
    */
    showEventPopup: function (sql_date, hours, action, side, type) {
        if( side != 'left' && side != 'right' ) side = 'left';
        //Timeline.eventPopupAllowed = false;
        var appendId = '';
        if(hours.substr(0, 2) == '00' && action == 'create') {
            hours = '23';
        }

        appendId = '#timeline_'+sql_date+'_'+hours.substr(0, 2)+'00 .'+side+'Side';
        parentId = '#timeline_'+sql_date+'_'+hours.substr(0, 2)+'00';

        if( $(appendId+' .eventModalContent').length == 0 ) {
            if( $(parentId).hasClass('emptyEventList') ) {
                if( !$(parentId).is(":visible") ) {
                    $(parentId).prevAll('.threeDots:first').trigger('click');
                }
            } else {
                if( !$(parentId).not(":visible") ) {
                    $('#row-day_'+sql_date+' .calendar').trigger('click');
                }
            }

            var popoverParent = $('.eventModalContent').parent();
            $('.eventModalContent').addClass('invisible');
            Timeline.lEnableUpdate = false;
            //console.log('Update disabled by event popup');
            var timeoutDelay = $('.periodItem .eventModalContent').length > 0 ? 600 : 0;

            setTimeout((function () {
                $(popoverParent).hide().show(0);
                Timeline.eventPopupElement = null;
                Timeline.eventPopupElement = $('.eventModalContent').detach();
                if(action == 'create') {
                    Timeline.eventPopupElement.last().appendTo(appendId);
                } else {
                    Timeline.eventPopupElement.last().insertAfter('#'+action);
                }
                $('.event-select').remove();
                $('.autocomplete-suggestions').css('z-index', 999999999);
                $('#UserEventDescr').trigger('autosize.resize');
                if(type != null) {
                    $('#UserEventType').val(type);
                    $('#UserEventType').change();
                }
                $('.eventModalContent').removeClass('invisible');
                Timeline.eventPopupActive = true;
            }), timeoutDelay);
        } else {
            Timeline.eventPopupAllowed = true;
        }
    },

    initEventPopup: function() {
        $('.eventModalContent #saveEventButton.loadBtn').on('click', function(){
            if( $('#delayEventButton').hasClass('loadBtn'))    $(this).removeClass('loadBtn');
            $(this).removeClass('disabled').addClass('disabled');
            Timeline.updateEvent();
        });

        $('.eventModalContent #delayEventButton.loadBtn').on('click', function(){
            $('#UserEventIsDelayed').val('1');

            $(this).removeClass('loadBtn');
            $(this).removeClass('disabled').addClass('disabled');

            $('#saveEventButton').trigger('click');
        });
        $('.global-tascks-button').on('click',function(){
          if($(this).hasClass('active')){
            $('input#UserEventExternal').val('');
            $(this).removeClass('active');
          }else{
            $('input#UserEventExternal').val('1');
            $(this).addClass('active');
          }

          //console.log('tets');
        });
        $('.eventModalContent #removeEventButton.loadBtn').on('click', function(){
            $(this).removeClass('loadBtn');
            $(this).removeClass('disabled').addClass('disabled');
            $('#delayEventButton').removeClass('disabled').addClass('disabled');
            $('#saveEventButton').removeClass('disabled').addClass('disabled');

            Timeline.deleteEvent();
        });

        $('.eventModalContent .circle_remove').on('touchstart click', function(e){
            Timeline.closeEventPopup();
            e.stopPropagation();
            return false;
        });
    },

    showEventSelector: function (sql_date, hours, action, side) {
        /*
        //non additional menu behavior
        if(!controlClicked && Timeline.eventPopupAllowed) {
            if( side != 'left' && side != 'right' ) side = 'left';
            Timeline.eventPopupAllowed = false;
            Timeline.showEventPopup(sql_date, hours, action, side);
            Timeline.eventPopupAllowed = true;
        }
        */
        if(!controlClicked && Timeline.eventPopupAllowed) {
            if( side != 'left' && side != 'right' ) side = 'left';
            Timeline.eventPopupAllowed = false;
            var appendId = '';
            if(hours.substr(0, 2) == '00' && action == 'create') {
                hours = '23';
            }

            appendId = '#timeline_'+sql_date+'_'+hours.substr(0, 2)+'00 .'+side+'Side';
            parentId = '#timeline_'+sql_date+'_'+hours.substr(0, 2)+'00';

            if( $(appendId+' .eventModalContent').length == 0 ) {
                if( $(parentId).hasClass('emptyEventList') ) {
                    if( !$(parentId).is(":visible") ) {
                        $(parentId).prevAll('.threeDots:first').trigger('click');
                    }
                } else {
                    if( !$(parentId).not(":visible") ) {
                        $('#row-day_'+sql_date+' .calendar').trigger('click');
                    }
                }

                var popoverParent = $('.eventModalContent').parent();
                $('.eventModalContent').addClass('invisible');
                Timeline.lEnableUpdate = false;
                console.log('Update disabled by event popuper');
                var timeoutDelay = $('.periodItem .eventModalContent').length > 0 ? 600 : 0;
                var eSelector = tmpl('event-selector', {
					side: side,
					sql_date: sql_date,
					hours: hours,
					action: action
				});
                $(appendId).append( eSelector );
                 $('.event-select .menu-inner-item').off();

                 $('.event-select').removeClass('collapsed');
                setTimeout((function () {
                  $("#menu-open").prop('checked', true);
                //    $('.event-select .menu-inner-item').off();


                    //для закрытия по нажатию на крест
                  //  $('.event-select .menu-open-button').off();

                  //  $('.event-select').removeClass('collapsed');
                }), 100);

                $('.event-select .menu-inner-item').on('click', function() {
                    var selectedItem = $(this);
					if ($(this).hasClass('alreadyDrag')) {
						return;
					}
                    $(this).addClass('selected');
                    setTimeout(function() {
                        $('.event-select').off();
                        $('.event-select').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
                            if (event.originalEvent.propertyName == 'opacity' && selectedItem.data('type') != 'document') {
                                Timeline.showEventPopup(sql_date, hours, action, side, selectedItem.data('type'));
                            }
                        });
                        $('.event-select').addClass('collapsed');
                        Timeline.eventPopupAllowed = true;
                    }, 500);
                });

				/** Start - drag 'n' drop function on flower events */
				$('.event-select .menu-inner-item').draggable({
					start: function() {
						$(this).addClass('alreadyDrag');
					}},{
					stop: function() {
						$(this).removeClass('alreadyDrag');
					}}, {
					revert: "invalid"
				});
                /** END - drag 'n' drop function on flower events */
                $('.menu-open-button').on('click', function(e) {
                    e.preventDefault();
                    $("#menu-open").prop('checked', false);
                    $('.event-select').off();
                    $('.event-select').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event){
                        Timeline.eventPopupAllowed = true;
                        $('.event-select').remove();
                        //Enable timleine update after close
                        Timeline.lEnableUpdate = true;
                        //this collaps does not work
                        //Timeline.collapseEmptyCells();
                        //buggy collapse
                        //$('.emptyEventList').hide();
                    });
                    //console.log('Update enabled after popupper close');
                    $('.event-select').addClass('collapsed');
                });
            } else {
                Timeline.eventPopupAllowed = true;
            }
        }
    },
    closeEventPopup: function (allow) {
        allow = (typeof allow === 'undefined') ? true : false;
        //$('#UserEventTitle').autocomplete('hide');
        $('#UserEventTitle').popover('hide');
        $('#UserEventType').popover('hide');

        var popoverParent = $('.eventModalContent').parent();
        $('.eventModalContent').addClass('invisible')
        setTimeout((function () {
            Timeline.eventPopupActive = false;
            Timeline.eventPopupElement = null;
            Timeline.eventPopupElement = $('.eventModalContent').detach();
            Timeline.eventPopupElement.last().appendTo('.eventTypeModal .modal-dialog');
            if (allow) {
                Timeline.eventPopupAllowed = true;
            }
            //console.log('Enable update after popup close');
            Timeline.lEnableUpdate = true;
            $(popoverParent).hide().show(0);

            mapInitialized = false;
            $('#map-canvas').hide();
        }), 600);
    },
    removeEventPopup: function () {
        $('#UserEventTitle').autocomplete('hide');
        $('#UserEventTitle').popover('destroy');

        Timeline.eventPopupElement = null;
        Timeline.eventPopupElement = $('.eventModalContent').detach();
        Timeline.eventPopupElement.last().appendTo('.eventTypeModal .modal-dialog');
        Timeline.eventPopupActive = false;
    },
    addEventPopup: function (sql_date, hours, side) {

        if (side != 'left' && side != 'right')
            side = 'left';

        $('.eventModalContent input').val('');
        var aHoursMinutes = hours.split(':');
        var js_date = Date.fromSqlDate(sql_date);
        js_date.setHours(parseInt(hours));
        Timeline.showEventSelector(sql_date, hours, 'create', side);
        $('.eventModalContent #timeStart input').val(Date.HoursMinutes(js_date, locale));
        $(".eventModalContent .groupAccess").html('');
        $('.eventModalContent #UserEventId').val('');
        $('.eventModalContent #UserEventRecipientId').val('');
        $('.eventModalContent #UserEventObjectType').val('');
        $('.eventModalContent #UserEventObjectId').val('');
        $('.eventModalContent #UserEventTitle').val('');
        $('.eventModalContent #UserEventDescr').val('');
        $('.eventModalContent form .groupAccess').removeClass('one').removeClass('more');
        js_date.setHours(0);
        $('.eventModalContent #monthStart').val(js_date.getMonth() + 1).change();
        $('.eventModalContent #dayStart').val(js_date.getDate()).change();
        $('.eventModalContent #UserEventYearStart').val(js_date.getFullYear()).change();
        $('.eventModalContent #timeStart').val(parseInt(hours)).change();
        $('.eventModalContent #minuteStart').val('00').change();
        $('.eventModalContent #timeDuration').val(0).change();
        $('.eventModalContent #UserEventType').val('blank').change();
        $('.eventModalContent #uList .token').remove();
        $('.eventModalContent #uList').addClass('empty');
        $('.eventModalContent #removeEventButton').hide();
        $('.eventModalContent #saveEventButton').show();
        $('.eventModalContent #UserEventTitle').prop('readonly', false).change();
        $('.eventModalContent #userSearch').prop('readonly', false).change();
        $('.eventModalContent #UserEventDescr').prop('readonly', false).change();
        $('.eventModalContent #UserEventType').attr('disabled', false).trigger('refresh');
        $('.eventModalContent #uList').removeClass('disabled');

        $('#UserEventAmount').val('');
        $('#UserEventFinanceCategory').val('');
        $('#UserEventFinanceProject option:first-child').attr("selected", "selected").change();
    },
    editEventPopup: function (sql_date, time, sql_date2, time2, eType, recipientId, objType, objId, event_id, shared, owned, place, coords, operationId, price, eCategoryId) {
        await = 0;
        if (Timeline.eventPopupActive) {
            Timeline.closeEventPopup();
            await = 800;
        }

        setTimeout((function () {
            owned = (typeof owned === 'undefined') ? false : owned;
            var e = $('#user-event_' + event_id).get(0);
            Timeline.showEventPopup(sql_date, time, $(e).prop('id'));
            var aHoursMinutes = time.split(':');
            var hours = aHoursMinutes[0];
            var minutes = aHoursMinutes[1];
            var js_date = Date.fromSqlDate(sql_date);
            js_date.setHours(parseInt(hours));
            js_date.setMinutes(parseInt(minutes));
            var aHoursMinutes2 = time2.split(':');
            var hours2 = aHoursMinutes2[0];
            var minutes2 = aHoursMinutes2[1];
            var js_date2 = Date.fromSqlDate(sql_date2);
            js_date2.setHours(parseInt(hours2));
            js_date2.setMinutes(parseInt(minutes2));
            var duration = js_date2.getTime();
            duration -= js_date.getTime();
            duration = duration / 60000;
            if (([15, 30, 60, 120, 180, 240, 480]).indexOf(duration) < 0) {
                duration = 0;
            }
            var period = '';
            $('.eventModalContent #monthStart').val(js_date.getMonth() + 1).change();
            $('.eventModalContent #dayStart').val(js_date.getDate()).change();
            $('.eventModalContent #timeStart').val(js_date.getHours()).change();
            $('.eventModalContent #minuteStart').val(zeroFormat(js_date.getMinutes())).change();
            $('.eventModalContent #UserEventYearStart').val(js_date.getFullYear()).change();
            $('.eventModalContent #timeDuration').val(duration).change();
            $('.eventModalContent #uList .token').remove();
            $(".eventModalContent .groupAccess").html('');
            if (recipientId.length != 0) {
                var recipients = recipientId.split(',');
                recipients.forEach(function (uid) {
                    var postData = {
                        q: ''
                    };
                    $.post("/UserAjax/getById/" + uid, postData, (function (data) {
                        item = $.parseHTML(data);
                        item = item[0];
                        var html = tmpl('user-select', {
                            id: $(item).data('user_id'),
                            name: $(".name", item).text(),
                            url: $('img', item).attr('src')
                        });
                        $('#eventUserList').append(html);
                        $('#uList').removeClass('empty');
                    }));
                })
            } else {
                $('.eventModalContent form .groupAccess').removeClass('one').removeClass('more');
                $('#uList').addClass('empty');
            }
            eType = ['meet', 'mail', 'call', 'sport', 'conference', 'task', 'purchase', 'entertain', 'pay'].indexOf(eType) < 0 ? 'none' : eType;
            $('.eventModalContent #UserEventId').val(event_id);
            $('.eventModalContent #UserEventType').val(eType);
            $('.eventModalContent #UserEventType').change();
            $('.eventModalContent #UserEventRecipientId').val(recipientId);
            $('.eventModalContent #UserEventObjectType').val(objType);
            $('.eventModalContent #UserEventObjectId').val(objId);
            $('.eventModalContent #UserEventTimeEvent').val(Date.HoursMinutes(js_date, locale));
            //$('#UserEventJsDateEvent').val(Date.fullDate(js_date, locale));
            $('.eventModalContent #UserEventTitle').val($('.text .title', e).html());
            $('.eventModalContent #UserEventDescr').val($('.text .eDescr', e).html());
            $('.eventModalContent #UserEventPlaceName').val(place);
            $('.eventModalContent #UserEventPrice').val(price);
            if($('.eventModalContent #UserEventEventCategoryId').length && eCategoryId != 'undefined') {
                $('.eventModalContent #UserEventEventCategoryId').val(eCategoryId);
                $('.eventModalContent #UserEventEventCategoryId').change();
            }
            if(event_id != undefined)
              $('.global-tascks-button').hide();
            if ((eType == 'pay' || eType == 'purchase') && operationId !== 'undefined') {
                //
                $.post(profileURL.eventOperation, {
                    data: {id: operationId}
                }, function (response) {
                    var amountStr = response.data.FinanceOperation.amount;
                    $('#UserEventAmount').val(amountStr.substring(1, amountStr.length));
                    $('#UserEventFinanceCategory').val(response.data.Categories[0].name);
                    $('#UserEventFinanceProject').val(response.data.FinanceOperation.project_id).change();
                    setTimeout(function () {
                        $('#UserEventFinanceAccount').val(response.data.FinanceOperation.account_id).change();
                    }, 10)
                });
            } else {
                $('#UserEventAmount').val('');
                $('#UserEventFinanceCategory').val('');
                $('#UserEventFinanceProject option:first-child').attr("selected", "selected").change();
            }

            if (coords != '' && coords !== 'undefined') {

                setTimeout((function () {
                    $('#map-canvas').show();
                    coords = coords.replace('(', '');
                    coords = coords.replace(')', '');
                    var latlngStr = coords.split(',', 2);
                    var lat = parseFloat(latlngStr[0]);
                    var lng = parseFloat(latlngStr[1]);
                    var latlng = new google.maps.LatLng(lat, lng);
                    coordAddress(latlng, true);
                }), 600);
            }
            if (!owned) {
                $('.eventModalContent #UserEventTitle').prop('readonly', true).change();
                $('.eventModalContent #userSearch').prop('readonly', true).change();
                $('.eventModalContent #UserEventDescr').prop('readonly', true).change();
                $('.eventModalContent #UserEventType').attr('disabled', true).trigger('refresh');
                $('.eventModalContent #uList').addClass('disabled');
                $('.eventModalContent #removeEventButton').hide();
            } else {
                $('.eventModalContent #UserEventTitle').prop('readonly', false).change();
                $('.eventModalContent #userSearch').prop('readonly', false).change();
                $('.eventModalContent #userSearch').attr('disabled', false);
                $('.eventModalContent #UserEventPlaceName').attr('disabled', false);
                $('.eventModalContent #UserEventDescr').prop('readonly', false).change();
                $('.eventModalContent #UserEventType').attr('disabled', false).trigger('refresh');
                $('.eventModalContent #uList').removeClass('disabled');
                $('.eventModalContent #removeEventButton').show();
            }
        }), await);
    },
    updateEvent: function () {
        if (eventIsValid()) {
            Timeline.lEnableUpdate = false;
            var i = 0;
            var str = '';
            $('#uList .token').each(function () {
                i++;
                if (i == 1) {
                    str += $(this).data('user-id');
                } else {
                    str += ',' + $(this).data('user-id')
                }
            })
            $('#UserEventRecipientId').val(str);
            Timeline.closeEventPopup(false);

            setTimeout((function () {
                Timeline.eventPopupAllowed = false;
                $.post(profileURL.updateEvent, $('.eventModalContent form').serialize(), function (response) {
                    if (checkJson(response)) {
                        if ($('#UserEventId').val() != '') {
                            $('#user-event_' + $('#UserEventId').val()).remove();
                        }

                        var js_date = Date.fromSqlDate(response.data.event.UserEvent.event_time);
                        js_date.setHours(0);
                        Timeline.updateDay(js_date.toSqlDate(), response.data);

                        $('#uList .token').remove();
                        $('#uList').addClass('empty');

                        $('.eventModalContent #saveEventButton').addClass('loadBtn');
                        $('.eventModalContent #saveEventButton').removeClass('disabled');

                        $('.eventModalContent #delayEventButton').addClass('loadBtn');
                        $('.eventModalContent #delayEventButton').removeClass('disabled');

                        $('.eventModalContent #removeEventButton').addClass('loadBtn');
                        $('.eventModalContent #removeEventButton').removeClass('disabled');

                    }
                    Timeline.lEnableUpdate = true;
                    Timeline.eventPopupAllowed = true;
                });
            }), 650);
        }
    },
    deleteEvent: function () {
        Timeline.lEnableUpdate = false;
        Timeline.closeEventPopup();

        setTimeout((function () {
            $.post(profileURL.deleteEvent, $('.eventModalContent form').serialize(), function (response) {
                if (checkJson(response)) {
                    var js_date = Date.fromSqlDate(response.data.event.UserEvent.event_time);
                    js_date.setHours(0);
                    Timeline.updateDay(js_date.toSqlDate(), response.data.timeline);

                    $('.eventModalContent #saveEventButton').addClass('loadBtn');
                    $('.eventModalContent #saveEventButton').removeClass('disabled');

                    $('.eventModalContent #delayEventButton').addClass('loadBtn');
                    $('.eventModalContent #delayEventButton').removeClass('disabled');

                    $('.eventModalContent #removeEventButton').addClass('loadBtn');
                    $('.eventModalContent #removeEventButton').removeClass('disabled');
                }
                Timeline.closeEventPopup();
                Timeline.lEnableUpdate = true;
            });
        }), 850);
    },
    acceptEvent: function (id,user_id) {
        Timeline.lEnableUpdate = false;
        $.post(profileURL.acceptEvent, {id: id,user_id:user_id}, function (response) {
            if (checkJson(response)) {
                $('#user-event_' + id + ' .control').remove();
            }
            Timeline.closeEventPopup();
            Timeline.lEnableUpdate = true;
            controlClicked = false;
        });
    },
    declineEvent: function (id,user_id) {
        Timeline.lEnableUpdate = false;
        $.post(profileURL.declineEvent, {id: id,user_id:user_id}, function (response) {
            if (checkJson(response)) {
                $('#user-event_' + id).remove();
            }
            Timeline.closeEventPopup();
            Timeline.lEnableUpdate = true;
            controlClicked = false;
        });
    },
    updateState: function () {
        if (Timeline.isUpdateEnabled()) {
            //console.log('Update enabled');
			var linkSendFile = profileURL.fileSendHere;
            Timeline.tempCanvasLock = true;

            doneEvent = function (response) {
                //console.log('Done event started');
                if (checkJson(response)&&(Timeline.lEnableUpdate != false)) {
                    console.log('Json checked');
                    if (JSON.stringify(response.data.events) === JSON.stringify(Timeline.prevUpdateData.events) &&
                            JSON.stringify(response.data.group_join_requests) === JSON.stringify(Timeline.prevUpdateData.join) &&
                            JSON.stringify(response.data.invites) === JSON.stringify(Timeline.prevUpdateData.invites)) {
                        console.log('No any updates needed. Enable application update');
                        Timeline.lEnableUpdate = true;
                        Timeline.tempCanvasLock = false;
                        return false;
                    }

                    console.log('Update application');
                    Timeline.lEnableUpdate = false;
                    Timeline.updateDay(todayDate, response.data);

                    setTimeout((function () {
                        console.log('Enable application update');
                        Timeline.lEnableUpdate = true;
                        Timeline.tempCanvasLock = false;
                    }), 500);
                } else {
                    //console.log('Update disabled. Nothing to do!');
                }
				//Add drag'n'drop to files in timeline. Here, because timeline always updated and remove draggable from elements
				Timeline.addDrag();
                //console.log('Done event finished');
            }

            //Websockets disabled due timeline rework
            //if(highWay.isOpen()){
            //    highWay.call(
            //        'transport.proxy.mytime.events.update',
            //        [{
            //            userId: KonstruktorAdapterOptions.CURRENT_USER_ID,
            //            date: todayDate,
            //            date2: todayDate,
            //            view: Timeline.viewState,
            //            search: Timeline.search
            //        }]
            //    ).then(doneEvent);
            //} else {
                $.post(profileURL.timelineEvents, {
                    data: {
                        date: todayDate,
                        date2: todayDate,
                        view: Timeline.viewState,
                        search: Timeline.search
                    }
                }).done(doneEvent);
            //}
        } else {
            //console.log('Update disabled');
        }
        Timeline.setCommentsHandler();
    },
    updateDay: function (sql_date, data) {
        Timeline.prevUpdateData.events = data.events;
        Timeline.prevUpdateData.join = data.group_join_requests;
        Timeline.prevUpdateData.invites = data.invites;

        Timeline.topDate = Date.fromSqlDate(sql_date);
        Timeline.bottomDate = Date.fromSqlDate(sql_date);
        var html = Timeline.renderEvents(data, 0);
        // сделать проверку пришедшего пакета, выполнять только если события для текущего дня разнятся
        $('#row-day_' + sql_date).replaceWith(html);
        if (sql_date == todayDate) {
            Timeline.insertCurrentTime();
        }
        if (Timeline.viewState == Timeline.VIEW_STATE_DAY) {
            Timeline.collapseEmptyCells();
            Timeline.initCollapsibles();
        }

        if (Timeline.viewState != Timeline.VIEW_STATE_DAY) {
            $('.periodItem .eventListBlock', $('.expanded.exp-week')).each(function () {
                var leftEvents = $('.leftSide .event', $(this));
                var rightEvents = $('.rightSide .event', $(this));
                if (leftEvents.length == 0 && rightEvents.length == 0) {
                    $('.time', $(this)).addClass('emptyTime');
                }
            });
        }

        Timeline.initHandlers();
        $('.emptyEventList', $('#row-day_' + sql_date)).hide();
    },
    shrinkDurations: function (parent) {
        if (parent == undefined)
            parent = $(document);

        var events = $('.userEvent', $(parent));
        for (var i = 0; i < events.length; i++) {
            var durDOM = $('.duration', $(events[i]));
            durDOM.css({height: $(events[i]).outerHeight(), bottom: 0});
            durDOM.removeClass('hidden');
        }
    },
    expandYear: function (getYear) {

        //Timeline.lEnableUpdate = false;
        $('.ajax-loader').show();

        getYear = parseInt(getYear);

        sDate = moment(getYear + '-01-01').startOf('year').add(1, 'month')._d;
        eDate = moment(sDate).endOf('year').add(1, 'month')._d;

        vState = 2;

        if ($('.expanded.exp-year').length > 0) {
            $('.expanded.exp-year').animate({
                opacity: "hide",
                height: "hide"
            }, 400, 'easeOutQuint');
        }
        $('.eventListBlock', $('.expanded.exp-year').prev()).animate({
            opacity: "show",
            height: "show"
        }, 400, 'easeOutQuint');

        doneEvent = function (response) {
            if (checkJson(response)) {
                Timeline.expand = true;
                var expandHtml = Timeline.renderEvents(response.data, Timeline.VIEW_STATE_MONTH, sDate, eDate);
                Timeline.expand = false;

                if ($('.eventModalContent', $('.expanded.exp-year')).length > 0) {
                    Timeline.removeEventPopup();
                }
                $('.expanded.exp-year').remove();
                $('<div class="expanded exp-year" style="display: none;"></div>').insertAfter('#row-year_' + getYear + '-01-01');
                $('.expanded.exp-year').html(expandHtml);
                var offset = $('#row-year_' + getYear + '-01-01').position().top;
                offset = offset - $('.headerTimeline').height();
                $('.wrapper-container').animate({
                    scrollTop: offset - 40
                }, 600, 'easeOutExpo');
                $('.expanded.exp-year').animate({
                    opacity: "show",
                    height: "show"
                }, 600, 'easeOutQuint', function () {
                    Timeline.initHandlers();
                });

                $('.ajax-loader').hide();
                $('#row-year_' + getYear + '-01-01.eventListBlock').animate({
                    opacity: "hide",
                    height: "hide"
                }, 600, 'easeOutQuint');
            }
        };

        //Websockets disabled due timeline rework
        //if(highWay.isOpen()){
        //    highWay.call(
        //        'transport.proxy.mytime.events.update',
        //        [{
        //            userId: KonstruktorAdapterOptions.CURRENT_USER_ID,
        //            date: sDate.toSqlDate(),
        //            date2: eDate.toSqlDate(),
        //            view: vState,
        //            search: Timeline.search
        //        }]
        //    ).then(doneEvent);
        //} else {
            $.post(profileURL.timelineEvents, {
                data: {
                    date: sDate.toSqlDate(),
                    date2: eDate.toSqlDate(),
                    view: vState,
                    search: Timeline.search
                }
            }).done(doneEvent);
        //}

    },
    expandMonth: function (getMonth) {

        //Timeline.lEnableUpdate = false;
        $('.ajax-loader').show();

        sDate = moment(getMonth).startOf('month')._d;
        eDate = moment(sDate).endOf('month')._d;

        vState = 1;

        if ($('.expanded.exp-month').length > 0) {
            $('.expanded.exp-month').animate({
                opacity: "hide",
                height: "hide"
            }, 400, 'easeOutQuint');
        }
        $('.eventListBlock', $('.expanded.exp-month').prev()).animate({
            opacity: "show",
            height: "show"
        }, 400, 'easeOutQuint');

        doneEvent = function (response) {
            if (checkJson(response)) {
                Timeline.expand = true;
                var expandHtml = Timeline.renderEvents(response.data, Timeline.VIEW_STATE_WEEK, sDate, eDate);
                Timeline.expand = false;

                // иинтерфейсная часть и добавление

                if ($('.eventModalContent', $('.expanded.exp-month')).length > 0) {
                    Timeline.removeEventPopup();
                }

                $('.expanded.exp-month').remove();
                $('<div class="expanded exp-month" style="display: none;"></div>').insertAfter('#row-month_' + getMonth);
                $('.expanded.exp-month').html(expandHtml);
                var offset = $('#row-month_' + getMonth).position().top;
                offset = offset - $('.headerTimeline').height();
                $('.wrapper-container').animate({
                    scrollTop: offset - 40
                }, 600, 'easeOutExpo');
                $('.expanded.exp-month').animate({
                    opacity: "show",
                    height: "show"
                }, 600, 'easeOutQuint', function () {
                    Timeline.initHandlers();
                });
                $('#row-month_' + getMonth + '.eventListBlock').animate({
                    opacity: "hide",
                    height: "hide"
                }, 600, 'easeOutQuint');

                $('.ajax-loader').hide();
            }
        };

        //Websockets disabled due timeline rework
        //if(highWay.isOpen()){
        //    highWay.call(
        //        'transport.proxy.mytime.events.update',
        //        [{
        //            userId: KonstruktorAdapterOptions.CURRENT_USER_ID,
        //            date: sDate.toSqlDate(),
        //            date2: eDate.toSqlDate(),
        //            view: vState,
        //            search: Timeline.search
        //        }]
        //    ).then(doneEvent);
        //} else {
            $.post(profileURL.timelineEvents, {
                data: {
                    date: sDate.toSqlDate(),
                    date2: eDate.toSqlDate(),
                    view: vState,
                    search: Timeline.search
                }
            }).done(doneEvent);
        //}
    },
    expandDay: function (getDay) {
        //Timeline.lEnableUpdate = false;
        $('.ajax-loader').show();

        sDate = moment(getDay).startOf('day')._d;
        eDate = moment(sDate).endOf('day')._d;

        vState = 0;

        if ($('.expanded.exp-week').length > 0) {
            $('.expanded.exp-week').animate({
                opacity: "hide",
                height: "hide"
            }, 400, 'easeOutQuint');
        }
        $('.eventListBlock', $('.expanded.exp-week').prev()).animate({
            opacity: "show",
            height: "show"
        }, 400, 'easeOutQuint');

        doneEvent = function (response) {
            if (checkJson(response)) {
                Timeline.expand = true;
                var expandHtml = Timeline.renderEvents(response.data, Timeline.VIEW_STATE_DAY, sDate, eDate);
                Timeline.expand = false;

                if ($('.eventModalContent', $('.expanded.exp-week')).length > 0) {
                    Timeline.removeEventPopup();
                }

                $('.expanded.exp-week').remove();
                $('<div class="expanded exp-week" style="display: none;"></div>').insertAfter('#row-week_' + getDay);
                $('.expanded.exp-week').html(expandHtml);

                $('.periodItem .eventListBlock', $('.expanded.exp-week')).each(function () {
                    var leftEvents = $('.leftSide .event', $(this));
                    var rightEvents = $('.rightSide .event', $(this));
                    if (leftEvents.length == 0 && rightEvents.length == 0) {
                        $('.time', $(this)).addClass('emptyTime');
                    }
                });

                var offset = $('#row-week_' + getDay).position().top;
                offset = offset - $('.headerTimeline').height();
                $('.wrapper-container').animate({
                    scrollTop: offset - 40
                }, 600, 'easeOutExpo');

                $('.expanded.exp-week').animate({
                    opacity: "show",
                    height: "show"
                }, 600, 'easeOutQuint', function () {
                    Timeline.initHandlers();
                });
                $('#row-week_' + getDay + '.eventListBlock').animate({
                    opacity: "hide",
                    height: "hide"
                }, 600, 'easeOutQuint');

                $('.ajax-loader').hide();
            }
        };

        //Websockets disabled due timeline rework
        //if(highWay.isOpen()){
        //    highWay.call(
        //        'transport.proxy.mytime.events.update',
        //        [{
        //            userId: KonstruktorAdapterOptions.CURRENT_USER_ID,
        //            date: sDate.toSqlDate(),
        //            date2: eDate.toSqlDate(),
        //            view: vState,
        //            search: Timeline.search
        //        }]
        //    ).then(doneEvent);
        //} else {
            $.post(profileURL.timelineEvents, {
                data: {
                    date: sDate.toSqlDate(),
                    date2: eDate.toSqlDate(),
                    view: vState,
                    search: Timeline.search
                }
            }).done(doneEvent);
        //}
    },
    onScrollTop: function () {
        if (Timeline.isUpdateEnabled()) {
//            Timeline.disableScrolling();
            Timeline.lEnableUpdate = false;
//            Timeline.disableTopScroll.value = true;
            period = Timeline.loadPeriodNormal;
            if(Date.fromSqlDate(todayDate).addDays(Timeline.topDay) <= Date.fromSqlDate(todayDate)){
                period = Timeline.loadPeriodSmall;
            }
            Timeline.topDay += period;

            var excessDays = Timeline.topDay - Timeline.bottomDay - 46;
            if (excessDays > 0) {
                Timeline.bottomDay += excessDays;
                excessDays = 45 - period;

                if ($('.eventModalContent', $('.periodItem:gt(' + excessDays + ')')).length > 0) {
                    Timeline.removeEventPopup();
                }

                $('.periodItem:gt(' + excessDays + ')').remove();
            }

            if (Timeline.viewState == Timeline.VIEW_STATE_MONTH) {
                if (Timeline.topDay > 84 * 30)
                    Timeline.topDay = 84 * 30;
            }

            Timeline.topDate = Date.fromSqlDate(todayDate).addDays(Timeline.topDay);
            Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(Timeline.topDay - period + 1);

            Timeline.initialLoad = true;
            Timeline.scrollLoad = true;
            Timeline.update(true);
        }
    },
    onScrollBottom: function () {
        if (Timeline.isUpdateEnabled() && !$('.defaultEvent').length) {
//            Timeline.disableBottomScroll.value = true;
            Timeline.tempCanvasLock = true;
            var excessDays = Timeline.topDay - Timeline.bottomDay - 32;
            if (excessDays > 0) {
                Timeline.topDay -= excessDays;
                if ($('.eventModalContent', $('.periodItem:lt(' + excessDays + ')')).length > 0) {
                    Timeline.removeEventPopup();
                }
                $('.periodItem:lt(' + excessDays + ')').remove();
            }

            Timeline.topDate = Date.fromSqlDate(todayDate).addDays(Timeline.bottomDay - 1);
            //Old one direction way`
            //Timeline.bottomDay -= Timeline.loadPeriodSmall;

            //smart way for scrolling
            if(Date.fromSqlDate(todayDate) <= Date.fromSqlDate(todayDate).addDays(Timeline.bottomDay - Timeline.loadPeriodSmall)){
                Timeline.bottomDay -= Timeline.loadPeriodNormal;
            } else {
                Timeline.bottomDay -= Timeline.loadPeriodSmall;
            }

            if (Timeline.bottomDay < startDay) {
                Timeline.bottomDay = startDay;
                Timeline.lEnableUpdate = true;
                Timeline.tempCanvasLock = false;
            }
            Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(Timeline.bottomDay);

            if (Timeline.topDate.getTime() >= Timeline.bottomDate.getTime()) {
                Timeline.initialLoad = true;
                Timeline.scrollLoad = false;
                Timeline.update(false);

            }
        }
    },
    setCommentsHandler: function () {
        $('.commentLink').on('click', function (e) {
            e.preventDefault();
            var commentsBlock = $(this).parent();
            $(this).attr('class', 'commentLinkactive');
            if (commentsBlock.find('.comment-block').css('display') == undefined) {
                var datablock = $('<div />').addClass('comment-block').css('display', 'block').appendTo(commentsBlock);
                $.get($(this).data('comments-url'), function (html) {
                    datablock.html(html);
                });
                Timeline.lEnableUpdate = false;
            }
            e.stopPropagation();
        });
		$('.commentLinkactive').off('click');
        $('.commentLinkactive').on('click', function (e) {
            e.preventDefault();
            //ar commentsBlock = $(this).parent();
            $('.comment-block').remove();
            $(this).attr('class', 'commentLink');

            e.stopPropagation();
        });
    },
    isUpdateEnabled: function () {
        return Timeline.lEnableUpdate && !$('.dropdown-panel.dropdown-open').length && Timeline.viewState < 2 && !Timeline.tempCanvasLock && !Timeline.eventPopupActive && (Timeline.search.length == 0) && !Timeline.groupViewState;
    },
    disableScrolling: function () {
//        Timeline.disableScroll = true;
    },
    enableScrolling: function () {
//        Timeline.disableScroll = false;
    },

    //GROUP JOIN/INVITE FUNCTIONS
    acceptInvite: function (id, inviteId) {
        $.post(groupURL.inviteAccept, {
            data: {id: id}
        }, function (response) {
            if (response.status == 'OK' && response.data == 'done') {
                $('#invite-request-' + inviteId).remove();
                Timeline.updateState();
            }
        }).fail(function (response) {
            if (response.responseJSON.message != undefined) {
                alert(response.responseJSON.message);
            } else {
                alert('There is unable to process your request. Please report this incident in our support system');
            }
        });
    },
    declineInvite: function (id, inviteId) {
        $('.buttons, .accept-buttons', $('#invite-request-' + inviteId)).hide();
        $.post(groupURL.inviteDecline, {
            data: {id: id}
        }, function (response) {
            if (response.status == 'OK' && response.data == 'done') {
                $('#invite-request-' + inviteId).remove();
                Timeline.updateState();
            } else {
                $('.buttons', $('#invite-request-' + inviteId)).show();
            }
        });
    },
    initJoin: function (element) {
      Timeline.lEnableUpdate = false;
        $(element.parent()).hide();
        $('.accept-buttons', $(element.parents('.joinBlock'))).removeClass('hidden').show();
//        Timeline.disableScroll = false;
    },
    acceptJoin: function (user_id, group_id, joinId) {
        var role = $('input', $('#join-request-' + joinId)).val();
        //$('.buttons, .accept-buttons', $('#join-request-'+joinId)).hide();

        $.post(groupURL.memberApprove, {
            data: {
                user_id: user_id,
                group_id: group_id,
                role: role
            }
        }, function (response) {
            if (response.status == 'OK' && response.data == 'done') {
                $('#join-request-' + joinId).remove();
                Timeline.updateState();
            }
        }).fail(function (response) {
            if (response.responseJSON.message != undefined) {
                alert(response.responseJSON.message);
            } else {
                alert('There is unable to process your request. Please report this incident in our support system');
            }
        });
    },
    declineJoin: function (user_id, group_id, joinId) {
        $('.buttons, .accept-buttons', $('#join-request-' + joinId)).hide();
        $.post(groupURL.memberRemove, {
            data: {
                user_id: user_id,
                group_id: group_id
            }
        }, function (response) {
            if (response.status == 'OK' && response.data == 'done') {
                $('#join-request-' + joinId).remove();
                Timeline.updateState();
            } else {
                $('.buttons', $('#join-request-' + joinId)).show();
            }
        });
    },

    // -------------------- GROUP PART OF TIMELINE -------------------- //

    switchToGroup: function(id) {
        $('.ajax-loader').show();

        var data = '';
        $.post('/GroupAjax/groupDetails/'+id+'.json', function (response) {
            if(response.status != 'OK') {
                //console.log(response.errMsg);
                $('.ajax-loader').hide();
                return false
            }
            Timeline.groupViewState = true;
            $(Timeline.canvas).animate({opacity: 0}, 600, 'easeOutExpo', function() {
                $('.wrapper-container').scrollTop(0);
                data = response;
                Timeline.renderGroup(data);
                Timeline.generateBreadcrumbs('group', data.data);
                $(Timeline.canvas).animate({opacity: 1}, 600, 'easeOutExpo');
                $('.ajax-loader').hide();
            });
        });
    },

    backFromGroup: function() {
        Timeline.groupViewState = false;
        Timeline.setSearch('');
        $('#searchInput').val('');
        if( !$('#showDay').hasClass('active') ) {
            $('#showDay').removeClass('active').addClass('active');
            $('#showWeek').removeClass('active');
            $('#showMonth').removeClass('active');
            $('#showYear').removeClass('active');
            Timeline.setViewState(Timeline.VIEW_STATE_DAY);
        } else {
            if( $('.calendar.currentDate').length == 0 ) {
                Timeline.setViewState(Timeline.VIEW_STATE_DAY);
            } else {
                Timeline.scrollCurrentDayAnimated();
            }
        }
        $('#breadcrumb').hide();
    },

    switchToProject: function(id) {
        $('.ajax-loader').show();

        var data = '';
        $.post('/GroupAjax/projectDetails/'+id+'.json', function (response) {
            if(response.status != 'OK') {
                //console.log(response.errMsg);
                $('.ajax-loader').hide();
                return false
            }
            Timeline.groupViewState = true;
            $(Timeline.canvas).animate({opacity: 0}, 600, 'easeOutExpo', function() {
                $('.wrapper-container').scrollTop(0);
                data = response;
                Timeline.renderProject(data);
                Timeline.generateBreadcrumbs('project', data.data);
                $(Timeline.canvas).animate({opacity: 1}, 600, 'easeOutExpo');
                $('.ajax-loader').hide();
            });

        });
    },

    renderGroup: function(data) {
        $('#mainContainer').html('');
        html = tmpl('group-state-day', {data: data.data});
        $('#mainContainer').prepend(html);

        $(".groupView-project a").on('click touchend', function(event){
            clearTimeout(pressTimer)
            // Clear timeout
            if(needPrevent) {
                event.preventDefault();
            } else {
                 window.location = $(this).attr('href');
            }
        }).on('mousedown touchstart', function(){
            // Set timeout
            needPrevent = false;
            var pressLink = $(this);
            pressTimer = window.setTimeout(function() {
                var groupId = $(pressLink).data('project-id');
                needPrevent = true;
                Timeline.switchToProject(groupId);
            },600)
            return false;
        });
    },

    renderProject: function(data) {
        $('#mainContainer').html('');
        html = tmpl('project-state-day', {
            data: data.data
        });
        $('#mainContainer').prepend(html);

        $(".projectView-task a").on('click touchend', function(event){
            clearTimeout(pressTimer)
            // Clear timeout
            if(needPrevent) {
                event.preventDefault();
            } else {
                 window.location = $(this).attr('href');
            }
        }).on('mousedown touchstart', function(){
            // Set timeout
            needPrevent = false;
            var pressLink = $(this);
            pressTimer = window.setTimeout(function() {
                var taskId = $(pressLink).data('task-id');
                needPrevent = true;
                Timeline.switchToTask(taskId);
            },600)
            return false;
        });
    },

    switchToTask: function(id) {
        $('.ajax-loader').show();
        var data = '';
        $.post('/GroupAjax/taskDetails/'+id+'.json', function (response) {
            if(response.status != 'OK') {
                //console.log(response.errMsg);
                $('.ajax-loader').hide();
                return false
            }
            Timeline.groupViewState = true;
            $(Timeline.canvas).animate({opacity: 0}, 600, 'easeOutExpo', function() {
                $('.wrapper-container').scrollTop(0);
                data = response;
                Timeline.renderTask(data);
                Timeline.generateBreadcrumbs('task', data.data);
                $(Timeline.canvas).animate({opacity: 1}, 600, 'easeOutExpo');
                $('.ajax-loader').hide();
            });

        });
    },

    renderTask: function(data) {
        $('#mainContainer').html('');
        html = tmpl('task-state-day', {
            data: data.data
        });
        $('#mainContainer').prepend(html);
    },

    generateBreadcrumbs: function(type, data) {
        var breadCrumb = $('<ol class="breadcrumb"></ol>');
        breadCrumb.append($('<li onclick="Timeline.backFromGroup()"><a href="#">My time</a></li>'));
        switch(type) {
            case 'group':
                var gTitle = data.Group.Group.title;
                var gId = data.Group.Group.id;
                breadCrumb.append($('<li class="active">'+gTitle+'</li>'));
                break;
            case 'project':
                var gTitle = data.group.Group.title;
                var gId = data.group.Group.id;
                var pTitle = data.project.Project.title;
                var pId = data.project.Project.id;
                breadCrumb.append($('<li onclick="Timeline.switchToGroup('+gId+')"><a href="#">'+gTitle+'</a></li>'));
                breadCrumb.append($('<li class="active">'+pTitle+'</li>'));
                break;
            case 'task':
                var gTitle = data.group.Group.title;
                var gId = data.group.Group.id;
                var pTitle = data.project.Project.title;
                var pId = data.project.Project.id;
                var tTitle = data.task.Task.title;
                var tId = data.task.Task.id;
                breadCrumb.append($('<li onclick="Timeline.switchToGroup('+gId+')"><a href="#">'+gTitle+'</a></li>'));
                breadCrumb.append($('<li onclick="Timeline.switchToProject('+pId+')"><a href="#">'+pTitle+'</a></li>'));
                breadCrumb.append($('<li class="active">'+tTitle+'</li>'));
                break;
            default:
                break;
        }
        $('#breadcrumb').html('');
        $('#breadcrumb').append(breadCrumb);
        $('#breadcrumb').show();
    },

	addDrag: function() {
		//Add drag'n'drop to files in timeline.
		$('.filetype, .link-filetype').draggable({
			start: function() {
				$(this).addClass('alreadyDrag');
				if ($(this).hasClass('link-filetype')) {
					$(this).parent().prev('a').hide();
				}
			}},{
			stop: function() {
				$(this).removeClass('alreadyDrag');
				if ($(this).hasClass('link-filetype')) {
					$(this).parent().prev('a').show();
				}
			}}, {
			revert: "invalid"
		});
	}
}

kjsAddClass = function (el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

kjsRemoveClass = function (el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}
function showTimeLinePopup(obj) {
	if (!$(obj).hasClass('alreadyDrag')) {
		processPopup(obj);
	}
}
function processPopup(img) {
    var $pswp = $('.pswp')[0];
    var image_list = [];
    $size   = img.data('size').split('x'),
        $width  = $size[0],
        $height = $size[1];
    var src = img.data('url');
    var item = {
        src : src,
        w   : $width,
        h   : $height
    };
    image_list.push(item);
    var options = {
        index: 0,
        bgOpacity: 0.7,
        showHideOpacity: true,
        shareEl: false
    };

    // Initialize PhotoSwipe
    var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, image_list, options);
    lightBox.init();
    $('#header, #chatLink, .planet, .logo').hide();
    lightBox.listen('close', function() {
        $('#header, #chatLink, .planet, .logo').show();
    });
}
$(document).ready(function () {

    $('body').on('click', '.taskMsg .taskFile img, .taskMsg .taskFile a.underline', function(event) {
        event.preventDefault();
        var img;
        if(event.target.nodeName == 'A') {
            img = $(this).closest('.taskFile').find('img');
        } else {
            img = $(this);
        }
        if((typeof img.data('url') !== 'undefined')&&(img.data('url'))){
            showTimeLinePopup(img);
            return;
        };
        window.open($(this).attr('href'), '_blank');
        return;
    });

    $("#UserEventPrice").keydown(function(event) {
        // Разрешаем: backspace, delete, tab и escape
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
             // Разрешаем: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
             // Разрешаем: home, end, влево, вправо
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // Ничего не делаем
                 return;
        }
        else {
            // Обеждаемся, что это цифра, и останавливаем событие keypress
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    });
    $('.commentLink').on('click', function (e) {
        e.preventDefault();
        var commentsBlock = $(this).parent();
        $(this).attr('class', 'commentLinkactive');
        if ($('.comment-block').lenght) {
            var datablock = $('<div />').addClass('comment-block').appendTo(commentsBlock);
            $.get($(this).data('comments-url'), function (html) {
                datablock.html(html);
            });
            Timeline.lEnableUpdate = false;

        }
        e.stopPropagation();
    });
    $('.commentLinkactive').on('click', function (e) {
        e.preventDefault();
        //ar commentsBlock = $(this).parent();
        $('.comment-block').remove();
        $(this).attr('class', 'commentLink');

        e.stopPropagation();
    });

    pressTimer = '';
    needPrevent = false;
    $("a#dream_chart").on('click touchend', function(event){
        clearTimeout(pressTimer)
        if(needPrevent) {
            event.preventDefault();
        } else {
             window.location = $(this).attr('href');
        }
    }).on('mousedown touchstart', function(){
        needPrevent = false;
        pressTimer = window.setTimeout(function() {
            var pressLink = $("a#dream_chart").attr('href');
            var groupId = pressLink.split("/")[3];
            needPrevent = true;
            Timeline.switchToGroup(groupId);
        },600);
        return false;
    });
});

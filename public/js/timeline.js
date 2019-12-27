var Timeline = {

	canvas: null,
	topDay: 0,
	bottomDay: 0,
	loadPeriod: 0,
	topDate: null,
	bottomDate: null,
	lEnableUpdate: true,
	clockTimer: null,
	updateTimer: null,
	updateTime: null,

	init: function(options, data) {
		Timeline = $.extend(Timeline, options);
		Timeline.lEnableUpdate = false;
		$(window).off('scroll');

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
		Timeline.scrollCurrentTime();

		if (Timeline.updateTime) {
			Timeline.updateTimer = setInterval(function(){
				Timeline.updateState();
			}, Timeline.updateTime);
		}

		setTimeout(function(){
			Timeline.initHandlers();
			Timeline.lEnableUpdate = true;
		}, 6000);
	},

	update: function(lPrepend) {
		Timeline.lEnableUpdate = false;
		$('.ajax-loader').show();
		$.post(profileURL.timelineEvents, {data: {date: Timeline.bottomDate.toSqlDate(), date2: Timeline.topDate.toSqlDate()}}, function(response){
			if (checkJson(response)) {
				Timeline.render(response.data, lPrepend);
				$('.ajax-loader').hide();
				if (lPrepend && $('#day' + Timeline.bottomDate.toSqlDate()).length) {
					setTimeout(function(){
						$('#day' + Timeline.bottomDate.toSqlDate()).get(0).scrollIntoView();
					}, 10);
				}
			}
			Timeline.lEnableUpdate = true;
		});
	},

	insertCurrentTime: function() {
		if (!$('.curr-time-cell').length) {
			var _now = new Date();
			var id = 'timeline' + _now.toSqlDate() + '_' + zeroFormat(_now.getHours()) + '00';
			$('#' + id).before(tmpl('curr-time', {time: Date.HoursMinutes(_now, locale)}));
			clearInterval(Timeline.clockTimer);
			Timeline.clockTimer = setInterval(function(){
				var _now = new Date();
				var time = Date.HoursMinutes(_now, locale);
				if ($('.curr-time-value').length) {
					if ($('.curr-time-value').html().indexOf(':') > -1) {
						time = time.replace(/\:/, ' ');
					}
					$('.curr-time-value').html(time);
				}
			}, 500);
		}
	},

	scrollCurrentTime: function () {
		if ($('.curr-time-cell').length > 0) {
			/*
			var url = window.location.href.replace(/\#now/, '').replace(/\#start/, '');
			var $a = $('.main-panel .user-image a');
			$a.prop('href', $a.prop('href').replace(/\#start/, '#now'));
			window.location.href = url + '#now';
			*/
			// window.scrollBy(0, -40);
			offset = $('.curr-time-cell').offset().top;
			$( window ).scrollTop(offset-40);
			//$('.curr-time-cell').get(0).scrollIntoView();
			//window.scrollBy(0, -40);
		}
	},

	scrollCurrentDay: function () {
		if ($('.current-date').length > 0) {
			offset = $('.day-data.current-date').offset().top;
			$( window ).scrollTop(offset-200);
		}
	},

	renderEvents: function(data) {
		var jsDate = Date.fromSqlDate(todayDate), html = '';
		for(var time = Timeline.topDate.getTime(); time >= Timeline.bottomDate.getTime(); time-= Date.timeDays(1)) {
			jsDate.setTime(time);
			html+= tmpl('row-day-event', {
				globalData: data,
				sql_date: jsDate.toSqlDate(),
				data: (data.days && data.days[jsDate.toSqlDate()]) ? data.days[jsDate.toSqlDate()] : {}
			});
		}
		if (jsDate.toSqlDate() == startDate && !$('.static-system-event').length) {
			html+= tmpl('timeline-bottom', {});
		}
		return html;
	},

	render: function(data, lPrepend) {
		var html = Timeline.renderEvents(data);
		if (lPrepend) {
			$(Timeline.canvas).prepend(html);
		} else {
			$(Timeline.canvas).append(html);
		}
		Timeline.collapseEmptyCells();
		Timeline.initHandlers();
	},

	collapseEmptyCells: function() {
		var lGroup = false, groupID = 0, html = '';
		$('.row-day-events.events-collapsible .time-line-list').each(function(){
			lGroup = false;
			var id = $(this).prop('id');
			$('#' + id + ' > .time-line-cell').each(function(){
				var leftBox = $('.t-a-right.event-box', this).length && $('.t-a-right.event-box', this).html().replace(/\s*/, '');
				var rightBox = $('.t-a-left.event-box', this).length && $('.t-a-left.event-box', this).html().replace(/\s*/, '');
				// var centerBox = $('.t-a-center.time', this).length && $('.t-a-center.time', this).html().replace(/\s*/, '');
				var html = '';
				if (!leftBox && !rightBox) {
					$(this).addClass('empty-cell');
					if (!lGroup) {
						groupID++;
						lGroup = true;
					}
					$(this).addClass('cellGroup-' + groupID);
				} else {
					lGroup = false;
					$(this).addClass('event-cell');
				}
			});
		});
		for(var i = 1; i <= groupID; i++) {
			html = '';
			$('.time-line-list > .empty-cell.cellGroup-' + i).each(function(){
				//html+= Format.tag('div', {'id': $(this).prop('id'), 'class': 'time-line-cell clearfix'}, $(this).html());
				html += '<div id="'+$(this).prop('id')+'" class=" time-line-cell clearfix ">' + $(this).html() + '</div>';
			});
			$('.time-line-list > .cellGroup-' + i).wrapAll('<div class="toggle-dotted inactive"><div class="toggle-dotted-cells" /></div>');
			$('.time-line-list > .cellGroup-' + i).removeClass('cellGroup-' + i);
		}
		$('.toggle-dotted.inactive').append(tmpl('toggle-dotted-btn')).removeClass('inactive');;
		$('.toggle-dotted-cells').hide();
		$('.toggle-dotted-btn').show();
		// $('.row-day-events .time-line-list.events-expanded').removeClass('events-expanded').addClass('events-collapsed');
	},

	initHandlers: function() {
		$('.events-collapsible .toggle-dotted-btn').click(function(){
			$(this).fadeOut('fast');
			// $(this).parent().find('.toggle-dotted-cells').stop(true, false).slideDown();
			$(this).parent().find('.toggle-dotted-cells').show();
			if (Timeline.updateTime) {
				clearInterval(Timeline.updateTimer);
				Timeline.updateTimer = setInterval(function(){
					Timeline.updateState();
				}, Timeline.updateTime);
			}
		});

		$('.events-collapsible .day-calendar').click(function(){
			// $(this).parent().parent().find('.time-line-list').stop(true,false).slideToggle('slow');
			$(this).parent().parent().find('.time-line-list').toggle();
		});

		$(window).off('scroll');
		$(window).scroll(function(event){
			event.stopPropagation();
			if (Timeline.isUpdateEnabled()) {
				var scrolled = window.pageYOffset || document.documentElement.scrollTop;
				if (!scrolled) {
					Timeline.onScrollTop();
				} else if (scrolled >= ($(document).height() - $(window).height() - 40)) {
					Timeline.onScrollBottom();
				}
			}
		});
	},

	showEventPopup: function(sql_date, hours, event_id) {
		Timeline.lEnableUpdate = false;
		var id = 'timeline' + sql_date + '_' + zeroFormat(hours) + '00';

		var $e = $('#' + id + ' .t-a-center > span');
		if($e.length == 0) {
			$e = $('#'+id);
		}

		if (event_id) {
			$('.fieldset-block.create-event').hide();
			$('.fieldset-block.edit-event').show();
		} else {
			$('.fieldset-block.create-event').show();
			$('.fieldset-block.edit-event').hide();
		}
		$('.add-event-block').css({'top':$e.offset().top}).removeClass('open').addClass('open');
	},

	closeEventPopup: function() {
		$('.add-event-block').removeClass('open');
		setTimeout(function(){ Timeline.lEnableUpdate = true; }, 50); // to prevent immidiate onScrollBottom event
	},

	addEventPopup: function(sql_date, hours)  {
		$('.add-event-block input').val('');
		var js_date = Date.fromSqlDate(sql_date);
		js_date.setHours(hours);
		$('#timeStart input').val(Date.HoursMinutes(js_date, locale));
		$('#timeEnd input').val(Date.HoursMinutes(js_date, locale));
		$('#eventDay input').val(sql_date);
		$('#dueDate input').val(sql_date);
		$('#UserEventJsDateEvent').val(Date.fullDate(js_date, locale));
		$('select.period').val('day');
		Timeline.showEventPopup(sql_date, hours, 0);

		$(".add-event-block .groupAccess").html('');

		$('#UserEventId').val('');
		$('#UserEventRecipientId').val('');
		$('#UserEventTaskId').val('');
		//$('#UserEventJsDateEvent').val(Date.fullDate(js_date, locale));
		$('#UserEventTitle').val('');
		$('#UserEventDescr').val('');

		$('.add-event-block form .groupAccess').css('height', 0);
	},

	editEventPopup: function(sql_date, time, sql_date2, time2, eType, recipientId, taskId, event_id) {
		var aHoursMinutes = time.split(':');
		var hours = aHoursMinutes[0];
		var js_date = Date.fromSqlDate(sql_date);
		js_date.setHours(parseInt(hours));
		var e = $('#user-event_' + event_id).get(0);
		var period = '';

		if(sql_date2.indexOf('1899') < 0) {
			if( sql_date == sql_date2 ) {
				$('select.period').val('day');
				$('select.period').change();
				$('#daySelect').hide();
				$('#timeSelect').show();
				$('#timeStart input').val(time);
				$('#timeEnd input').val(time2);

			} else {
				$('select.period').val('period');
				$('select.period').change();
				$('#daySelect').show();
				$('#timeSelect').hide();
				$('#dueDate input').val(sql_date2);
			}
		} else {
			$('select.period').val('day');
			$('select.period').change();
			$('#daySelect').hide();
			$('#timeSelect').show();
			$('#timeStart input').val(time);
			$('#timeEnd input').val(time);
		}

		$(".add-event-block .groupAccess").html('');
		if(recipientId.length != 0) {
			var postData = { q: '' };
			$.post( "/UserAjax/getById/"+recipientId, postData, ( function (data) {
				$(".add-event-block .groupAccess").html(data);
				$('.add-event-block form .groupAccess').css('height', 80);
			}));
		} else {
			$('.add-event-block form .groupAccess').css('height', 0);
		}

		$('#UserEventId').val(event_id);
		$('#eventType').val(eType);
		$('#eventType').change();

		$('#UserEventRecipientId').val(recipientId);
		$('#UserEventTaskId').val(taskId);
		$('#UserEventTimeEvent').val(Date.HoursMinutes(js_date, locale));
		$('#eventDay input').val(sql_date);
		//$('#UserEventJsDateEvent').val(Date.fullDate(js_date, locale));
		$('#UserEventTitle').val($('.user-event-title', e).html());
		$('#UserEventDescr').val($('.user-event-descr', e).html());
		Timeline.showEventPopup(sql_date, hours, event_id);
	},

	eventIsValid: function() {
		return $('#UserEventTitle').val() && $('#UserEventTimeEvent').val() && $('#UserEventDateEvent').val();
	},

	updateEvent: function() {
		if (Timeline.eventIsValid()) {
			Timeline.lEnableUpdate = false;
			$.post(profileURL.updateEvent, $('.add-event-block form').serialize(), function(response){
				if (checkJson(response)) {
					Timeline.updateDay($('#UserEventDateEvent').val(), response.data);
				}
				Timeline.closeEventPopup();
			});
		}
	},

	deleteEvent: function() {
		Timeline.lEnableUpdate = false;
		if (Timeline.eventIsValid()) {
			$.post(profileURL.deleteEvent, $('.add-event-block form').serialize(), function(response){
				if (checkJson(response)) {
					var js_date = Date.fromSqlDate(response.data.event.UserEvent.event_time);
					js_date.setHours(0);
					Timeline.updateDay(js_date.toSqlDate(), response.data.timeline);
				}
				Timeline.closeEventPopup();
			});
		}
	},

	updateState: function() {
		if (Timeline.isUpdateEnabled()) {
			Timeline.lEnableUpdate = false;
			$.post(profileURL.timelineEvents, {data: {date: todayDate, date2: todayDate}}, function(response){
				if (checkJson(response)) {
					Timeline.updateDay(todayDate, response.data);
				}
				Timeline.lEnableUpdate = true;
			});
		}
	},

	updateDay: function(sql_date, data) {
		Timeline.topDate = Date.fromSqlDate(sql_date);
		Timeline.bottomDate = Date.fromSqlDate(sql_date);
		var html = Timeline.renderEvents(data);
		$('#row-day_' + sql_date).replaceWith(html);
		if (sql_date == todayDate) {
			Timeline.insertCurrentTime();
		}
		Timeline.collapseEmptyCells();
		Timeline.initHandlers();
	},

	onScrollTop: function() {
		if (Timeline.isUpdateEnabled()) {
			Timeline.topDay+= Timeline.loadPeriod + 1;
			Timeline.topDate = Date.fromSqlDate(todayDate).addDays(Timeline.topDay);
			Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(Timeline.topDay - Timeline.loadPeriod);
			Timeline.update(true);
		}
	},

	onScrollBottom: function() {
		if (Timeline.isUpdateEnabled()) {
			Timeline.topDate = Date.fromSqlDate(todayDate).addDays(Timeline.bottomDay - 1);
			Timeline.bottomDay -= Timeline.loadPeriod;

			if (Timeline.bottomDay < startDay) {
				Timeline.bottomDay = startDay;
			}
			Timeline.bottomDate = Date.fromSqlDate(todayDate).addDays(Timeline.bottomDay);

			if (Timeline.topDate.getTime() >= Timeline.bottomDate.getTime()) {
				Timeline.update();
				window.scrollBy(0, -10);
			}
		}
	},

	isUpdateEnabled: function() {
		return Timeline.lEnableUpdate && !$('.dropdown-panel.dropdown-open').length;
	}
}

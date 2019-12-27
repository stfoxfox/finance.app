/// <reference path="../../Scripts/Typings/jquery/jquery.d.ts"/>
/// <reference path="jquery.chatjs.interfaces.ts"/>
/// <reference path="jquery.chatjs.utils.ts"/>
/// <reference path="jquery.chatjs.adapter.ts"/>
/// <reference path="jquery.chatjs.window.ts"/>
/// <reference path="jquery.chatjs.messageboard.ts"/>

$(document).ready(function(){

	var animationEnd = true;
	var animUserEnd = true;

/*
	$(document).on('click', '#open-user-list-panel', function(event){
		event.preventDefault();

		if(animationEnd){

			animationEnd = false;

			if(!$(this).hasClass('active')){
				$(this).addClass('active');
				$('.user-list-windpw-minimize').css('display','block');
				$('.user-list-windpw-minimize .chat-window-content').css('display','block');

				$('.user-list-windpw-minimize').animate({opacity:1, top:0},500,function(){
					animationEnd = true;
				});

				click = true;
				if((/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
					click = false;
				}

				UserList.thisScroll = new IScroll('.user-list', {
					mouseWheel: true,
					disableMouse: true,
					click: click
				});

				var height = $('.user-list-ite').height();
				var parentH = $('.user-list').height();

				var tops =  parseInt($('.user-list-ite').css('top'));
				if(!tops || tops == 'auto'){
					tops= 0;
				}
				var dev = height-parentH + tops;

				if(dev > 40){
				//    $('.jcarousel-control-next').removeClass('inactive');
				}
				$('.jcarousel-control-next').addClass('inactive');
				$('.jcarousel-control-prev').addClass('inactive');

				var states  = ChatController.prototype.readCookie('chatjsposition');
				if(states != null){
					states.mainWindowState.isMaximized = true;
					ChatController.prototype.createCookie('chatjsposition',states);
				}
				ChatController.prototype.createCookie('state_window',true);

			} else {

				$('.user-list-windpw-minimize').animate({opacity:0, top:100},500,function(){
					$('.user-list-windpw-minimize').css('display','none');
					$('.user-list-windpw-minimize .chat-window-content').css('display','none');
					animationEnd = true;
				});

				var states  = ChatController.prototype.readCookie('chatjsposition');
				if(states != null && states.mainWindowState != null){
					states.mainWindowState.isMaximized = false;
					ChatController.prototype.createCookie('chatjsposition',states);
				}
				ChatController.prototype.createCookie('state_window',false);

				$(this).removeClass('active');
			}
		}
	});
*/
	$(document).on('click', '#open-user-list-panel', function(event){
		event.preventDefault();

		if($('#chat-holder').hasClass('chat-holder--visible')) {
			$('#chat-holder').slideUp(200, function(){
				$(this).removeClass('chat-holder--visible');
			});

			$('.wrapper-container').removeClass('wrapper-container--pt230');
			//set panel status as hidden:
			createCookie('panelishidden','1',7);
			$(".main-nav_item.main-nav_item--chat").removeClass('active');
		} else {
			$('#chat-holder').slideDown(200,function(){
				$(this).addClass('chat-holder--visible');
			});

			var click = true;

			if ((/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
				click = false;
			}

			$('.user-list-slider').css('width', $('.user-list-item').size() * 68);

			UserList.thisScroll = new IScroll('.user-list', {
				scrollX: true,
				scrollY: false,
				mouseWheel: true,
                disableMouse: true,
                disablePointer: true,
				click: click
			});

			$('.wrapper-container').addClass('wrapper-container--pt230');
			//set panel status as visible:
			createCookie('panelishidden','0',7);
			$(".main-nav_item.main-nav_item--chat").addClass('active');
		}
	});
});


var UserListOptions = (function () {
	function UserListOptions() {
	}
	return UserListOptions;
})();

var UserList = (function () {

	function UserList(jQuery, options) {

		var _this = this;
		this.thisScroll = null;

		this.$el = jQuery;
		var defaultOptions = new UserListOptions();
		defaultOptions.emptyRoomText = "No users for chatting.";
		defaultOptions.height = 70;
		defaultOptions.excludeCurrentUser = false;
		defaultOptions.userClicked = function () {
		};
		this.options = $.extend({}, defaultOptions, options);
		this.$el.addClass("user-list");
		this.$el.parent().parent().addClass("user-list-windpw-minimize").show();
		this.$el.parent().addClass("user-list-scroll");
		var start_point = 0;
		var old = 0;

		$('.jcarousel-control-next').addClass('inactive');
		$('.jcarousel-control-prev').addClass('inactive');

		$(document).on('click','.jcarousel-control-prev',function(){
			_this.thisScroll.scrollBy(68,0,300);
		});

		$(document).on('click','.jcarousel-control-next',function(){
			_this.thisScroll.scrollBy(-68,0,300);
		});

		ChatJsUtils.setOuterHeight(this.$el, this.options.height);

		var states  = ChatController.prototype.readCookie('chatjsposition');

		// console.log(states);

		if(states != null){
			if(states.mainWindowState.isMaximized == true){
	  			$('#open-user-list-panel').addClass('active');
				this.$el.parent().parent().css('opacity',1);
				this.$el.parent().parent().css('display','block');
			}
		} else {
			var state_window = ChatController.prototype.readCookie('state_window');
			if(state_window == true){
				$('#open-user-list-panel').addClass('active');
				this.$el.parent().parent().css('opacity',1);
				this.$el.parent().parent().css('display','block');
			}
		}

		this.options.adapter.client.onUserListChanged(function (userListData) {
			_this.populateList(userListData);

			var height = $('.user-list-ite').height();
			var parentH = $('.user-list').height();
			var click = true;

			if ((/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
				click = false;
			}

			$('.user-list-slider').css('width', $('.user-list-item').size() * 68);

			_this.thisScroll = new IScroll('.user-list', {
				scrollX: true,
				scrollY: false,
				mouseWheel: true,
				disableMouse: true,
                disablePointer: true,
				click: click
			});

			/*if(height < _this.options.height) {
				_this.$el.css('height','auto');
				_this.$el.css('max-height',_this.options.height-30);
			} else{
				_this.$el.css('height',_this.options.height-30);
			}*/
		});
	}

	//Add droppable to chat elements
	UserList.prototype.addDroppable = function () {
		$('.dropme-files img').droppable({
			accept: ".filetype, .link-filetype",
			hoverClass: "ui-hover",
			drop: function( event, ui ) {
				var fileId = $(ui.draggable).data('file-id');
				var userInitial = $(ui.draggable).data('user-id');
				var roomId = $(this).parent('a').data('room-id');
				var userRecipient = $(this).parent('a').data('user-id');
				if (!roomId) {
					var roomId = $(this).closest('.user-list-item').data('room-id');
				}
				if (!userRecipient) {
					var userRecipient = $(this).closest('.user-list-item').data('val-id');
				}

				//var postData = {fileId: fileId, roomId: roomId, userInitial: userInitial, userRecipient: userRecipient}
				$.post(
					'/ChatAjax/sendTimelineFiles.json',
					{
						fileId: fileId,
						roomId: roomId,
						userInitial: userInitial,
						userRecipient: userRecipient
					}, (function (data) {

					})).done(function () {
						$(ui.draggable).fadeOut(400);
						setTimeout((function () {
							$(ui.draggable).css({top: 0, left: 0}).fadeIn(400);
						}), 500);

						// console.log(2);
					});
			}
		});

		$('body').find('.profile-picture').droppable({
			accept: ".filetype, .link-filetype",
			hoverClass: "ui-hover",
			drop: function( event, ui ) {
                //console.log(ui.draggable);
                var fileId = $(ui.draggable).data('file-id');
                var userInitial = $(ui.draggable).data('user-id');
                var roomId = $(this).parent('a').data('room-id');
                var userRecipient = $(this).parent('a').data('user-id');

				if (!roomId) {
					var roomId = $(this).parent('.user-list-item').data('room-id');
				}
				if (!userRecipient) {
					var userRecipient = $(this).parent('.user-list-item').data('val-id');
				}

				var postData = {fileId: fileId, roomId: roomId, userInitial: userInitial, userRecipient: userRecipient};

				$.post("/ChatAjax/sendTimelineFiles.json",
                    postData,
					(function (data) {

				})).done(function () {
					$(ui.draggable).fadeOut(400);
					setTimeout((function () {
						$(ui.draggable).css({top: 0, left: 0}).fadeIn(400);
					}), 500);
				});
			}
		});



		$('body').find('.user-list-item').each(function() {
            var closure = $(this);

            closure.droppable({
                accept: ".event-select .menu-inner-item",
                hoverClass: "ui-hover",
                drop: function (event, ui) {
                    event.preventDefault();
                    /*var userId = $(this).data('val-id');
                     var userName = $(this).find('.content').html();
                     var userImg = $(this).find('img').attr('src');
                     var eventType = $(ui.draggable).data('type');
                     var sql_date = $(ui.draggable).data('sqldate');
                     var hours = $(ui.draggable).data('hours');
                     var action = $(ui.draggable).data('action');
                     var side = $(ui.draggable).data('side');*/
                    /** Show event */
                    callModal(event, MyTime, $(ui.draggable), closure);
                }
            });
        });
	};

	UserList.prototype.populateList = function (rawUserList) {

		var _this = this;
		//Take old data for comparing with new data
		var chatMembersOld = $(_this.$el[0]).find('.user-list-item');
		var chatMembersOldCount = chatMembersOld.length;
		var userId = _this.options.userId;

		// this will copy the list to a new array
		var userList = rawUserList.slice(0);
		var rawUserListCount = 0;

		$(rawUserList).each(function(i, el){
			if (el.Id != userId) {
				rawUserListCount++;
				//This will refresh only message show on minichat members
				if (typeof(el.active_count) != 'undefined' && el.active_count != '0') {
					var countMessage = parseInt(el.active_count);
					$('#contact-'+el.Id).find('.meccage-count').show();
					$('#contact-'+el.Id).find('#message-user-count-'+el.Id).remove();
					var tmpl = '<div id="message-user-count-'+el.Id+'" class="message-user-count message-user-count-'+el.Id+'">'+countMessage+'</div>';
					$('#contact-'+el.Id).find('.content').before(tmpl);
				} else {
					$('#contact-'+el.Id).find('.meccage-count').hide();
					$('#contact-'+el.Id).find('#message-user-count-'+el.Id).remove();
				}
				$('#contact-'+el.Id).attr('data-position', i);
			}
		});

		/* 	But when new user will be added to chat with,
			then will be full refresh of all members in minichat
			and then add Droppable
		 */

		//TODO Maybe should rework refreshing all users, only add new to the end and change status if need

		if ((rawUserListCount != chatMembersOldCount)) {
			if (this.options.excludeCurrentUser) {
				var j = 0;
				while (j < userList.length) {
					if (userList[j].Id == this.options.userId)
						userList.splice(j, 1);
					else
						j++;
				}
			}
			topss = $('.user-list-ite').css('top');
			var count = 0;
			//  this.$el.html('<div class="user-list-ite" style="top: '+topss+';"><ul></ul></div>');
			//    if(!$('.user-list-slider').length){
			this.$el.empty();
			var ite = $('<div />').addClass('user-list-slider').appendTo(this.$el);
			//this.$el.html(ite);
			var $list = $('<ul />').addClass('user-list-ite').appendTo(ite);
			
			if($('.jcarousel-control').length == 0) {
				$('<a href="#" class="jcarousel-control jcarousel-control-prev inactive" data-jcarouselcontrol="true">‹</a>' +
					'<a href="#" class="jcarousel-control jcarousel-control-next inactive" data-jcarouselcontrol="true">›</a>').insertAfter(this.$el);
				 				
				$('<a href="#" class="user-list_chat-link">'+_allContacts+'</a>').insertAfter(this.$el);
			}

			//console.log(userList);
			if (userList.length == 0) {
				$("<li/>").addClass("user-list-empty").text(this.options.emptyRoomText).appendTo($list);
			} else {
				for (var i = 0; i < userList.length; i++) {
					if(userList[i].members == 1){
						//var $userListItem = $("<li/>").addClass("user-list-item").attr("data-val-id", userList[i].Id).attr("data-room-id", userList[i].RoomId).attr("data-group", 'custom-test').appendTo($list);
						var temp = $("<li/>").addClass("user-list-item").attr('id', 'contact-'+userList[i].Id).attr("data-val-id", userList[i].Id).attr("data-room-id", userList[i].RoomId).attr("data-position",i+1);
						if(userList[i].hasOwnProperty('group_id'))
							temp.attr("data-group", userList[i].group_id);
						var $userListItem = temp.appendTo($list);

						$("<img/>").addClass("profile-picture").attr("src", userList[i].ProfilePictureUrl).appendTo($userListItem);
						$("<div/>").addClass("meccage-count").addClass(userList[i].Status == 0 ? "offline" : "online").appendTo($userListItem);
						if(typeof(userList[i].active_count) != 'undefined' && userList[i].active_count != '0'){
							count = parseInt(userList[i].active_count);
							$("<div/>").addClass("message-user-count message-user-count-"+userList[i].Id).attr('id',"message-user-count-"+userList[i].Id).html(count).appendTo($userListItem);
						}

						if(userList[i].rating <= 3) userList[i].rating = 3;
						$("<div/>").addClass("slime-container").html('<div class="fill" style="height: '+userList[i].rating+'%;"></div>').appendTo($userListItem);
						$("<div/>").addClass("rating-rsd").appendTo($userListItem);

						$("<div/>").addClass("content").text(userList[i].Name).appendTo($userListItem);

						// makes a click in the user to either create a new chat window or open an existing
						// I must clusure the 'i'
						(function (userId) {
							// handles clicking in a user. Starts up a new chat session
							$userListItem.click(function () {
								var group_id = $(this).data('group') ? $(this).data('group') : null;
								var room_id = $(this).data('room-id') ? $(this).data('room-id') : null;
								_this.options.userClicked(userId, group_id, room_id);
							});
						})(userList[i].Id);
					}
				}

			}
			_this.addDroppable();
		}
		tinysort('ul.user-list-ite>li', {data:'position', order:'asc'});
	};
	return UserList;
})();

$.fn.userList = function (options) {
	if (this.length) {
		this.each(function () {
			var data = new UserList($(this), options);
			$(this).data('userList', data);
		});
	}
	return this;
};
//# sourceMappingURL=jquery.chatjs.userlist.js.map

//create cookie function:
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

//get cookie function:
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// T0inySort script - http://tinysort.sjeiti.com/
//TODO  used only here butshould moved to all scripts soon
!function(a,b){"use strict";function c(){return b}"function"==typeof define&&define.amd?define("tinysort",c):a.tinysort=b}(this,function(){"use strict";function a(a,d){function h(){0===arguments.length?q({}):b(arguments,function(a){q(z(a)?{selector:a}:a)}),n=G.length}function q(a){var b=!!a.selector,d=b&&":"===a.selector[0],e=c(a||{},p);G.push(c({hasSelector:b,hasAttr:!(e.attr===g||""===e.attr),hasData:e.data!==g,hasFilter:d,sortReturnNumber:"asc"===e.order?1:-1},e))}function r(){b(a,function(a,b){B?B!==a.parentNode&&(H=!1):B=a.parentNode;var c=G[0],d=c.hasFilter,e=c.selector,f=!e||d&&a.matchesSelector(e)||e&&a.querySelector(e),g=f?E:F,h={elm:a,pos:b,posn:g.length};D.push(h),g.push(h)}),A=E.slice(0)}function s(){E.sort(t)}function t(a,c){var d=0;for(0!==o&&(o=0);0===d&&n>o;){var g=G[o],h=g.ignoreDashes?l:k;if(b(m,function(a){var b=a.prepare;b&&b(g)}),g.sortFunction)d=g.sortFunction(a,c);else if("rand"==g.order)d=Math.random()<.5?1:-1;else{var i=f,p=y(a,g),q=y(c,g),r=""===p||p===e,s=""===q||q===e;if(p===q)d=0;else if(g.emptyEnd&&(r||s))d=r&&s?0:r?1:-1;else{if(!g.forceStrings){var t=z(p)?p&&p.match(h):f,u=z(q)?q&&q.match(h):f;if(t&&u){var v=p.substr(0,p.length-t[0].length),w=q.substr(0,q.length-u[0].length);v==w&&(i=!f,p=j(t[0]),q=j(u[0]))}}d=p===e||q===e?0:q>p?-1:p>q?1:0}}b(m,function(a){var b=a.sort;b&&(d=b(g,i,p,q,d))}),d*=g.sortReturnNumber,0===d&&o++}return 0===d&&(d=a.pos>c.pos?1:-1),d}function u(){var a=E.length===D.length;if(H&&a)I?E.forEach(function(a,b){a.elm.style.order=b}):B?B.appendChild(v()):console.warn("parentNode has been removed");else{var b=G[0],c=b.place,d="org"===c,e="start"===c,f="end"===c,g="first"===c,h="last"===c;if(d)E.forEach(w),E.forEach(function(a,b){x(A[b],a.elm)});else if(e||f){var i=A[e?0:A.length-1],j=i.elm.parentNode,k=e?j.firstChild:j.lastChild;k!==i.elm&&(i={elm:k}),w(i),f&&j.appendChild(i.ghost),x(i,v())}else if(g||h){var l=A[g?0:A.length-1];x(w(l),v())}}}function v(){return E.forEach(function(a){C.appendChild(a.elm)}),C}function w(a){var b=a.elm,c=i.createElement("div");return a.ghost=c,b.parentNode.insertBefore(c,b),a}function x(a,b){var c=a.ghost,d=c.parentNode;d.insertBefore(b,c),d.removeChild(c),delete a.ghost}function y(a,b){var c,d=a.elm;return b.selector&&(b.hasFilter?d.matchesSelector(b.selector)||(d=g):d=d.querySelector(b.selector)),b.hasAttr?c=d.getAttribute(b.attr):b.useVal?c=d.value||d.getAttribute("value"):b.hasData?c=d.getAttribute("data-"+b.data):d&&(c=d.textContent),z(c)&&(b.cases||(c=c.toLowerCase()),c=c.replace(/\s+/g," ")),c}function z(a){return"string"==typeof a}z(a)&&(a=i.querySelectorAll(a)),0===a.length&&console.warn("No elements to sort");var A,B,C=i.createDocumentFragment(),D=[],E=[],F=[],G=[],H=!0,I=a.length&&(d===e||d.useFlex!==!1)&&-1!==getComputedStyle(a[0].parentNode,null).display.indexOf("flex");return h.apply(g,Array.prototype.slice.call(arguments,1)),r(),s(),u(),E.map(function(a){return a.elm})}function b(a,b){for(var c,d=a.length,e=d;e--;)c=d-e-1,b(a[c],c)}function c(a,b,c){for(var d in b)(c||a[d]===e)&&(a[d]=b[d]);return a}function d(a,b,c){m.push({prepare:a,sort:b,sortBy:c})}var e,f=!1,g=null,h=window,i=h.document,j=parseFloat,k=/(-?\d+\.?\d*)\s*$/g,l=/(\d+\.?\d*)\s*$/g,m=[],n=0,o=0,p={selector:g,order:"asc",attr:g,data:g,useVal:f,place:"org",returns:f,cases:f,forceStrings:f,ignoreDashes:f,sortFunction:g,useFlex:f,emptyEnd:f};return h.Element&&function(a){a.matchesSelector=a.matchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector||function(a){for(var b=this,c=(b.parentNode||b.document).querySelectorAll(a),d=-1;c[++d]&&c[d]!=b;);return!!c[d]}}(Element.prototype),c(d,{loop:b}),c(a,{plugin:d,defaults:p})}());

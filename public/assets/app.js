// $(window).on('resize', function() {
//     $('#header .row').innerWidth( $('#header').width() - 180 );
//     $('#searchInput').width( ($('#header .col-xs-6').width()) - 100 );
// });


// JS COOKIE SCRIPTS

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; path=/; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

// Внутренние переменные
var canvas, ctx;
var clockRadius = 20;
var clockImage;
var allowReplace = false;

// Функции рисования:
function clear() { // Очистка поля рисования
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // Основная функция drawScene
	clear(); // Очищаем поле рисования

	// Получаем текущее время
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	hours = hours > 12 ? hours - 12 : hours;
	var hour = hours + minutes / 60;
	var minute = minutes + seconds / 60;

	// Сохраняем текущий контекст
	ctx.save();

	// Рисуем изображение часов (как фон)
	ctx.drawImage(clockImage, 0, 0, 40, 40);

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.beginPath();

	// Рисуем часовую стрелку
	ctx.save();
	var theta = (hour - 3) * 2 * Math.PI / 12;
	ctx.rotate(theta);
	ctx.beginPath();
	ctx.moveTo(-6, -1);
	ctx.lineTo(-6, 1);
	ctx.lineTo(clockRadius * 0.5, 1);
	ctx.lineTo(clockRadius * 0.5, -1);
	ctx.fillStyle = '#ff6363';
	ctx.fill();
	ctx.restore();

	// Рисуем минутную стрелку
	ctx.save();
	var theta = (minute - 15) * 2 * Math.PI / 60;
	ctx.rotate(theta);
	ctx.beginPath();
	ctx.moveTo(-6, -1);
	ctx.lineTo(-6, 1);
	ctx.lineTo(clockRadius * 0.7, 1);
	ctx.lineTo(clockRadius * 0.7, -1);
	ctx.fillStyle = '#00b6af';
	ctx.fill();
	ctx.restore();

	// Рисуем секундную стрелку
	ctx.save();
	var theta = (seconds - 15) * 2 * Math.PI / 60;
	ctx.rotate(theta);
	ctx.beginPath();
	ctx.moveTo(-8, -0.5);
	ctx.lineTo(-8, 0.5);
	ctx.lineTo(clockRadius * 0.8, 0.5);
	ctx.lineTo(clockRadius * 0.8, -0.5);
	ctx.fillStyle = '#ffbb00';
	ctx.fill();
	ctx.restore();

	// центральный круг
	ctx.save();
	ctx.beginPath();
	ctx.arc(0, 0, 2, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#ffbb00';
	ctx.stroke();
	ctx.restore();

	ctx.restore();
}

// Инициализация
$(function(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	// var width = canvas.width;
	// var height = canvas.height;

	clockImage = new Image();
	clockImage.src = '/img/interface/clock.png';

	setInterval(drawScene, 100); // Циклическое выполнение функции drawScene
});


// Chart

/*
function parseDate(input) {
	var parts = input.split('-');
	// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
	return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

// отрисовка чарта
function drawChart(chartData, maximum) {
	var data = new google.visualization.DataTable();
	//var data = new google.visualization.DataTable(chartData);
	data.addColumn('date', 'Day');
	data.addColumn('number', 'tasks');
	data.addRows(chartData);

	if(maximum < 10) maximum = 10;
	var minDate = new Date(chartData[0][0]);
	minDate.setDate(minDate.getDate()-1);
	var maxDate = new Date(chartData[chartData.length-1][0]);
	if( chartData[0][0] == chartData[chartData.length-1][0] ) {
		maxDate.setDate(maxDate.getDate()+40);
	} else {
		maxDate.setDate(maxDate.getDate()+1);
	}

	var options = {
		title: '',
		curveType: 'none',
		legend: 'none',
		colors: ['#52B0A7'],
		pointSize: 4,
		lineWidth: 1,
		hAxis: {
			baseline: minDate,
			viewWindow: {
				min: minDate,
				max: maxDate,
			},
		},
		vAxis: {
			baseline: 0,
			gridlineColor: '#ddd',
			textPosition: 'left',
			viewWindowMode: 'pretty',
			viewWindow: {
				min: 0,
				max: (maximum+1),
			},
			//maxValue: parseInt(maximum),
		},
		chartArea: {width:"95%", height: "90%"},
	};

	var chart = new google.visualization.LineChart(document.getElementById('dream_chart'));

	chart.draw(data, options);

	$('.myLinks .overlay').hide();
	$('.myLinks .group-select').show();
}

$(document).ready(function(){
	$('#DreamGrouplist').styler({
		onSelectOpened: function() {
			allowReplace = true;
		}
	});

	$('#DreamGrouplist').on('change', function() {
		if( $(this).val() != 'create' ) {
			setCookie('dream-chart', $(this).val(), 30);

			$('.myLinks .overlay').show();
			$.post("/GroupAjax/dreamStats/" + $(this).val() + '.json', (function (respose) {
				if(respose.data) {
					//var chartData = $.map( $.parseJSON(respose.data.state)  , function(el, key) { return [[key, el]]; });
					var chartData = $.map( $.parseJSON(respose.data.state)  , function(el, key) { return [[new parseDate(key), el]]; });

					google.setOnLoadCallback( drawChart(chartData, respose.data.count) );
					$(".myLinks .group-logo").attr("src", respose.data.logo);
				}
			}));
		} else {
			console.log(allowReplace);
			if(allowReplace) {
				location.replace('/Group/edit');
			}
		}
		allowReplace = false;
	});

	$('#DreamGrouplist').change();
});
*/
//$.getScript("/js/vendor/ion.sound.min.js");

var Chat = {

    openEnabled: true,
    enableLevel: 0,
    messages: -1,
    timer: null,
    Panel: null,
    aSound: '',
    initialLoad: true,
    lastMessageUserId: null,
    topScrollPos: 0,

    fixPanelHeight: function() {
        //$('.dialog').height($(window).height() - $(".bottom").height()-$("#header").height());
        //$('.chat-page .bottom').width( $(window).width() - $('.dropdown-chatPanel').width() - 90 );
        //$('.dropdown-chatPanel').height( $(window).height() - 92 );
    },

    initPanel: function (container, userID, roomID, groupID) {
        Chat.Panel = new ChatPanel(container, userID, roomID, groupID);
        Chat.Panel.init();
        /*
        ion.sound({
            sounds: [
                {
                    name: "msg1_1",
                    preload: true
                }
            ],

            path: "snd/",
            preload: true,
        });
        */
        Chat.aSound = document.getElementById('msg-audio');
        Chat.aSound.load();
        Chat.aSound.play();
        Chat.aSound.pause();

        if (chatUpdateTime) {

            Chat.updateState();
            Chat.timer = setInterval(function(){
                console.log('update state');
                Chat.updateState();
            }, chatUpdateTime);
        }
    },

    enableUpdate: function () {
        Chat.enableLevel--;
        if (Chat.enableLevel < 0) {
            Chat.enableLevel = 0;
        }
    },

    disableUpdate: function () {
        Chat.enableLevel++;
    },

    isUpdateEnabled: function () {
        return Chat.enableLevel == 0 && Chat.openEnabled;
    },
    /*
    updateMiniChat: function(minichat, response) {
		if (minichat == null) {
			return;
		}
        if(typeof(minichat.options.userId) == 'undefined'){
            return;
        }
        var chatUsers = new Array();
        var _response = response;
        if(highWay.isOpen()){
            highWay.call('transport.get', ['/mini-chat/users/contact.json']).then(
                function (response) {
                    User = new ChatUserInfo();
                    chatUsers.push($.extend(User, response.user));

                    for (i = 0; i < _response.data.aUsers.aUsers.length; i++) {
                        data = _response.data.aUsers.aUsers[i];

                        chatUser = new ChatUserInfo();
                        chatUser.Id = data.User.id;
                        chatUser.RoomId = data.ChatContact.room_id;
                        chatUser.active_count = data.ChatContact.active_count;

                        if(data.ChatContact.active_count == 0){
                          $('#message-user-count-'+data.User.id).remove();
                        }
                        chatUser.Name = data.User.full_name;
                        chatUser.Email = data.User.username;
                        chatUser.members = data.ChatContact.members.length;
                        chatUser.ProfilePictureUrl = data.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                        chatUser.ProfilePictureClass = data.User.rating_class;
                        chatUser.Status = 1;

                        chatUsers.push(chatUser);
                    }
                    if(_response.data.events.length > 0){
                        minichat.options.adapter.client.triggerUserListChanged(chatUsers);
                        minichat.options.adapter.server.users = chatUsers;
                    }
                }
            );
        } else {
            $.ajax({
                url: '/UserAjax/getById/'+minichat.options.userId+'.json',
                async: true
            }).done(function(response){
                myUser = new ChatUserInfo();
                myUser.Id = response.User.id;
                myUser.RoomId = response.User.id;
                myUser.Name = response.User.full_name;
                myUser.Email = response.User.username;
                myUser.ProfilePictureUrl = response.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                myUser.ProfilePictureClass = response.User.rating_class;
                myUser.Status = 1;
                chatUsers.push(myUser);

                for (i = 0; i < _response.data.aUsers.aUsers.length; i++) {
                    data = _response.data.aUsers.aUsers[i];

                    chatUser = new ChatUserInfo();
                    chatUser.Id = data.User.id;
                    chatUser.RoomId = data.ChatContact.room_id;
                    chatUser.active_count = data.ChatContact.active_count;

                    if(data.ChatContact.active_count == 0){
                      $('#message-user-count-'+data.User.id).remove();
                    }
                    chatUser.Name = data.User.full_name;
                    chatUser.Email = data.User.username;
                    chatUser.members = data.ChatContact.members.length;
                    chatUser.ProfilePictureUrl = data.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                    chatUser.ProfilePictureClass = data.User.rating_class;
                    chatUser.Status = 1;

                    chatUsers.push(chatUser);
                }
                if(_response.data.events.length > 0){
                    minichat.options.adapter.client.triggerUserListChanged(chatUsers);
                    minichat.options.adapter.server.users = chatUsers;
                }
            });
        }

        for (i = 0; i < response.data.events.length; i++) {
            newEvent = response.data.events[i];
            if(newEvent.ChatEvent.msg_id == null){
                newMessage = new ChatMessageInfo();
                newMessage.UserToId = newEvent.ChatEvent.user_id;
                newMessage.UserFromId = newEvent.ChatEvent.initiator_id;
                newMessage.RoomId = newEvent.ChatEvent.room_id;
                newMessage.ConversationId = undefined;
                newMessage.Type = 'file';
                msg_id = parseInt(newEvent.ChatEvent.file_id);
                newMessage.msgId = msg_id;
                msg = response.data.files[msg_id];
                newMessage.Message = msg;
                minichat.options.adapter.client.triggerMessagesChanged(newMessage);
            } else {
                newMessage = new ChatMessageInfo();
                newMessage.UserToId = newEvent.ChatEvent.user_id;
                newMessage.UserFromId = newEvent.ChatEvent.initiator_id;
                newMessage.RoomId = newEvent.ChatEvent.room_id;
                msg_id = parseInt(newEvent.ChatEvent.msg_id);
                newMessage.msgId = msg_id;
                newMessage.ConversationId = undefined;
                msg = response.data.messages[msg_id];
                newMessage.Message = msg.message;
                minichat.options.adapter.client.triggerMessagesChanged(newMessage);
            }
        }
    },
    */

    updateState: function () {

        if (Chat.isUpdateEnabled()) {
            Chat.disableUpdate();
            $.post(chatURL.updateState, null, function(response){
                incoming_count = 0;
				if (checkJson(response)) {
                    if(!Chat.initialLoad) {

                        //Show user pic in top
                        var messageFromEvents = response.data.selfEvents;
                        if (response.data.events.length > 0) {
                            messageFromEvents = response.data.events;
                        }
                        Chat.getLastMessageInGroupChat(messageFromEvents, Chat.Panel.activeRoom);

						Chat.Panel.update(response.data);
						for(var upMsg in response.data.events){
							if(upMsg!='in_array'){
								var eventId = response.data.events[upMsg].ChatEvent.id;
								var eventMsgId = response.data.events[upMsg].ChatEvent.msg_id;
								var eventMSG = response.data.events[upMsg].ChatEvent.msg;
								if($('#event-' + eventId).length){
									$('#event-' + eventId + ' .text').html(eventMSG);
								}
								//console.log('#message-number-' + eventMsgId);
								if($('#message-number-' + eventMsgId).length){
									$('#message-number-' + eventMsgId + ' .link-block').html(response.data.messages[eventMsgId].message);
								}
                                //find real active messages for chat notification sound
                                if((typeof response.data.events[upMsg].ChatEvent.active != 'undefined')&&response.data.events[upMsg].ChatEvent.active){
                                    incoming_count++;
                                }
							}
						}
						if((Chat.messages > 0)&&(Chat.messages < incoming_count)) {
                            Chat.aSound.play();
                            //ion.sound.play('msg1_1');
                        }
                    }
                    //disabled for desync with main chat updates
                    //if(typeof(minichat) != 'undefined'){
                    //    Chat.updateMiniChat(minichat, response);
                    //}
                }
                Chat.messages = incoming_count;
            }, 'json').always(function() {
                Chat.enableUpdate();
                Chat.initialLoad = false;
            });
        }
    },

    getLastMessageInGroupChat: function(messages, room) {
        $.each(messages, function(key,val) {
            if (val.ChatEvent.room_id == room ) {
                Chat.lastMessageUserId = val.ChatEvent.initiator_id;
            }
        });
    }
}

var ChatPanel = function(container, userID, roomID, groupID){ // static object
    var self = this;
    self.panel = container;
    self.userID = userID;
    self.roomID = roomID;
    self.groupID = groupID;
    self.rooms = {};
    self.activeRoom = null;
    self.myScroll = null;
    self.listScroll = null;
    self.newY = 0;
    self.touchStartY = 0;

    this.init = function () {
        $.post(chatURL.contactList, null, function(response){
            if (checkJson(response)) {
                self.render(response.data);
                if (self.userID || self.roomID || self.groupID) {
                    self.openRoom(self.roomID, self.userID, self.groupID);
                }
            }
        });
    }

    this.initHandlers = function() {
        $('#searchChatForm').ajaxForm({
            url: chatURL.contactList,
            dataType: 'json',
            beforeSubmit: function(){
                // Chat.disableUpdate();
            },
            success: function(response) {
                if (checkJson(response)) {
                    self.render(response.data);
                    self.initHandlers(); // DOM elements were recreated
                    // Chat.enableUpdate();
                }
            }
        });
    }

    this.formatUnread = function(count) {
        if (count > 10) {
            count = '10+';
        } else if (!count) {
            count = '';
        }
        return count;
    }

    this.render = function (data) {
        var count, totalCount = 0;
        unreadCount = {};
        if (data.aUsers && data.aUsers.length) {
            for(var i = 0; i < data.aUsers.length; i++) {
                user = data.aUsers[i];
                if (user.ChatContact) {
                    count = parseInt(user.ChatContact.active_count);
                    totalCount+= count;
                    if (self.rooms[user.ChatContact.room_id]) {
                        self.rooms[user.ChatContact.room_id].setUnread(self.formatUnread(count));
                    }
                }
            }
        }
        $('#chatTotalUnread').html(self.formatUnread(totalCount));

        //var canAddMember = (self.activeRoom && self.rooms[self.activeRoom].ChatRoom.initiator_id);
        $(self.panel).html(tmpl('chat-panel', {
            innerCall: self.userID || self.groupID || self.roomID,
            q: $(".searchBlock .searchInput", self.panel).val(),
            aUsers: data.aUsers,
            aGroups: data.aGroups,
        }));
        self.updateAddMembers();
        self.updateDelContacts();
        self.initHandlers();
    }

    this.removeContact = function(contact_id, roomID) {
        Chat.disableUpdate();
        self.closeTab(roomID);
        $.post(chatURL.delContact, {data: {contact_id: contact_id}}, function(response){
            self.render(response.data);
            self.initHandlers();
            Chat.enableUpdate();
        });
    }

    this.openRoom = function(roomID, userID, groupID) {

        if (self.rooms[roomID]) {
            self.activateTab(roomID);
            self.iScrollInit(roomID);
        } else if( Chat.openEnabled ) {
            Chat.openEnabled = false;
            Chat.disableUpdate();
            $.post(chatURL.openRoom, {data: {room_id: roomID, user_id: userID, group_id: groupID}}, function(response){
                if (checkJson(response)) {
                    var roomID = response.data.room.ChatRoom.id;
                    var room = new ChatRoom();

                    room.init(response.data.room, response.data.members, response.data.all_members, response.data.group);
                    self.rooms[roomID] = room; // add room into tabs stack
                    self.dispatchEvents(response.data.events);
                    self.activateTab(roomID);
                    Chat.enableUpdate();
                    self.initEventHandlers();
                    Chat.openEnabled = true;
                    Chat.getLastMessageInGroupChat(response.data.events.events, self.activeRoom);
                    self.iScrollInit(roomID);
                }
            }, 'json');
        }

    }

    this.initEventHandlers = function () {

        $('.dialog.room-chat').off('touchend');
        $('.dialog.room-chat').on('touchend', function() {
            if( $(this).scrollTop() < 0 ) {
                $(this).scrollTop(0);
            }
        });

        $('.dialog.room-chat .innerDialog').off('scroll');

        $('.dialog.room-chat .innerDialog').on('scroll', function (event) {

            if (self.disableScroll) {
                e.preventDefault();
                return false;
            }
            if(Chat.isUpdateEnabled()) {

                if(event.target.scrollTop < 100 && event.target.scrollTop >= 0 && $(event.target).find( ".eventData" ).length) {

                    $(document).on("touchmove", function(event){
                        event.preventDefault();
                    });

                    $('body').on('touchstart touchend touchcancel touchleave touchmove scroll', function(event) {
                        event.stopPropagation();
                        return false;
                    });

                    // $('#processRequest').show();

                    // $('.eventsDialog').prepend('<div class="preloader">Подождите</div>');
                }

                if(event.target.scrollTop <= 100 && $(event.target).find( ".eventData" ).length) {
                    Chat.disableUpdate();
                    disableScroll = true;
                    var inner = $(event.target).find( ".innerDialog" );
                    var offset = inner.height();

                    var x = $(event.target).find( ".eventData" );
                    var id = x.data('id');
                    var room_id = x.data('room_id');
                    //console.log(event.target);

                    $('.chat-preloader').css('opacity', 1);

                    Chat.Panel.rooms[room_id].loadMore(id, event.target);
                    Chat.enableUpdate();
                }
            }
        });

        if (is_touch_device()) {
/*
            $('.dialog.room-chat').on('touchstart', function (e) {
                if (disableScroll) {
                    e.preventDefault();
                    return false;
                }
            });

            $('.dialog.room-chat').on('touchmove', function (e) {
                if (disableScroll) {
                    e.preventDefault();
                    return false;
                }
            });

            $('.dialog.room-chat').on('touchend', function (e) {
                if (disableScroll) {
                    e.preventDefault();
                    return false;
                }
            });
*/
        }

    }

    this.disableCloseTabs = function () {
        $(".room-tab").addClass('disable-remove');
    }

    this.enableCloseTabs = function () {
        $(".room-tab").removeClass('disable-remove');
    }

    this.checkMember = function(members) {
        var activeRoom = self.rooms[Chat.Panel.activeRoom];
        if (members && members.split(',').length) {
            members = members.split(',');
            if (members.length > 1) {
                return false;
            }
            var memberID = members[0];
            var activeRoom = self.rooms[Chat.Panel.activeRoom];
            for(var id in activeRoom.members) {
                if (id == memberID) { // already in this room
                    return false;
                }
            }
        }
        return true;
    }

    this.updateAddMembers = function() {
        if (self.activeRoom) {
            if (Chat.Panel.rooms[Chat.Panel.activeRoom].ChatRoom.canAddMember) {
                $('.add-member', self.panel).each(function(){
                    if (self.checkMember($(this).data('members').toString())) {
                        $(this).show();
                    }
                });
            }
        }
    }

    this.updateDelContacts = function() {
        if (self.activeRoom) {
            $('.remove-contact', self.panel).show();
            $('#removeContact_' + self.activeRoom, self.panel).hide();
        }
    }

    this.updateTabs = function() {
        if ($(".openChats .room-tab").length > 1) { // single tab must be not closed
            self.enableCloseTabs();
        } else {
            self.disableCloseTabs();
        }
    }

    this.activateTab = function(roomID) {
        var nameUG, src, rating, tmpl, memberId;
        self.updateTabs();
        if (roomID) {
            self.activeRoom = roomID;
        }
        $('.add-member', self.panel).hide();
        if (self.activeRoom) {
            self.updateAddMembers();
            self.updateDelContacts();
            self.rooms[self.activeRoom].activate();

            if (Object.keys(self.rooms[self.activeRoom].all_members).length > 1) {
                $('.chat-user-group-name').find('.conference-title').show();
                $('.chat-user-group-name').find('.user-chat-name-title').hide();
                initiator_id = Chat.lastMessageUserId;
                src = self.rooms[self.activeRoom].members[initiator_id];

                if (src === undefined) {
                    $('.chat-avatar').html('');
                } else {
                    rating = src.User.rating_class;
                    src = src.UserMedia.url_img;
                    src = src.replace(/noresize/, 'thumb100x100');
                    tmpl = '<img class="'+rating+' ava" src="'+src+'" alt="'+name+'" style="width: 40px" />';
                    $('.chat-avatar').html(tmpl);
                }

            } else {
                $.each(self.rooms[self.activeRoom].members, function(key,val) {
                    nameUG = val.User.full_name;
                    src = val.UserMedia.url_img;
                    src = src.replace(/noresize/, 'thumb100x100');
                    rating = val.User.rating_class;
                    memberId = val.User.id;
                });
                $('.chat-user-group-name').find('.conference-title').hide();
                $('.chat-user-group-name').find('.user-chat-name-title').show().html(nameUG);
                tmpl = '<img class="'+rating+' ava" src="'+src+'" alt="'+name+'" style="width: 40px" />';
                $('.chat-avatar').html(tmpl);
            }

        }
		self.listheight();
    }

    this.closeTab = function (roomID) {
        var aRoomID = Object.keys(self.rooms);
        var nextRoom = 0;
        var prevRoom = 0;
        if (aRoomID.length > 1) { // disable to close single tab
            for(var i = 0; i < aRoomID.length; i++) {
                nextRoom = i + 1;
                prevRoom = i - 1;
                if (aRoomID[i] == roomID) {
                    break;
                }
            }

            var newID;
            if (nextRoom < aRoomID.length) {
                newID = aRoomID[nextRoom];
            } else {
                newID = aRoomID[prevRoom];
            }
            self.rooms[roomID].close();
            delete self.rooms[roomID];
            self.activateTab(newID);
        }
    }

    this.dispatchEvents = function (data) {
        var msg, user, file;
        for(var roomID in self.rooms) {
            if (roomID != self.activeRoom) {
                self.rooms[roomID].events = [];
            }
        }
        for(var roomID in data.updateRooms) {
            if (self.rooms[roomID]) {
                self.rooms[roomID].updateMembers(data.updateRooms[roomID]);
            }
        }
        for(var i = 0; i < data.events.length; i++) {
            var event = data.events[i].ChatEvent;
            if (self.rooms[event.room_id]) { // tab could be async-ly closed
                if (event.event_type == chatDef.incomingMsg || event.event_type == chatDef.outcomingMsg) {
                    msg = data.messages[event.msg_id];
                    event.msg = msg.message;
                } else if (event.event_type == chatDef.fileDownloadAvail || event.event_type == chatDef.fileUploaded) {
                    file = data.files[event.file_id];
                    /*
                    event.url = file.url_download;
                    event.file_name = file.orig_fname;
                    */
                    event.file = file;
                }
                self.rooms[event.room_id].events.push(event);
            }
        }
    }

    this.update = function(data) {
        self.render(data.aUsers);
        self.dispatchEvents(data);
        self.activateTab();
    }

    this.addMember = function(userID) {
        self.rooms[self.activeRoom].addMember(userID);
    }

    this.removeMember = function(userID, roomID) {
        self.rooms[roomID].removeMember(userID);
    }

    this.listheight = function() {

        var newY = self.newY;
        var maxHeight = $('.dropdown-chatPanel .list-scroll').height();
        var dropdownHeight = $('.dropdown-chatPanel').height();
        //Height of li element + padding
        var heightMessageLi = $('.messages-new').height() + 17.5;
        //Ratio for dropdown
        var heightRatio = Math.ceil((dropdownHeight - 160 - 60 - 90)/heightMessageLi);
        //Dropdown height
        if (maxHeight < ($(window).height() - 160 - 60 - 90)) {
            heightRatio = Math.floor((maxHeight)/heightMessageLi);
        }
        var heightAdapt = heightRatio * heightMessageLi;

        this.setOuterHeight($('.dropdown-panel-scroll'), heightAdapt);
        this.setOuterHeight($('.messages-list'), heightAdapt);

        //var listScroll = new IScroll('.messages-list', {
        //    mouseWheel: true,
        //    preventDefaultException: { tagName:/.*/ }
        //});
        if (newY != 0) {
            $('.list-scroll').css({transform: 'translateY('+newY+'px)'});
        }
		$(document).on('click','.jcarousel-control-prev-pp',function(e){
            e.preventDefault();
            e.stopPropagation();

            if (newY < 0) {
                newY += 69;
                self.newY = newY;
                //self.listScroll.scrollBy(0, 69, 400);
                $('.list-scroll').css({transform: 'translateY('+newY+'px)'});
            }
		});

		$(document).on('click','.jcarousel-control-next-nn',function(e){
            e.preventDefault();
            e.stopPropagation();

            if (Math.abs(newY) < (maxHeight - heightAdapt) ) {
                newY -= 69;
                self.newY = newY;
                //self.listScroll.scrollBy(0, -69, 400);
                $('.list-scroll').css({transform: 'translateY('+newY+'px)'});
            }
		});
        $(document).on('touchstart', '.dropdown-panel-wrapper', function(e) {
            self.touchStart(e);
        });

        $(document).on('touchmove', '.dropdown-panel-wrapper', function(e) {
            var deltaTouch = self.touchMove(e);

            if (deltaTouch > 0) {
                if (Math.abs(newY) < (maxHeight - heightAdapt) ) {
                    newY -= Math.abs(deltaTouch);
                    self.newY = newY;
                    $('.list-scroll').css({transform: 'translateY(' + newY + 'px)'});
                }
            } else if (deltaTouch == 0) {

            } else {
                if ( newY < 0) {
                    newY += Math.abs(deltaTouch);
                    self.newY = newY;
                    $('.list-scroll').css({transform: 'translateY(' + newY + 'px)'});
                }
            }
        });

        $(document).on('wheel','.dropdown-panel-wrapper',function(e){
            e.preventDefault();
            e.stopPropagation();
            var oEvent = e.originalEvent,
                delta  = oEvent.deltaY;

            if (delta > 0) {
                if (Math.abs(newY) < (maxHeight - heightAdapt) ) {
                    newY -= 69;
                    self.newY = newY;
                    $('.list-scroll').css({transform: 'translateY(' + newY + 'px)'});
                }
            } else {
                if ( newY < 0) {
                    newY += 69;
                    self.newY = newY;
                    $('.list-scroll').css({transform: 'translateY(' + newY + 'px)'});
                }
            }
        });
    }

    this.touchStart = function(e) {
        self.touchStartY = event.touches[0].pageY;
    }

    this.touchMove = function(e){
        var offset;
        offset = (self.touchStartY - event.touches[0].pageY)%20;

        return offset;
    }

	this.setOuterHeight = function (jQuery, height) {
		var heights = new Array();
		heights.push(parseInt(jQuery.css("padding-top").replace("px", "")));
		heights.push(parseInt(jQuery.css("padding-bottom").replace("px", "")));
		heights.push(parseInt(jQuery.css("border-top-width").replace("px", "")));
		heights.push(parseInt(jQuery.css("border-bottom-width").replace("px", "")));
		heights.push(parseInt(jQuery.css("margin-top").replace("px", "")));
		heights.push(parseInt(jQuery.css("margin-bottom").replace("px", "")));
		var calculatedHeight = height;
		for (var i = 0; i < heights.length; i++)
			calculatedHeight -= heights[i];
		jQuery.height(calculatedHeight);
	}

    this.iScrollInit = function(roomID) {

        var _this = this;
        var scrollSelector = '.body-chat .scroller-chat-dialogs-'+roomID;
        //console.warn(scrollSelector);

        setTimeout(function(){
            _this.setOuterHeight($('.chat-page'), $(window).height());
            _this.setOuterHeight($(scrollSelector), $(window).height()-160-100);
            _this.myScroll = new IScroll(scrollSelector, {
                scrollbars: true,
                mouseWheel: true,
                preventDefaultException: {tagName:/.*/, }
            });

            _this.myScroll.on('scrollEnd', function() {
                if (this.y == 0)
                {
                    var inner = $(scrollSelector).find( ".innerDialog" );
                    var id = inner.find('.chat-user-messages').first().data('event-id');

                    $('.chat-preloader').css({
                        'opacity': 1,
                        'visibility': 'visible'
                    });

                    Chat.Panel.rooms[roomID].loadMore(id, scrollSelector);

                    setTimeout(function(){

                        $('.chat-preloader').css({
                            'opacity': 0,
                            'visibility': 'hidden'
                        });
                    },500);

                } else if (this.y < 0) {
                    //console.log('y < 0');
                    //console.log(this.y);
                } else if (this.y == this.maxScrollY) {
                    //console.log('y = maxScrollY');
                    //console.log(this.y);
                } else if (this.y > this.maxScrollY) {
                    //console.log('y > maxScrollY');
                    //console.log(this.y);
                }

            });

            _this.myScroll.scrollToElement(document.querySelector(scrollSelector+' .scrollBottom'), 400);
        }, 300);

    }

}

function is_touch_device() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

var disableScroll = false;

var Struct = {
	$panel: null, 
	
	initPanel: function (container) {
		Struct.panel = container;
		$(Struct.panel).load(structURL.panel, null, function(){
			$('select.formstyler', Struct.panel).styler();
			
			Struct.initHandlers();
		});
	},
	
	initHandlers: function() {
		$('.b-order-bottom-device .order-device', Struct.panel).click(function(){
			lSubmit = false;
			$('.drop-device-list-cell .select-option input').each(function(){
				if (!lSubmit) {
					lSubmit = parseInt($(this).val()) && true;
				}
			});
			if (lSubmit) {
				$('#devicePanelForm').submit();
			}
		});
	}
}
var Search = {
    panel: null,

    initPanel: function (container, params) {
        if( params == 'undefined' ) {
            params = null;
        }
        Search.panel = container;
        $(Search.panel).load(profileURL.panel, params, function(){
            Search.initHandlers();
        });
    },

    initHandlers: function() {
        $('#searchUserForm').ajaxForm({
            url: profileURL.panel,
            target: Search.panel,
            success: function() {
                Search.initHandlers();
                $(Search.panel).trigger("search:drawn");
            }
        });
    }
}

var Note = {
	panel: null,
	container: null,

	initPanel: function (container, id) {
		if (!container) {
			container = Note.container;
		} else {
			Note.container = container;
		}
		Note.panel = container;
		$(Note.panel).load(noteURL.panel, {id: id});
	}
}
var Article = {
	panel: null, 
	
	initPanel: function (container) {
		Article.panel = container;
		$(Article.panel).load(articleURL.panel, null, function(){
			Article.initHandlers();
		});
	},
	
	initHandlers: function() {
		$('#searchArticleForm').ajaxForm({
			url: articleURL.panel,
			target: Article.panel,
			success: function() { Article.initHandlers(); }
		});
	}
}
var Group = {
	panel: null,

	initPanel: function (container) {
		Group.panel = container;
		$(Group.panel).load(groupURL.panel, null, function(){
			Group.initHandlers();
		});
	},

	initHandlers: function() {
		$('#searchGroupForm').ajaxForm({
			url: groupURL.panel,
			target: Group.panel,
			success: function() { Group.initHandlers(); }
		});
	},

	renderGalleryVideoAdmin: function(data) {
		return tmpl('group-gallery-video-admin', data);
	},

	renderGalleryImageAdmin: function(data) {
		return tmpl('group-gallery-image-admin', data);
	},

	showGalleryAdmin: function(data) {
		$('.photoCollection').html(Group.renderGalleryVideoAdmin(data.videos) + Group.renderGalleryImageAdmin(data.images));

		if ((data.images.length + data.videos.length) < groupDef.maxImages) {
			$('.photoButtons').show();
		} else {
			$('.photoButtons').hide();
		}
	},

	updateGalleryAdmin: function(group_id) {
		$.post(groupURL.getGallery, {data: {group_id: group_id}}, function(response){
			if (checkJson(response)) {
				Group.showGalleryAdmin(response.data);
			}
		});
	},

	delGalleryImage: function(group_id, id) {
		$.post(mediaURL.remove, {data: {object_type: 'GroupGallery', object_id: group_id, id: id}}, function(response){
			Group.updateGalleryAdmin(group_id);
		});
	},

	addGalleryVideo: function(group_id) {
		var url = $('.newVideoPopup #add-new-video').val();
		if (url) {
			$.post(groupURL.addGalleryVideo, {data: {group_id: group_id, url: url}}, function(response){
				if (checkJson(response)) {
					$('.newVideoPopup #add-new-video').val('');
					Group.showGalleryAdmin(response.data);
				}
			});
		}
	},

	delGalleryVideo: function(group_id, id) {
		$.post(groupURL.delGalleryVideo, {data: {group_id: group_id, id: id}}, function(response){
			if (checkJson(response)) {
				Group.showGalleryAdmin(response.data);
			}
		});
	},

	join: function(group_id, user_id) {
		$.post(groupURL.join, {data: {group_id: group_id, user_id: user_id}}, function(response){
			if (checkJson(response)) {
				alert($('.joined').html());
				$('#joinGroup').hide();
			}
		});
	}
}

var Cloud = {
	panel: null,
	container: null,
	uploadCounter: 0,
	managerUploadCounter: 0,
	supportedTypes: ['txt','doc','rtf','log','tex','msg','text','wpd','wps','docx','page','csv','dat','tar','xml','vcf','pps','key','ppt','pptx','sdf','gbr','ged','mp3','m4a','waw','wma','mpa','iff','aif','ra','mid','m3v','e_3gp','shf','avi','asx','mp4','e_3g2','mpg','asf','vob','wmv','mov','srt','m4v','flv','rm','png','psd','psp','jpg','tif','tiff','gif','bmp','tga','thm','yuv','dds','ai','eps','ps','svg','pdf','pct','indd','xlr','xls','xlsx','db','dbf','mdb','pdb','sql','aacd','app','exe','com','bat','apk','jar','hsf','pif','vb','cgi','css','js','php','xhtml','htm','html','asp','cer','jsp','cfm','aspx','rss','csr','less','otf','ttf','font','fnt','eot','woff','zip','zipx','rar','targ','sitx','deb','e_7z','pkg','rpm','cbr','gz','dmg','cue','bin','iso','hdf','vcd','bak','tmp','ics','msi','cfg','ini','prf'],

	initPanel: function (container, id) {
		if (!container) {
			container = Cloud.container;
		} else {
			Cloud.container = container;
		}
		Cloud.panel = container;
		$(Cloud.panel).load(cloudURL.panel, {id: id});
	},

	hasType: function (extension) {
		return $.inArray(extension, this.supportedTypes) !== -1;
	}
}
var CloudMover = {
	afterMove: function () {},
	render: function ($this, params) {
		if (!$this.data('what')) {
			return;
		}
		params = params == 'undefined' ? {} : params;
		$.post(cloudURL.panelMove, params, function (response) {
			$('.cloud-manager.popover-content').html(response);

			$('.popoverFolderCreate').css({border: '1px solid #ccc'});
			$('.cloud-manager-move-back').on('click', function () {
				CloudMover.render($this, {id: $(this).data('id')});
			});
			$('.cloud-manager-move-select').on('click', function () {
				$('.cloud-manager-move-select').removeClass('active');
				$(this).toggleClass('active');
				$this.data('where', $(this).data('id'));
			});
			$('.cloud-manager-move-select').doubletap(
				function (event) {
					$target = $(event.currentTarget);
					CloudMover.render($this, {id: $target.data('id')});
				}
			);
			// mover
			$('.popoverFolderCreate .cloudMover').on('click', function () {
				if (!$this.data('what')) {
					return;
				}
				if ($this.data('what') == $this.data('where')) {
					return;
				}
				$.post(cloudURL.move, {id: $this.data('what'), parentId: $this.data('where')}, function () {
					CloudMover.afterMove();
				});
			});
			// close
			$('.popoverFolderCreate .closePopup').on('click', function () {
				$this.popover('hide');
			});
			// init
			$this.data('where', $('.cloud-move-where').data('where'))
		});
	}
};
Date.timeDays = function(days) {
	return 86400 * 1000 * days;
}

Date.fromSqlDate = function(mysql_string) { 
	if(typeof mysql_string === 'string')    {
		var t = mysql_string.split(/[- :]/);
		return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
	}
	return null;   
}
Date.prototype.toSqlDate = function() { 
	return this.getFullYear() + '-' + zeroFormat(this.getMonth() + 1) + '-' + zeroFormat(this.getDate());
}
Date.prototype.toSqlDateTime = function() { 
	return this.getFullYear() + '-' + zeroFormat(this.getMonth() + 1) + '-' + zeroFormat(this.getDate()) + ' ' + 
		this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
}
Date.HoursMinutes = function(jsdate, locale) {
	var hours = jsdate.getHours();
	if (locale && locale == 'rus') {
		return zeroFormat(hours) + ':' + zeroFormat(jsdate.getMinutes());
	}
	return zeroFormat((hours > 12) ? hours - 12 : hours) + ':' + zeroFormat(jsdate.getMinutes()) + ((hours >= 12) ? 'pm' : 'am');
}
Date.fullDate = function(js_date, locale) {
	if (locale && locale == 'rus') {
		return zeroFormat(js_date.getDate()) + '.' + zeroFormat(js_date.getMonth() + 1) + '.' + js_date.getFullYear();
	}
	return zeroFormat(js_date.getMonth() + 1) + '/' + zeroFormat(js_date.getDate()) + '/' + js_date.getFullYear();
}
Date.prototype.addDays = function(days) {
	this.setTime(this.getTime() + Date.timeDays(days));
	return this;
}
Date.local2sql = function(localDate) {
	if (localDate.indexOf('.') > 0) {
		var d = localDate.split('.');
		return d[2] + '-' + d[1] + '-' + d[0];
	}
	var d = localDate.split('/');
	return d[2] + '-' + d[0] + '-' + d[1];
}
function zeroFormat(n) {
	n = parseInt(n);
	return (n >= 10) ? '' + n : '0' + n;
}
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

var Finance = {
	panel: null,
	container: null,

	initPanel: function (container) {
		if (!container) {
			container = Finance.container;
		} else {
			Finance.container = container;
		}
		Finance.panel = container;
		$(Finance.panel).load(financeURL.panel);
	}
}
var sum_bitrate = 0, count_bitrate = 0, context, uploadBtn, objectType, resizeAspect, aspect, jcrop_api, jcrop_data = [], avatar_changed = false;
var acceptedExt = [ 'jpg', 'jpeg', 'png', 'gif' ];
var cropPreviewWidth = 200;

function getFileType(file) {
	var type = file.type.replace(/application\//, '');
	if (type.length > 4) {
		var fname = file.name.split('.');
		if (fname.length > 1) {
			type = fname.pop();
		}
		if (type.length > 4) {
			type = '';
		}
	}
	return type;
}

function getProgressContext(data) {
	var progressID = $(data.fileInput).data('progress_id');
	return (progressID) ? $('#' + progressID).get(0) : document.body;
}

function saveJcropData(c) {
	jcrop_data = [Math.floor(c.x / resizeAspect), Math.floor(c.y / resizeAspect), Math.floor(c.w / resizeAspect), Math.floor(c.h / resizeAspect)];
};

function jcropInit(data) {
	var oFReader = new FileReader();
	oFReader.readAsDataURL(data.files[0]);

	oFReader.onload = function (oFREvent) {

		if (jcrop_api) {
			jcrop_api.destroy();
		}
		//$('img#tempAvatar').remove();
        if(objectType !== 'User') {
            $('img#tempAvatar').remove();
            $('.avatar-img-'+objectType).append('<img id="tempAvatar" src="" alt="" />');
        }
        else {
            //$('#tempAvatar').remove();
            $('#cropper-modal-img-wrap img').attr('src', oFREvent.target.result);
            //$('.avatar-user-div').append('<div id="tempAvatar"></div>');
            //$('.avatar-img-'+objectType).attr('src')
            $('#cropper-modal').modal('show');
            avatar_changed = oFREvent.target.result;
            return;
        }

		var img = $('img#tempAvatar').get(0);
   		$(img).hide().prop('src', oFREvent.target.result);
   		
   		var count = 0;
   		var timer = setInterval(function(){
   			var iW = img.width, iH = img.height;
   			if (count > 50) {
   				alert('Your photo is too large. Please upload another one');
   			}
   			if (iW < 5) {
   				count++;
   				return;
   			}
   			clearInterval(timer);
   			
   			uploadBtn.show();
   			$(img).show();

	   		resizeAspect = cropPreviewWidth / iW;
	   		$(img).prop('width', cropPreviewWidth);
	   		$(img).prop('height', iH * resizeAspect);
			
			if((navigator.userAgent.search(/ipad/i) >= 0) || (navigator.userAgent.search(/iphone/i) >= 0)) {
                	
				var iWidth = $('div.col-sm-3.leftFormBlock').width();

				resizeAspect = iWidth / iW;
				$(img).prop('width', iWidth);
				$(img).prop('height', iH * resizeAspect);	
	
                var is_landscape = false;
                EXIF.getData(img, function() {
                    if(EXIF.getTag(img, 'Orientation') > 5) {
                        $(img).prop('width', iH * resizeAspect);
                        $(img).prop('height', cropPreviewWidth);
                    }
                });
                /*
				$(img).prop('width', iH * resizeAspect);
				$(img).prop('height', 200);
				alert($(img).prop('width'));
                */
			}
	   		
	   		var min = Math.min(iW, iH);
			var aspect = 1;
	   		// console.log(['Orig size', iW, iH, 'Current', img.width, img.height, 'Select', min]);
	   		// alert(['Orig size', iW, iH, 'Current', img.width, img.height, 'Select', min].join());
			if (objectType == 'GroupGallery') {
				aspect = 16 / 9;
			}
			$('#tempAvatar').Jcrop({
				aspectRatio: aspect,
				bgOpacity: 0.5,
				setSelect: [ 0, 0, min, min],
				onSelect: saveJcropData,
        		onChange: saveJcropData
			}, function(){
			    jcrop_api = this;
			});
   		}, 100);
	}
}

$(function () {
    var $image = $('#cropper-modal .img-responsive');
        var cropBoxData,
        canvasData;
    if (objectType == 'GroupGallery') {
        aspect = 16 / 9;
    }
    else
        aspect = 1;
    $('#cropper-modal').on('shown.bs.modal', function () {
        $image.cropper({
            autoCropArea: 0.5,
            minCropBoxWidth: 200,
            aspectRatio: aspect,
            background: false,
            preview: '.avatar-user-div',
            built: function (e) {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            },
            crop: function (e) {
                jcrop_data = [e.x, e.y, e.width, e.height];
            }
        });
    }).on('hidden.bs.modal', function () {
        cropBoxData = $image.cropper('getCropBoxData');
        canvasData = $image.cropper('getCanvasData');
        $image.cropper('destroy');
        $('.avatar-user-div img').show();
    });
    $('.save-upload').click(function(){
        $('.avatar-user-div img').attr('src', avatar_changed);
        $('#cropper-modal').modal('hide');
        $('#userAvatarUpload').click();
    });
	$('.fileuploader').fileupload({
		url: mediaURL.upload,
		dataType: 'json',
            done: function (e, data) {
			var file = data.result.files[0];
			file.object_type = $(data.fileInput).data('object_type');
			if($(data.fileInput).data('real_type') == 'Group'){
				file.object_type = 'Group';
			}
			file.object_id = $(data.fileInput).data('object_id');
			file.crop = jcrop_data;
			
			$('.inputFile').hide();
			$('#processFile', getProgressContext(data)).show();
			
			$('.progress').css('height', 0);
			$('.progress .progress-bar').css('width', 0);
			
			$.post(mediaURL.move, file, function(response){
                $('#processFile', getProgressContext(data)).hide();
                $('.inputFile').show();
                $('#progress-bar', getProgressContext(data)).hide();
                if (checkJson(response)) {
                	if (file.object_type == 'ProjectEvent') {
                		window.location.reload();
                	} else { // User Avatar, User University, Group Avatar
						
						if (file.object_type == 'GroupGallery') {
							Group.updateGalleryAdmin($(data.fileInput).data('object_id'));
						} else 

                		var imgID = $(data.fileInput).data('object_type') + $(data.fileInput).data('object_id');
                		var mediaID = $('#' + imgID).data('media_id');
                		if (mediaID) {
                			$(data.fileInput).data('id', mediaID);
                		}
                		$('#' + imgID).prop('src', response.data[0].Media.url_img.replace(/noresize/, $('#' + imgID).data('resize')));
                		$('#' + imgID).data('media_id', response.data[0].Media.id);
                		if (($(data.fileInput).prop('id') == 'userAvatarChoose') || ($(data.fileInput).prop('id') == 'groupGalleryChoose')) {
                            if (jcrop_api) {
								jcrop_api.destroy();
								jcrop_api = null;
							}
							$('#' + imgID).show();
							$('#tempAvatar').remove();
							uploadBtn.hide();
                		}
                	}
                }
            }, 'json');
		},
		add: function (e, data) {
            if (e.isDefaultPrevented()) {
				return false;
			}

			context = getProgressContext(data);
			$('.progress .progress-bar', context).css('width', 0);
			$('#progress-bar', context).show();
			$('#progress-stats', context).html('&nbsp;');
			
			$('.progress').css('height', '20px');
			
			var clickedButton = data.fileInput[0];
			if (($(clickedButton).prop('id') == 'userAvatarChoose') || ($(clickedButton).prop('id') == 'userUniversityChoose') || ($(clickedButton).prop('id') == 'groupGalleryChoose')) {
				
				var ext = getFileType(data.files[0]);
				if ($.inArray(ext, acceptedExt) < 0) {
					alert('Selected file is not an image');
					$('.progress').css('height', 0);
					$('#progress-bar', context).hide();
					$('#progress-stats', context).html('');
					return;
				}
				
				if (($(clickedButton).prop('id') == 'userAvatarChoose') || ($(clickedButton).prop('id') == 'groupGalleryChoose')) {
					var imgDOM = 'img#' + $(clickedButton).data('object_type') + $(clickedButton).data('object_id');
					if( $(imgDOM).attr('data-crop_resize') ) {
						cropPreviewWidth = $(imgDOM).data('crop_resize');
					} else {
						cropPreviewWidth = 200;	
					}
					// $('#userAvatarUpload').data(data);
					$('img#' + $(clickedButton).data('object_type') + $(clickedButton).data('object_id')).hide();
					uploadBtn = $(this).parents('.inputFile').find('.upload');
					objectType = $(clickedButton).data('object_type');
					uploadBtn.data(data);
					jcropInit(data);
					return;
				}
			}
			
			$('.inputFile').hide();
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('.progress .progress-bar', getProgressContext(data)).css('width', progress + '%');
			sum_bitrate+= data.bitrate;
			count_bitrate++;
			var avg_bitrate = sum_bitrate / count_bitrate;
			var html = Format.bitrate(avg_bitrate) + ' | ' +
				Format.time((data.total - data.loaded) * 8 / avg_bitrate) + ' | ' +
				Format.percentage(data.loaded / data.total) + ' | ' +
				Format.fileSize(data.loaded) + ' / ' + Format.fileSize(data.total);
			//$('#progress-stats', context).html(chatLocale.Loading); // html
			$('#progress-stats', context).html(progress + '%');
		}
	}).prop('disabled', !$.support.fileInput)
		.parent().addClass($.support.fileInput ? undefined : 'disabled');
});


var InvestCategory = {
    panel: null,

    initPanel: function (container) {
        InvestCategory.panel = container;
        $(InvestCategory.panel).load(investURL.panel, null, function(){
            InvestCategory.initHandlers();
        });
    },

    initHandlers: function() {
    }
}
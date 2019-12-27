var ChatRoom = function() {
    var self = this;
    self.ChatRoom = null;
    self.group = null;
    self.roomID = null;
    self.members = {};
    self.all_members = {};
    self.events = [];
    self.dialog = null;
    self.unread = [];
    self.lFirstRun = true;
    self.lCanSend = true;

    this.init = function(room, members, all_members, group) {
        self.ChatRoom = room.ChatRoom;
        self.group = group;
        self.roomID = room.ChatRoom.id;
        self.members = members;
        self.all_members = all_members;
        self.render();
        Chat.fixPanelHeight();

        //$('.eventsDialog').prepend('<div class="chat-preloader"><span></span>Подождите...</div>');
    }

    this.initHandlers = function() {

        $('.rightMessage .editPanel .pencil').off('click');
        $('.rightMessage .editPanel .pencil').on('click', function(){
            $('#editMessage #message').val( $(this).data('msg') );
            // $("#editMessage #message").getNiceScroll().resize();
            $('#editMessage #event_id').val( $(this).data('event') );
            // $('#editMessage #message').trigger('autosize.resize');

            $('#editMessage').css('opacity', '0');
            $('#editMessage').css('display', 'block');
            // $('#editMessage #message').trigger('autosize.resize');
            $('#editMessage').css('display', 'none');
            $('#editMessage').css('opacity', '1');

            $('#editMessage').modal('show');
        });

        // $('#editMessage').on('shown.bs.modal', function(){
        //     $('#editMessage #message').trigger('autosize.resize');
        // });

        $('.rightMessage .editPanel .bin').off('click');
        $('.rightMessage .editPanel .bin').on('click', function(){

            if(!confirm('Are you sure ?')) {
                return;
            }
            var event_id = $(this).data('event');
            $.post( chatURL.removeMessage, {data: {event_id: event_id} },
                function (response) {
                obj = response;
                if( obj !== null ) {
                    if(obj.status == "ERROR") {
                        alert( obj.message );
                    }
                    if(obj.status == "OK") {
                        $('#event-'+event_id).remove();
                    }
                }
            });

        });

        $('.rightMessage .text, .leftMessage .text').linkify({
            tagName: 'a',
            target: '_blank',
            newLine: '\n',
            linkClass: 'underlink',
            linkAttributes: null
        });
    }

    //this.scrollBottom = function () {
    //    setTimeout(function(){
    //        $('html, body').animate({scrollTop:$(document).height()}, 1000);
    //    }, 100);
    //}

    this.close = function() {
        $('#roomTab_' + self.roomID).remove();
        $('#roomChat_' + self.roomID).remove();
        $('#chatMembers_' + self.roomID).remove();
    }

    this.render = function() {
        // render room container

        $('.chat-dialogs').append(tmpl('room-chat', {room_id: self.roomID}));
        self.dialog = $('.chat-dialogs #roomChat_' + self.roomID + ' .innerDialog .eventsDialog').get(0);

        // render room tab
        $('.chat-tabs').append(tmpl('room-tab', {roomID: self.roomID, members: self.members, msg_count: 0, room: self.ChatRoom, group: self.group}));

        // $('.chat-members').append(tmpl('chat-members', {roomID: self.roomID, members: self.members}));

        setTimeout(function(){
            self.initHandlers();
        }, 100);
    }

    this.renderEvents = function(aEvents) {
        var html = '', event;
        // self.firstEvent = (aEvents[0]) ? aEvents[0].id : 0;
        for(var i = 0; i < aEvents.length; i++) {
            var event = aEvents[i];
            //if (i == 0) {
            //    html+= tmpl('chat-event-first', {event: event});
            //}
            if (event.active) {
                self.unread.push(event.id);
            }
            if( $('#event-'+event.id).length == 0 && $(html).filter('#event-'+event.id).length == 0 )
                html+= tmpl('chat-event', {event: event, members: self.all_members, group: ((self.ChatRoom.group_id) ? self.group : false)});
            if (event.event_type == chatDef.wasExcluded) {
                self.lCanSend = false;
            } else if (event.event_type == chatDef.wasInvited) {
                self.lCanSend = true;
            }
        }

        return html;
    },

    this.activate = function() {
        // activate tab
        $('.room-tab').removeClass('active');
        $('#roomTab_' + self.roomID).addClass('active');

        // activate dialog
        $('.room-chat').hide();
        $('#roomChat_' + self.roomID).show();

        // activate users
        $('.chat-members').hide();
        $('#chatMembers_' + self.roomID).show();
        $('#roomUnread_' + self.roomID).html('');

        if (self.events) {

            $(self.dialog).append(self.renderEvents(self.events));
            if (self.lCanSend) {
                $('.sendForm').show();
            } else {
                $(".sendForm").hide();
            }

            self.events = [];
            if (self.unread.length) {
                setTimeout(function(){
                    self.scrollRefresh(self.roomID);
                }, 100);
                Chat.disableUpdate();
                //self.setUnread(Chat.Panel.formatUnread(self.unread.length));
                co = parseInt($('#chatTotalUnread').html());
                count = co - self.unread.length;
                if (count > 10) {
                    count = '10+';
                } else if (!count) {
                    count = '';
                }

                $('#chatTotalUnread').html(count);
                //Вот тут удаляем из таймлайна
                $.post("/ChatAjax/deleteEvents.json",{
                     room:self.roomID
                    }
                );
                $.post(chatURL.markRead, {data: {ids: self.unread}}, function(response){
                    if (checkJson(response)) {
                        self.unread = [];
                        Chat.enableUpdate();
                    }
                }, 'json');
            } else if (self.lFirstRun) {
                self.lFirstRun = false;
                Chat.fixPanelHeight();
            }
        }

    }

    this.sendMsg = function () {
        Chat.openEnabled = false;
        var msg = $('.sendForm .send-message-text').find('textarea').val();
        var clouds = [];
        var id;
        if (msg) {
            $('.sendForm textarea').val('');
            $('#processRequest').show();
            $.post(chatURL.sendMsg, {data: {msg: msg, roomID: self.roomID}}, function(response){
				if (checkJson(response)) {
                    $(self.dialog).append(tmpl('chat-msg', {msg: msg, eid: response.data}));
                    $('#processRequest').hide();
                }
				setTimeout(function(){
					self.initHandlers();
					self.scrollRefresh(self.roomID);
				}, 100)
                Chat.openEnabled = true;
                id = response.data;
                id++;
                $.post("/ChatAjax/addEvent.json",{
                        message:msg,
                        clouds:clouds,
                        roomID: self.roomID
                    }
                );

            }, 'json');
        }
        var i =0;
        $('.preloadArea').each(function(){
			var cloud_id = $(this).attr('data-cloud');
            clouds[i] = cloud_id;
            i++;
			$.ajax({
				type: "POST",
				url: "/ChatAjax/cloneFromCloud",
				dataType: "JSON",
				data: {cloud_id: cloud_id, roomID: self.roomID},
				success: function(response) {
					$('#chatUploadFiles').empty();
					var event = {
						event_type: 6,
						file: response.data[0].Media,
						id: response.data[0].Media.object_id
					};
					$(self.dialog).append(tmpl('chat-file', {event: event}));
					setTimeout(function(){
						self.initHandlers();
						self.scrollRefresh(self.roomID);
					}, 100);
				},
				error: function() {}
			});
        });
        if (!msg) {
            $.post("/ChatAjax/addEvent.json",{
                    message:0,
                    clouds:clouds,
                    roomID: self.roomID
                }
            );
        }
        //console.log(Chat.Panel);
        //Chat.Panel.myScroll.refresh();

    }

    this.sendFile = function (fileData) {
        Chat.openEnabled = false;
        $.post(chatURL.sendFile, {data: {id: fileData.id, roomID: self.roomID}}, function(response){

            if (checkJson(response)) {
                $('.preloadThumb img').remove();
                $('.preloadFile span').remove();
                $('.preloadArea .circle_remove').hide();
                $('.preloadArea .process').hide();
                $('.preloadArea').hide();
                Chat.fixPanelHeight();

                var event = {
                    event_type: chatDef.fileUploaded,
                    file: fileData
                };
                $(self.dialog).append(tmpl('chat-file', {event: event}));
            }
            Chat.openEnabled = true;
        }, 'json');
    }

    this.sendFiles = function (fileData) {
        Chat.openEnabled = false;
        $('#processFile').show();
        $.post(chatURL.sendFiles, {data: {files_data: fileData, roomID: self.roomID}}, function(response){
            if (checkJson(response)) {
                $('#processFile').hide();
                if(response['data'].hasOwnProperty('Error')) {
                    $('.preloadArea').empty().html('<div style="color: red;">' + response['data']['Error'] + '</div>');
                    setTimeout(function() {
                        $('.preloadArea').fadeOut('slow', function() {
                            $(this).remove();
                        })
                    }, 3000);
                }
                else
                    $('.preloadArea').remove();
                Chat.fixPanelHeight();

                for(var i = 0; i < response.data.length; i++) {
                    var event = {
                        event_type: chatDef.fileUploaded,
                        file: response.data[i].Media,
                        id: response.data[i].Media.object_id
                    };
                    $(self.dialog).append(tmpl('chat-file', {event: event}));

                    setTimeout(function(){
                        self.initHandlers();
                    }, 100);
                }
                setTimeout(function(){
                    self.scrollRefresh(self.roomID);
                }, 100);
            }
            Chat.openEnabled = true;
        }, 'json');
    }

    this.setUnread = function(count) {
        $('#roomTab_' + self.roomID + ' span.badge').html(count);
    }

    this.updateMembers = function(members) {
        self.members = members;
        $('#roomTab_' + self.roomID).replaceWith(tmpl('room-tab', {roomID: self.roomID, members: self.members, msg_count: 0, room: self.ChatRoom}));
        Chat.Panel.updateTabs();
    }

    this.addMember = function(userID) {
        Chat.disableUpdate();
        $('#processRequest').show();
        $.post(chatURL.addMember, {data: {room_id: self.roomID, user_id: userID}}, function(response){
            if (checkJson(response)) {
                if (response.data.newRoom) {
                    Chat.enableUpdate();
                    $('#processRequest').hide();
                    Chat.Panel.openRoom(response.data.newRoom.ChatRoom.id);
                    return;
                }
                self.updateMembers(response.data.members, response.data.all_members);

                // update dialog
                var event = {
                    event_type: chatDef.invitedUser,
                    recipient_id: userID
                };

                //$(self.dialog).append(tmpl('extra-msg', {event: event, members: self.all_members}));
                $(self.dialog).append(tmpl('extra-msg', {event: event, members: response.data.all_members}));
                $('#processRequest').hide();

                setTimeout(function(){
                    self.scrollRefresh(self.roomID);
                }, 100);

            }
        }, 'json');
    }

    this.removeMember = function(userID) {
        Chat.disableUpdate();
        $('#processRequest').show();
        $.post(chatURL.removeMember, {data: {room_id: self.roomID, user_id: userID}}, function(response){
            if (checkJson(response)) {
                if (response.data.newRoom) {
                    Chat.enableUpdate();
                    $('#processRequest').hide();
                    Chat.Panel.openRoom(response.data.newRoom.ChatRoom.id);
                    return;
                }
                self.updateMembers(response.data.members, response.data.all_members);

                // update dialog
                var event = {
                    event_type: chatDef.excludedUser,
                    recipient_id: userID
                };
                $(self.dialog).append(tmpl('extra-msg', {event: event, members: self.all_members}));
                $('#processRequest').hide();


            }
        }, 'json');
    }

    this.loadMore = function(event_id, roomDiv) {
        Chat.disableUpdate();
        var newChatData = '';
        // $('#processRequest').show();
        $.post(chatURL.loadMore, {data: {room_id: self.roomID, id: event_id}}, function(response){
            if (checkJson(response)) {
                if (response.data.events) {
                    //if (response.data.events.get(0).ChatEvent.msg_id != null && response.data.events.get(0).ChatEvent.recipient_id != null ) {
                    //
                    //}

                    Chat.Panel.dispatchEvents(response.data);
                    newChatData = self.renderEvents(self.events);

                    setTimeout( function() {

                        var inner = $(roomDiv).find( ".innerDialog" );
                        var oldScroll = inner.get(0).offsetHeight;

                        $(roomDiv + ' .innerDialog .eventsDialog').prepend( newChatData );
                        newChatData = '';

                        var newScroll = inner.get(0).offsetHeight;
                        var scr = newScroll - oldScroll;

                        if (Chat.Panel.myScroll != null && (newScroll != oldScroll)) {
                            Chat.Panel.myScroll.scrollTo(0, -(scr), 0);
                        }
                        Chat.Panel.myScroll.refresh();

                        self.events = [];

                        setTimeout( function() {
                            Chat.enableUpdate();
                            disableScroll = false;
                            $(document).off("touchmove");
                            $('body').off('touchstart touchend touchcancel touchleave touchmove');
                        },0);

                        setTimeout(function(){
                            self.initHandlers();
                        }, 100);
                    }, 0);
                }
                // Chat.Panel.activateTab();
            }
        }, 'json');
    }

    this.scrollRefresh = function(roomID) {
        Chat.Panel.myScroll.refresh();
        Chat.Panel.myScroll.scrollToElement(document.querySelector('.body-chat .scroller-chat-dialogs-'+roomID+' .scrollBottom'), 400);
    }



}

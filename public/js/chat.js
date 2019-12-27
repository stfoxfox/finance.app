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

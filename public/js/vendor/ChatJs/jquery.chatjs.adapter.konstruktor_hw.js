var KonstruktorAdapterOptions = (function () {
    function KonstruktorAdapterOptions() {
    }
    KonstruktorAdapterOptions.CURRENT_USER_ID = null;

    return KonstruktorAdapterOptions;
})();

var KonstruktorClientAdapter = (function () {
    function KonstruktorClientAdapter() {
        this.messagesChangedHandlers = [];
        this.typingSignalReceivedHandlers = [];
        this.userListChangedHandlers = [];
        this.handlersIndex = -1;
    }
    // adds a handler to the messagesChanged event
    KonstruktorClientAdapter.prototype.onMessagesChanged = function (handler) {
        this.handlersIndex = this.messagesChangedHandlers.length;
        this.messagesChangedHandlers.push(handler);
    };

    // adds a handler to the typingSignalReceived event
    KonstruktorClientAdapter.prototype.onTypingSignalReceived = function (handler) {
        this.typingSignalReceivedHandlers.push(handler);
    };

    // adds a handler to the userListChanged event
    KonstruktorClientAdapter.prototype.onUserListChanged = function (handler) {
        this.userListChangedHandlers.push(handler);
    };

    KonstruktorClientAdapter.prototype.onPMClose = function () {
        if (this.handlersIndex >= 0) {
            this.messagesChangedHandlers.splice(this.handlersIndex, 1);
        }
    };

    KonstruktorClientAdapter.prototype.triggerMessagesChanged = function (message) {
        for (var i = 0; i < this.messagesChangedHandlers.length; i++){
          this.messagesChangedHandlers[i](message);
        }
    };

    KonstruktorClientAdapter.prototype.triggerTypingSignalReceived = function (typingSignal) {
        for (var i = 0; i < this.typingSignalReceivedHandlers.length; i++) {
	        this.typingSignalReceivedHandlers[i](typingSignal);
        }
    };

    KonstruktorClientAdapter.prototype.triggerUserListChanged = function (userListChangedInfo) {
        for (var i = 0; i < this.userListChangedHandlers.length; i++){
            this.userListChangedHandlers[i](userListChangedInfo);
        }
    };
    return KonstruktorClientAdapter;
})();

var KonstruktorServerAdapter = (function () {
    function KonstruktorServerAdapter(clientAdapter) {
        this.clientAdapter = clientAdapter;
        this.users = new Array();
        var _this = this;

        var chatUsers = new Array();
        if(highWay.isOpen()){
            highWay.call('transport.get', ['/mini-chat/users/contact-list/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json']).then(
                function (response) {
                    for (i = 0; i < response.users.length; i++) {
                        User = new ChatUserInfo();
                        chatUsers.push($.extend(User, response.users[i]));
                    }
                    _this.users = chatUsers;
                    // configuring rooms
                    var defaultRoom = new ChatRoomInfo();
                    defaultRoom.Id = 1;
                    defaultRoom.Name = "Default Room";
                    defaultRoom.UsersOnline = _this.users.length;

                    _this.rooms = new Array();
                    _this.rooms.push(defaultRoom);
                    _this.clientAdapter.triggerUserListChanged(chatUsers);
                }
            );
        } else {
            $.ajax({
                url: '/UserAjax/getById/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
                async: true
            }).done(function(response){
                //console.log(response);
                myUser = new ChatUserInfo();
                myUser.Id = response.User.id;
                myUser.RoomId = response.User.id;
                myUser.Name = response.User.full_name;
                myUser.Email = response.User.username;
                myUser.ProfilePictureUrl = response.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                myUser.ProfilePictureClass = response.User.rating_class;
                myUser.ProfilePictureClass = response.User.rating;
                myUser.Status = 1;
                chatUsers.push(myUser);
            });

            $.ajax({
                url: '/ChatAjax/miniContactList.json',
                async: true
            }).done(function(response){
                //console.log(response);
                var active_messages_count = 0;
                for (i = 0; i < response.data.aUsers.length; i++) {
                    data = response.data.aUsers[i];
                    chatUser = new ChatUserInfo();
                    chatUser.Id = data.User.id;
                    chatUser.RoomId = data.ChatContact.room_id;
                    chatUser.active_count = data.ChatContact.active_count;
                    chatUser.Name = data.User.full_name;
                    chatUser.Email = data.User.username;
                    chatUser.members = data.ChatContact.members.length;
                    chatUser.ProfilePictureUrl = data.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                    chatUser.ProfilePictureClass = data.User.rating_class;
                    chatUser.rating = data.User.rating;
                    //chatUser.rating
                    chatUser.Status = 1;

                    //all messages count:
                    active_messages_count += Number(data.ChatContact.active_count);

                    // Chat group not suported!!!
                    if(data.ChatContact.group_id){
                        //if(KonstruktorAdapterOptions.CURRENT_USER_ID != data.ChatContact.responsible_id) {
                        //    chatUser.Name = data.ChatContact.group_name;
                        //    chatUser.ProfilePictureUrl = data.ChatContact.logo;
                        //}
                        //chatUser.group_id = data.ChatContact.group_id;
                    } else {
                        //chatUser.group_id = null;
                        chatUsers.push(chatUser);
                    }


                }
                //set all messages count:
                if (active_messages_count > 0) {
                    if ($(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").length == 0) {
                        $(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image").append("<div class='message-user-count'>" + active_messages_count + "</div>");
                    }
                    else {
                        $(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").html(active_messages_count);
                    }
                }

                _this.users = chatUsers;
                //configuring rooms
                var defaultRoom = new ChatRoomInfo();
                defaultRoom.Id = 1;
                defaultRoom.Name = "Default Room";
                defaultRoom.UsersOnline = _this.users.length;

                _this.rooms = new Array();
                _this.rooms.push(defaultRoom);
                _this.clientAdapter.triggerUserListChanged(chatUsers);
            });
        }
    }

    KonstruktorServerAdapter.prototype.sendTypingSignal = function (roomId, conversationId, userToId, done) {
        //console.log("DemoServerAdapter: sendTypingSignal");
    };

    KonstruktorServerAdapter.prototype.sendMessage = function (roomId, conversationId, otherUserId, messageText, clientGuid, done, type) {

        var _this = this;
        //console.log("DemoServerAdapter: sendMessage");
        if(roomId == 'undefined'){
            otherUser = this.getUserById(otherUserId);
            roomId = otherUser.RoomId;
        }
        if(highWay.isOpen()){
            highWay.call('transport.post', [
                '/mini-chat/rooms/send-message/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
                { room_id: roomId, user_id: otherUserId, message: messageText }
            ]).then(function (response) {
                bounceMessage = new ChatMessageInfo();
                $.extend(bounceMessage, response.event)
                bounceMessage.ClientGuid = clientGuid;
                bounceMessage.direction = 'out';
                bounceMessage.ConversationId = conversationId;
                _this.clientAdapter.triggerMessagesChanged(bounceMessage);
            });
        } else {
            $.ajax({
                url: '/ChatAjax/sendMsg.json',
                method: 'POST',
                async: true,
                data: {
                    roomID: roomId,
                    msg: messageText,
                }
            }).done(function(response){
                bounceMessage = new ChatMessageInfo();
                bounceMessage.UserFromId = KonstruktorAdapterOptions.CURRENT_USER_ID; // It will from our user
                bounceMessage.UserToId = otherUserId; // ... to other user
                bounceMessage.RoomId = roomId;
                bounceMessage.ConversationId = conversationId;
                bounceMessage.Message = messageText;
                bounceMessage.msgId = response.data;
                bounceMessage.direction = 'out';
                bounceMessage.ClientGuid = clientGuid;
                _this.clientAdapter.triggerMessagesChanged(bounceMessage);
                return response.data;
            });
        }
    };
    KonstruktorServerAdapter.prototype.sendFiles = function (roomId, conversationId, otherUserId, messageText, clientGuid, done,type) {
        var _this = this;
        //console.log("DemoServerAdapter: sendFiles");
        if(roomId = 'undefined'){
            otherUser = this.getUserById(otherUserId);
            roomId = otherUser.RoomId;
        }
        $.ajax({
            url: '/ChatAjax/sendFiles.json',
            method: 'POST',
            async: true,
            data: {
                roomID: roomId,
                files_data: messageText,
            }
        }).done(function(response){
            var data = response.data;
            for(var i=0; i< data.length; i++){
              bounceMessage = new ChatMessageInfo();
              bounceMessage.UserFromId = KonstruktorAdapterOptions.CURRENT_USER_ID; // It will from our user
              bounceMessage.UserToId = otherUserId; // ... to other user
              bounceMessage.RoomId = roomId;
              bounceMessage.Type = 'file';
              bounceMessage.msgId = data[i].Media.id;
              bounceMessage.direction = 'out';
              bounceMessage.ConversationId = conversationId;
              bounceMessage.Message = data[i].Media;
              bounceMessage.ClientGuid = clientGuid;

              _this.clientAdapter.triggerMessagesChanged(bounceMessage);
            }

        });

    };
    // gets the message history from a room, conversation or user
    KonstruktorServerAdapter.prototype.getMessageHistory = function (roomId, conversationId, otherUserId, group_id, message_count, done) {
        var _this = this;
        var chatMessages = new Array();

        if(highWay.isOpen()){
            highWay.call('transport.post', [
                '/mini-chat/rooms/get-history/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
                { user_id: otherUserId, group_id: group_id, message_count: message_count }
            ]).then(function (response) {
                markRead = new Array();
                for (var i = 0; i < response.events.length; i++) {
                    var chatEvent = new ChatMessageInfo();
                    $.extend(chatEvent, response.events[i])
                    chatEvent.ConversationId = conversationId;
                    chatEvent.Message = _this.decodeHTMLEntities(chatEvent.Message);
                    if(chatEvent.active){
                        markRead.push(parseInt(chatEvent.id));
                    }
                    chatMessages.push(chatEvent);
                }
                if(markRead.length > 0){
                    highWay.call('transport.post', [
                        '/mini-chat/rooms/mark-read/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
                        { ids: markRead }
                    ]).done(function(result){
                        $('#message-user-count-'+otherUserId).remove();
                        for (var i = 0; i < markRead.length; i++) {
                            $('#chatEvent-'+markRead[i]).remove();
                        }
                        //Is it working here?
                        //if(typeof Timeline != 'undefined'){
                        //    Timeline.collapseEmptyCells();
                        //}
                    });
                }
                done(chatMessages);
            });
        } else {
            //Fallback
            $.ajax({
                url: '/ChatAjax/getRoomHistory.json',
                method: 'POST',
                async: true,
                data: { user_id: otherUserId, group_id: group_id, message_count: message_count },
            }).done(function(response){
                markRead = new Array();
                for (var i = 0; i < response.events.length; i++) {
                    from_id = 0; to_id = 0;
                    data = response.events[i];
                    var chatMessage = new ChatMessageInfo();
                    chatMessage.RoomId = response.ChatRoom.id;
                    chatMessage.Created = data.ChatEvent.created;
                    chatMessage.ConversationId = conversationId;
                    data = response.events[i];
                    if(data.ChatMessage.id == null){
                      user_id = data.ChatEvent.user_id;
                      curent = KonstruktorAdapterOptions.CURRENT_USER_ID;
                      message_id = data.ChatEvent.file_id;
                      if(data.ChatEvent.event_type == 7){
                          from_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                          to_id = data.ChatEvent.user_id;
                          direction = 'in';
                      } else if(data.ChatEvent.event_type == 6){
                          from_id = data.ChatEvent.user_id;
                          to_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                          direction = 'out';
                      }
                      chatMessage.Type = 'file';
                      chatMessage.msgId = message_id;
                      chatMessage.direction = direction;
                      chatMessage.Message = data.File;
                    }else{
                      if(data.ChatEvent.event_type == 1){
                          to_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                          from_id = data.ChatEvent.user_id;
                          direction = 'out';
                      } else if(data.ChatEvent.event_type == 2){
                          to_id = data.ChatEvent.user_id;
                          from_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                          direction = 'in';
                      }
                      chatMessage.direction = direction;
                      chatMessage.msgId = data.ChatEvent.id;
                      chatMessage.Type = 'msg';
                      chatMessage.Message = _this.decodeHTMLEntities(data.ChatMessage.message);
                    }
                    if(data.ChatEvent.active){
                        markRead.push(parseInt(data.ChatEvent.id));
                    }
                    chatMessage.UserFromId = from_id;
                    chatMessage.UserToId = to_id;
                    chatMessages.push(chatMessage);
                }
                if(markRead.length > 0){
                    //Вот тут удаляем из таймлайна
                    $.post("/ChatAjax/deleteEvents.json",{
                            room:response.ChatRoom.id
                        }
                    );

                    $.ajax({
                        url: '/ChatAjax/markRead.json',
                        method: 'POST',
                        async: true,
                        data: {
                            ids: markRead
                        },
                    }).done(function(result){
                        $('#message-user-count-'+otherUserId).remove();
                        for (var i = 0; i < markRead.length; i++) {
                            $('#chatEvent-'+markRead[i]).remove();
                        }
                        if ($(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").length != 0) {

                            var count_mess = Number($(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").html());
                            if (count_mess - markRead.length > 0) {
                                $(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").html(count_mess - markRead.length);
                            }
                            else if (count_mess - markRead.length == 0) {
                                $(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").remove();
                            }
                        }
                        //Is it working here?
                        //if(typeof Timeline != 'undefined'){
                        //    Timeline.collapseEmptyCells();
                        //}
                    });

                }
                done(chatMessages);
            });
        }

    };

    KonstruktorServerAdapter.prototype.decodeHTMLEntities = function(str) {
        var element = document.createElement('div');
        if(str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        return str;
    };

    KonstruktorServerAdapter.prototype.getUserInfo = function (userId, group_id, done) {
        //console.log("DemoServerAdapter: getUserInfo");
        var user = null;
        if(this.users.length){
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].Id == userId && this.users[i].group_id == group_id) {
                    user = this.users[i];
                    break;
                }
            }
            if (user != null){
                done(user);
                //throw "User doesn't exit. User id: " + userId;
            }
        } else {
            if(highWay.isOpen()){
                highWay.call('transport.get', ['/mini-chat/users/contact-list/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json']).then(function (response){
                    user = [];
                    for (i = 0; i < response.users.length; i++) {
                        if(response.users[i].Id == userId){
                            user = response.users[i];
                            break;
                        }
                    }
                    contact = new ChatUserInfo();
                    $.extend(contact, user);
                    if (contact != null){
                        done(contact);
                        //throw "User doesn't exit. User id: " + userId;
                    }
                });
            } else {
                $.ajax({
                    url: '/UserAjax/getById/'+userId+'.json',
                    async: true
                }).done(function(response){
                    contact = new ChatUserInfo();
                    contact.Id = response.User.id;
                    contact.RoomId = response.ChatContact.room_id;
                    contact.Name = response.User.full_name;
                    contact.Email = response.User.username;
                    contact.ProfilePictureUrl = response.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                    contact.ProfilePictureClass = response.User.rating_class;
                    contact.rating =response.User.rating;
                    contact.Status = 1;
                    if (contact != null){
                        done(contact);
                        //throw "User doesn't exit. User id: " + userId;
                    }
                });
            }
        }
    };

    KonstruktorServerAdapter.prototype.getUserList = function (roomId, conversationId, done) {
        //console.log("KonstruktorServerAdapter: getUserList");
        //if (roomId == DemoAdapterConstants.DEFAULT_ROOM_ID) {
            done(this.users);
            return;
        //}
        //throw "The given room or conversation is not supported by the demo adapter";
    };

    KonstruktorServerAdapter.prototype.updateUserList = function (roomId, conversationId, done) {
        var _this = this;
        var contacts = new Array();

        if(highWay.isOpen()){
            highWay.call('transport.get', ['/mini-chat/users/contact-list/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json']).then(function (response){
                for (i = 0; i < response.users.length; i++) {
                    User = new ChatUserInfo();
                    contacts.push($.extend(User, response.users[i]));
                }
                //console.log('Update contacts: '+(JSON.stringify(_this.users) !== JSON.stringify(contacts)));
                if(JSON.stringify(_this.users) !== JSON.stringify(contacts)){
                //if(_this.compareObjects(_this.users, contacts)){
                    _this.users = contacts;
                    _this.clientAdapter.triggerUserListChanged(contacts);
                }
            });
        } else {
            $.ajax({
                url: '/UserAjax/getById/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
                async: true
            }).done(function(response){
                myUser = new ChatUserInfo();
                myUser.Id = response.User.id;
                myUser.RoomId = response.User.id;
                myUser.Name = response.User.full_name;
                myUser.Email = response.User.username;
                myUser.ProfilePictureUrl = response.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                myUser.ProfilePictureClass = response.User.rating_class;
                myUser.rating = response.User.rating;
                myUser.Status = 1;
                contacts.push(myUser);
            });

            $.ajax({
                url: '/ChatAjax/miniContactList.json',
                async: true
            }).done(function(response){
                //console.log(response);
                var active_messages_count = 0;
                for (i = 0; i < response.data.aUsers.length; i++) {
                    data = response.data.aUsers[i];
                    chatUser = new ChatUserInfo();
                    chatUser.Id = data.User.id;
                    chatUser.RoomId = data.ChatContact.room_id;
                    chatUser.active_count = data.ChatContact.active_count;
                    chatUser.Name = data.User.full_name;
                    chatUser.Email = data.User.username;
                    chatUser.members = data.ChatContact.members.length;
                    chatUser.ProfilePictureUrl = data.UserMedia.url_img.replace(/noresize/, 'thumb100x100');
                    chatUser.ProfilePictureClass = data.User.rating_class;
                    chatUser.rating = data.User.rating;
                    chatUser.Status = 1;
                    contacts.push(chatUser);

                    //all messages count:
                    active_messages_count += Number(data.ChatContact.active_count);
                }

                //set all messages count:
                if (active_messages_count > 0) {
                    if ($(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").length == 0) {
                        $(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image").append("<div class='message-user-count'>" + active_messages_count + "</div>");
                    }
                    else {
                        $(".header-nav_right .main-nav .main-nav_item--chat .main-nav_image .message-user-count").html(active_messages_count);
                    }
                }

                //console.log('Update contacts: '+(JSON.stringify(_this.users) !== JSON.stringify(contacts)));
                //console.log(JSON.stringify(_this.users),JSON.stringify(contacts));

                   // if(JSON.stringify(_this.users) !== JSON.stringify(contacts)){
                   // console.log(_this.users.length,contacts.length);

                    if(contacts.length > 0 && contacts !== undefined){
                        //if(_this.compareObjects(_this.users, contacts)) {
                            _this.users = contacts;
                        //}
                        _this.clientAdapter.triggerUserListChanged(contacts);
                    }
                    //}
            });
        }
    };

    KonstruktorServerAdapter.prototype.enterRoom = function (roomId, done) {
        //console.log("KonstruktorServerAdapter: enterRoom");

        //if (roomId != KonstruktorAdapterConstants.DEFAULT_ROOM_ID)
        //    throw "Only the default room is supported in the demo adapter";

        var userListChangedInfo = new ChatUserListChangedInfo();
        userListChangedInfo.RoomId = 1;
        userListChangedInfo.UserList = this.users;

        this.clientAdapter.triggerUserListChanged(userListChangedInfo);
    };

    KonstruktorServerAdapter.prototype.leaveRoom = function (roomId, done) {
        //console.log("DemoServerAdapter: leaveRoom");
    };

    // gets the given user from the user list
    KonstruktorServerAdapter.prototype.getUserById = function (userId) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].Id == userId)
                return this.users[i];
        }
        throw "Could not find the given user";
    };

    KonstruktorServerAdapter.prototype.compareObjects = function (o, p) {
        var i,
            keysO = Object.keys(o).sort(),
            keysP = Object.keys(p).sort();
        if (keysO.length !== keysP.length)
            return false;//not the same nr of keys
        if (keysO.join('') !== keysP.join(''))
            return false;//different keys
        for (i=0;i<keysO.length;++i)
        {
            if (o[keysO[i]] instanceof Array)
            {
                if (!(p[keysO[i]] instanceof Array))
                    return false;
                //if (compareObjects(o[keysO[i]], p[keysO[i]] === false) return false
                //would work, too, and perhaps is a better fit, still, this is easy, too
                if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join(''))
                    return false;
            }
            else if (o[keysO[i]] instanceof Date)
            {
                if (!(p[keysO[i]] instanceof Date))
                    return false;
                if ((''+o[keysO[i]]) !== (''+p[keysO[i]]))
                    return false;
            }
            else if (o[keysO[i]] instanceof Function)
            {
                if (!(p[keysO[i]] instanceof Function))
                    return false;
                //ignore functions, or check them regardless?
            }
            else if (o[keysO[i]] instanceof Object)
            {
                if (!(p[keysO[i]] instanceof Object))
                    return false;
                if (o[keysO[i]] === o)
                {//self reference?
                    if (p[keysO[i]] !== p)
                        return false;
                }
                else if (compareObjects(o[keysO[i]], p[keysO[i]]) === false)
                    return false;//WARNING: does not deal with circular refs other than ^^
            }
            if (o[keysO[i]] !== p[keysO[i]])//change !== to != for loose comparison
                return false;//not the same value
        }
        return true;
    };

    return KonstruktorServerAdapter;
})();

var KonstruktorAdapter = (function () {
    function KonstruktorAdapter(userId) {
        KonstruktorAdapterOptions.CURRENT_USER_ID = userId;
    }
    // called when the adapter is initialized
    KonstruktorAdapter.prototype.init = function (done) {
        this.client = new KonstruktorClientAdapter();
        this.server = new KonstruktorServerAdapter(this.client);
        done();
    };
    return KonstruktorAdapter;
})();

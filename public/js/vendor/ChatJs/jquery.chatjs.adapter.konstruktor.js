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
        for (var i = 0; i < this.typingSignalReceivedHandlers.length; i++)
            this.typingSignalReceivedHandlers[i](typingSignal);
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
        $.ajax({
            url: '/UserAjax/getById/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
            async: false
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
            chatUsers.push(myUser);
        });

        $.ajax({
            url: '/ChatAjax/contactList.json',
            async: false
        }).done(function(response){

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

                // Chat group not suported!!!
                if(data.ChatContact.group_id){
                /*    if(KonstruktorAdapterOptions.CURRENT_USER_ID != data.ChatContact.responsible_id) {
                        chatUser.Name = data.ChatContact.group_name;
                        chatUser.ProfilePictureUrl = data.ChatContact.logo;
                    }
                    chatUser.group_id = data.ChatContact.group_id;*/
                } else {
                    //chatUser.group_id = null;
                    chatUsers.push(chatUser);
                }


            }
        });
        this.users = chatUsers;
          // configuring rooms
        var defaultRoom = new ChatRoomInfo();
        defaultRoom.Id = 1;
        defaultRoom.Name = "Default Room";
        defaultRoom.UsersOnline = this.users.length;

        this.rooms = new Array();
        this.rooms.push(defaultRoom);

        // configuring client to return every event to me
        //this.clientAdapter.onMessagesChanged(function (message) {
        //    console.log(message);
            //_this.clientAdapter.triggerMessagesChanged(message);
        //});
    }

    KonstruktorServerAdapter.prototype.sendTypingSignal = function (roomId, conversationId, userToId, done) {
        //console.log("DemoServerAdapter: sendTypingSignal");
    };
    KonstruktorServerAdapter.prototype.sendMessage = function(roomId, userId){

    }
    KonstruktorServerAdapter.prototype.sendMessage = function (roomId, conversationId, otherUserId, messageText, clientGuid, done,type) {
        var _this = this;
        //console.log("DemoServerAdapter: sendMessage");
        if(roomId == 'undefined'){
            otherUser = this.getUserById(otherUserId);
            roomId = otherUser.RoomId;
        }
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
            bounceMessage.ClientGuid = clientGuid;
            _this.clientAdapter.triggerMessagesChanged(bounceMessage);
        });

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
              bounceMessage.ConversationId = conversationId;
              bounceMessage.Message = data[i].Media;
              bounceMessage.ClientGuid = clientGuid;

              _this.clientAdapter.triggerMessagesChanged(bounceMessage);
            }

        });

    };
    // gets the message history from a room, conversation or user
    KonstruktorServerAdapter.prototype.getMessageHistory = function (roomId, conversationId, otherUserId, group_id,message_count, done) {
      var _this = this;
        //  console.log("DemoServerAdapter: getMessageHistory");

        var chatMessages = new Array();
        markRead = new Array();
        $.ajax({
            url: '/ChatAjax/getRoomHistory.json',
            method: 'POST',
            async: true,
            data: { user_id: otherUserId, group_id: group_id, message_count: message_count },

        }).done(function(response){

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
                      to_id = data.ChatEvent.id;
                  } else if(data.ChatEvent.event_type == 6){
                      from_id = data.ChatEvent.user_id;
                      to_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                  }
                  chatMessage.Type = 'file';
                  chatMessage.msgId = message_id;
                  chatMessage.Message = data.File;
                }else{
                  if(data.ChatEvent.event_type == 1){
                      to_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                      from_id = data.ChatEvent.user_id;
                  } else if(data.ChatEvent.event_type == 2){
                      to_id = data.ChatEvent.user_id;
                      from_id = KonstruktorAdapterOptions.CURRENT_USER_ID;
                  }
                  message_id = data.ChatMessage.id;
                  chatMessage.msgId = message_id;
                  chatMessage.Type = 'msg';
                  chatMessage.Message = _this.decodeHTMLEntities(data.ChatMessage.message);
                }
                markRead[i] = parseInt(message_id);
                chatMessage.UserFromId = from_id;
                chatMessage.UserToId = to_id;
                chatMessages.push(chatMessage);
            }
            done(chatMessages);
        });

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


    };

    KonstruktorServerAdapter.prototype.getUserList = function (roomId, conversationId, done) {
        //console.log("KonstruktorServerAdapter: getUserList");
        //if (roomId == DemoAdapterConstants.DEFAULT_ROOM_ID) {
            done(this.users);
            return;
        //}
        //throw "The given room or conversation is not supported by the demo adapter";
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

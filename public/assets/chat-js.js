/// <reference path="../../Scripts/Typings/jquery/jquery.d.ts"/>
var ChatJsUtils = (function () {
    function ChatJsUtils() {
    }
    ChatJsUtils.setOuterHeight = function (jQuery, height) {
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
    };

    ChatJsUtils.setOuterWidth = function (jQuery, width) {
        var widths = new Array();
        widths.push(parseInt(jQuery.css("padding-left").replace("px", "")));
        widths.push(parseInt(jQuery.css("padding-right").replace("px", "")));
        widths.push(parseInt(jQuery.css("border-top-left").replace("px", "")));
        widths.push(parseInt(jQuery.css("border-bottom-right").replace("px", "")));
        widths.push(parseInt(jQuery.css("margin-left").replace("px", "")));
        widths.push(parseInt(jQuery.css("margin-right").replace("px", "")));
        var calculatedWidth = width;
        for (var i = 0; i < widths.length; i++)
            calculatedWidth -= widths[i];
        jQuery.width(calculatedWidth);
    };
    return ChatJsUtils;
})();
//# sourceMappingURL=jquery.chatjs.utils.js.map

﻿var ChatMessageInfo = (function () {
    function ChatMessageInfo() {
    }
    return ChatMessageInfo;
})();

var UserStatusType;
(function (UserStatusType) {
    UserStatusType[UserStatusType["Offline"] = 0] = "Offline";
    UserStatusType[UserStatusType["Online"] = 1] = "Online";
})(UserStatusType || (UserStatusType = {}));

/// <summary>
/// Information about a chat user
/// </summary>
var ChatUserInfo = (function () {
    /// User chat status. For now, it only supports online and offline
    function ChatUserInfo() {
    }
    return ChatUserInfo;
})();

var ChatRoomInfo = (function () {
    function ChatRoomInfo() {
    }
    return ChatRoomInfo;
})();

var ChatTypingSignalInfo = (function () {
    function ChatTypingSignalInfo() {
    }
    return ChatTypingSignalInfo;
})();

var ChatUserListChangedInfo = (function () {
    function ChatUserListChangedInfo() {
    }
    return ChatUserListChangedInfo;
})();

var ChatRoomListChangedInfo = (function () {
    function ChatRoomListChangedInfo() {
    }
    return ChatRoomListChangedInfo;
})();
//# sourceMappingURL=jquery.chatjs.adapter.servertypes.js.map

﻿/// <reference path="jquery.chatjs.adapter.servertypes.ts"/>


//# sourceMappingURL=jquery.chatjs.adapter.js.map

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

/// <reference path="../../Scripts/Typings/jquery/jquery.d.ts"/>
/// <reference path="jquery.chatjs.interfaces.ts"/>

var ChatWindowOptions = (function () {
    function ChatWindowOptions() {
    }
    return ChatWindowOptions;
})();

// a generic window that shows in the bottom right corner. It can have any content in it.
var ChatWindow = (function () {
	
    function ChatWindow(options) {
        var _this = this;
        var defaultOptions = new ChatWindowOptions();
        defaultOptions.isMaximized = true;
        defaultOptions.chatpositioncookie = 'chatjsposition';
        //defaultOptions.chatposition = "chatjs";
        defaultOptions.canClose = true;
        defaultOptions.position = new Object();
        defaultOptions.onCreated = function () {
        };
        defaultOptions.onClose = function () {
        };
        defaultOptions.onMaximizedStateChanged = function () {
        };
        this.options = $.extend({}, defaultOptions, options);

        // window
	    if(this.options.userId) {
		    this.$window = $("<div/>").addClass("chat-window").appendTo($("body"));
		    this.$window.addClass("chat-window--dialog");

		    this.$window.css({
			    'position': 'fixed',
			    'bottom': '20px',
			    'right': '50px'
		    });
	    } else {
		    this.$window = $("<div/>").addClass("chat-window").appendTo($("#chat-holder"));
	    }

        if (this.options.width) {
	        this.$window.css("width", this.options.width);
        }

        // title
        this.$windowTitle = $("<div/>").addClass("chat-window-title").appendTo(this.$window);
        var goToAll = $("<div/>").addClass('go-to-all').appendTo(this.windowTitle);
        goToAll.html('<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>');

        if (this.options.canClose) {
            var $closeButton = $("<div/>").addClass("close").appendTo(this.$windowTitle);
            $closeButton.click(function (e) {
                _this.remove();
            });
        }

        var $goButton = $("<div/>").addClass("go-to-chat").appendTo(this.$windowTitle);
        $goButton.click(function(e){
            window.location.href= '/Chat/room/'+_this.options.roomId;
        });

		//Earphone
		$("<div/>").addClass("chat-call").html('<span class="glyphicons earphone"></span>').appendTo(this.$windowTitle);

        $("<div/>").addClass("text").html( this.options.title ).appendTo(this.$windowTitle);

        // content
        this.$windowContent = $("<div/>").addClass("chat-window-content").appendTo(this.$window);

        this.$windowInnerContent = $("<div/>").addClass("chat-window-inner-content").appendTo(this.$windowContent);

        this.$window.draggable({
            handle: $('div.chat-window-title'),
            containment:'.wrapper-container',
            scroll:false,
            start: function(event, ui) {
              _this.$window.css("bottom",'initial');
            },
            stop: function( event, ui ) {
                _this.options.position = ui.position;

                var states  = ChatController.prototype.readCookie(_this.options.chatpositioncookie);
                $.each(states.pmWindows, function(index, pmWindow){
                    if(pmWindow.otherUserId == _this.options.userId){
                        states.pmWindows[index].position = _this.options.position;
                    }
                });
                ChatController.prototype.createCookie(_this.options.chatpositioncookie, states);
            }
        });

        var states  = ChatController.prototype.readCookie(this.options.chatpositioncookie);
        var coockieposition = '';
        if(states){
            $.each(states.pmWindows, function(index, pmWindow){
                if(pmWindow.otherUserId == _this.options.userId){
                    coockieposition = pmWindow.position;
                    return;
                }
            });
            if(coockieposition.left && (coockieposition.left < $(window).width() && coockieposition.left > 0)){
                this.$window.css("left", coockieposition.left);
            }
            if(coockieposition.top && (coockieposition.top < $(window).height() && coockieposition.top > 0)){
                this.$window.css("top", coockieposition.top);
                this.$window.css("bottom", 'initial');
            }
        }
        this.options.onCreated(this);
    }

    ChatWindow.prototype.getPosition = function() {
        var states  = ChatController.prototype.readCookie(this.options.chatpositioncookie);
        $.each(states.pmWindows, function(index, pmWindow){
            if(pmWindow.otherUserId == _this.options.userId){
                return pmWindow.position;
            }
        });
        return ;
    };

    ChatWindow.prototype.remove = function () {
        // removes the window
        this.$window.remove();
        // triggers the event
        this.options.onClose(this);
    };

    ChatWindow.prototype.getWidth = function () {
        return this.$window.outerWidth();
    };

    ChatWindow.prototype.setRightOffset = function (offset) {
        // this.$window.css("right", offset);
    };

    ChatWindow.prototype.setTitle = function (title) {
        $("div[class=text]", this.$windowTitle).text(title);
    };

    ChatWindow.prototype.setVisible = function (visible) {
        if (visible)
            this.$window.show();
        else
            this.$window.hide();
    };

    // returns whether the window is maximized
    ChatWindow.prototype.getState = function () {
        return !this.$window.hasClass("minimized");
    };

    ChatWindow.prototype.setState = function (state, triggerMaximizedStateEvent) {
        // windows are maximized if the this.$windowContent is visible
        if (typeof triggerMaximizedStateEvent === "undefined") {
	        triggerMaximizedStateEvent = true;
        }

        if (state) {
	        console.log('show');
            // if it can't expand and is maximized
            this.$window.removeClass("minimized");
            this.$windowContent.show();
        } else {
	        console.log('hide');
            // if it can't expand and is minimized
            this.$window.addClass("minimized");
            this.$windowContent.hide();
        }

        if (triggerMaximizedStateEvent) {
	        this.options.onMaximizedStateChanged(this, state);
        }
    };

    ChatWindow.prototype.toggleMaximizedState = function () {
        this.setState(this.$window.hasClass("minimized"));
    };

    ChatWindow.prototype.focus = function () {
        //todo: Implement
    };
    return ChatWindow;
})();

// The actual plugin
$.chatWindow = function (options) {
    var chatWindow = new ChatWindow(options);
    return chatWindow;
};

$(function() {
    if (navigator.userAgent.match(/iPad/i) != null) {
        setInterval(function(){
            if (! $(".chat-window.chat-window--dialog").hasClass("big"))
            {
                $(".chat-window.chat-window--dialog").addClass('big');
            }
        },500);
    }
});
//# sourceMappingURL=jquery.chatjs.window.js.map

var MessageBoardOptions = (function() {
	function MessageBoardOptions() {}
	return MessageBoardOptions;
})();

$(function() {
	var $pswp = $('.pswp')[0];
	$('body').on('click', '.chat-text-wrapper p.image-file a', function(event) {
		event.preventDefault();

		if (!$(this).children('img').length) {
			window.open($(this).attr('href'), '_blank');
			return;
		}
		var img = $(this).children('img');
		var image_list = [];
		$size = img.data('size').split('x'), $width = $size[0], $height = $size[1];
		var src = img.data('url');
		var item = {
			src: src,
			w: $width,
			h: $height
		};
		image_list.push(item);
		var options = {
			index: 0,
			bgOpacity: 0.7,
			showHideOpacity: true,
			shareEl: false
		};
		var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, image_list, options);
		lightBox.init();
		$('#header, #chatLink, .planet, .logo').hide();
		lightBox.listen('close', function() {
			$('#header, #chatLink, .planet, .logo').show();
		});
	});
});

$(document).on('click', '.chat-window .smileSelect', function() {
	id = $(this).parent().parent().parent().attr('id');
	text = $("#" + id).parent().parent().children('textarea').val().length > 0 ? ' ' + $(this).text() : '' + $(this).text();
	$("#" + id).parent().parent().children('textarea').val($("#" + id).parent().parent().children('textarea').val() + text);
	if ((/iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || (navigator.userAgent.indexOf("Safari") > -1)) {
		$(this).parent().parent().parent().popover('hide');
	}
});

$('html').on('mouseup', function(e) {
	if (!$(e.target).closest('.popover').length) {
		$('.popover').each(function() {
			$(this.previousSibling).popover('hide');
		});
	}
});

var MessageBoard = (function() {
	function MessageBoard(jQuery, options) {
		var _this = this;
		this.$el = jQuery;
		var defaultOptions = new MessageBoardOptions();
		defaultOptions.typingText = " is typing...";
		defaultOptions.playSound = true;
		defaultOptions.height = 100;
		defaultOptions.chatJsContentPath = "/chatjs/";
		defaultOptions.newMessage = function(message) {};
		defaultOptions.onCreated = function () {
        };
		defaultOptions.onClose = function () {
        };
		this.thisScroll = null;
		this.options = $.extend({}, defaultOptions, options);
		this.$el.addClass("message-board");
		ChatJsUtils.setOuterHeight(this.$el, 'auto');
		this.$messagesWrappers = $("<div/>").addClass("messages-wrapper scroller-id-" + this.options.otherUserId).appendTo(this.$el);
		this.$messagesWrapper = $("<div/>").addClass("messages-wrappers").attr('id', 'scroller').appendTo(this.$messagesWrappers);
		var $windowTextBoxWrapper = $("<div/>").addClass("chat-window-text-box-wrapper").appendTo(this.$el);
        var yourComment = $('#minichat-your-comment').html();
		this.$textBox = $("<textarea />", {placeholder: yourComment}).attr("rows", "1").addClass("chat-window-text-box").appendTo($windowTextBoxWrapper);
		var smile = $("<div />").addClass("smiley-button icon_enter").appendTo($windowTextBoxWrapper);
		smile.html('<span class="smile smile-' + this.options.otherUserId + '">(•‿•)</span>');
		var file = $("<div />").addClass("file-button").appendTo($windowTextBoxWrapper);
		file.html('<span class="chat-jq-file" id="chatFileChooseFromCloud_' + this.options.otherUserId +'"><div class="jq-file__browse"><span class="paperclip"></span></div></span>');
		var loadfile = $("<div />").addClass("chatUploadFiles-box").appendTo($windowTextBoxWrapper);
		loadfile.html('<span id="chatUploadFiles-' + this.options.otherUserId + '"></span>');

        if ((/iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
            var messagesHeight = _this.options.height - $(this.$textBox).outerHeight();
            ChatJsUtils.setOuterHeight(_this.$messagesWrappers, messagesHeight);
        } else {
            $(this.$textBox).css({'padding-top': '5px'});
            this.$textBox.autosize({
            	callback: function(ta) {
            		var messagesHeight = _this.options.height - $(ta).outerHeight();
            		ChatJsUtils.setOuterHeight(_this.$messagesWrappers, messagesHeight);
            	}
            });
            $(this.$textBox).css({'padding-top': '15px'});
        }




		_this.thisScroll = new IScroll('.scroller-id-' + _this.options.otherUserId, {
			mouseWheel: true,
			scrollbars: true,
			preventDefaultException: { tagName:/.*/ }
		});
		$('.smile-' + this.options.otherUserId).popover({
			html: true,
			placement: 'top',
			class: 'smilesPopover',
			trigger: 'click',
			content: function() {
				return $('#popover_content_wrapper').html();
			}
		});
		_this.thisScroll.on('scrollEnd',function(){

			if(this.y == 0){
				if($(_this.$messagesWrapper[0]).children('#chat-load-bar').length == 0){
					var loadBar = '<span id="chat-load-bar" class="ajax-loader" style="display: block;text-align: center;"><img src="../img/ajax_loader.gif" alt="" style="width: 20px; height: 20px;">' + $("#lodaing-text-minichat").html() + '</span>';
	                $(loadBar).prependTo(_this.$messagesWrapper[0]);
				}

				var cur_chat_messages = $(_this.$messagesWrapper[0]).children('.chat-message').length;
				_this.options.adapter.server.getMessageHistory(_this.options.roomId, _this.options.conversationId, _this.options.otherUserId, _this.options.group_id,cur_chat_messages, function(messages) {
					var oldScroll = _this.$messagesWrapper[0].scrollHeight;

					for (var i = 0; i < messages.length; i++) {
						_this.addMessageToTop(messages[i], null, false,_this);
					}
					//var loadBar = '<span id="chat-load-bar" class="ajax-loader" style="display: block;"><img src="../img/ajax_loader.gif" alt="" style="width: 20px; height: 20px;"> Загрузка...</span>';
	                $('#chat-load-bar').remove();
					var newScroll = _this.$messagesWrapper[0].scrollHeight;

					var scr = newScroll - oldScroll;

					if (_this.thisScroll != null && (newScroll != oldScroll)) {
						_this.thisScroll.scrollTo(0, -(scr+20), 0);
					}

					_this.thisScroll.refresh();

				});
			}
		});
		var fileCount = {};
		file.find('#chatFileChooseFromCloud_' + this.options.otherUserId).off('click');
		file.find('#chatFileChooseFromCloud_' + this.options.otherUserId).on('click',function(){
			$.magnificPopup.open({
				items: {
					src: '#popup-cloudChat',
					type: 'inline'
				},
				closeMarkup: '<button class="closeImg mfp-close" style="position:absolute;top:0px;right:-5px"><img class="closeImg mfp-close" src="/img/icons/007__close.png"/></button>'
			});
		});
		var fileInsertId = 1;
		var otherUserId = this.options.otherUserId;
		var roomID = _this.options.roomId;
		$('#popup-cloudChat .cloud-add-btn').off('click');
		$('#popup-cloudChat .cloud-add-btn').on('click',function(){
			var selElem = document.getElementById('cloudFrame').contentWindow.document.querySelector('#cloud-list .cloud-list_item.cloud-list_item-selected');
			if(selElem){
				var cloud_id = selElem.getAttribute('data-id');
				var src = selElem.getAttribute('data-media');
				var ext = selElem.getAttribute('data-ext');
				var html = '<div class="preloadArea preloadThumb" data-room="'+ roomID +'" data-cloud="' + cloud_id + '" id="chat-file_'+fileInsertId+'">' +
						   '	<div style="width: 84px; height: 84px; background: #eee" class="tempImg">'+
						   '		<span class="cloud-list_item-preview filetype '+ext+'" height="40" style="width: auto; max-height: 40px;"></span></div>' +
						   '		<a onclick="$(\'#chat-file_' + fileInsertId + '\').remove()" class="glyphicons circle_remove remove-chat-file" href="javascript: void(0)"></a>' +
						   '		<a style="display: none;" class="glyphicons circle_remove abortload-chat-file" href="javascript: void(0)"></a>' +
						   '		<div style="display: none;" class="progress">' +
						   '			<div class="progress-bar progress-bar-info" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
						   '		</div>' +
						   '</div>';
				fileInsertId++;
				$('#chatUploadFiles-' + otherUserId).append(html);
				$.magnificPopup.close();
			}else{
				alert('Select file!!!');
			}
		});

		this.$textBox.val(this.$textBox.val());
		this.options.adapter.client.onTypingSignalReceived(function(typingSignal) {
			var shouldProcessTypingSignal = false;
			if (_this.options.otherUserId) {
				shouldProcessTypingSignal = typingSignal.UserToId == _this.options.userId && typingSignal.UserFrom.Id == _this.options.otherUserId;
			} else if (_this.options.roomId) {
				shouldProcessTypingSignal = typingSignal.RoomId == _this.options.roomId && typingSignal.UserFrom.Id != _this.options.userId;
			} else if (_this.options.conversationId) {
				shouldProcessTypingSignal = typingSignal.ConversationId == _this.options.conversationId && typingSignal.UserFrom.Id != _this.options.userId;
			}
			if (shouldProcessTypingSignal)
				_this.showTypingSignal(typingSignal.UserFrom);
		});
		this.options.adapter.client.onMessagesChanged(function(message) {
			var shouldProcessMessage = false;
			//if (_this.options.otherUserId) {
			//	shouldProcessMessage = (message.UserFromId == _this.options.userId && message.UserToId == //_this.options.otherUserId) || (message.UserFromId == _this.options.otherUserId && message.UserToId == //_this.options.userId);
			//} else
			if (_this.options.roomId) {
				shouldProcessMessage = message.RoomId == _this.options.roomId;
			} else if (_this.options.conversationId) {
				shouldProcessMessage = message.ConversationId == _this.options.conversationId;
			}
			if($('#message-number-' + message.msgId).length ||(message.active == 0)){
				shouldProcessMessage = false;
			}
			if (shouldProcessMessage) {
				_this.addMessage(message, null, true,_this);
				_this.thisScroll.refresh();
				if (message.UserFromId != _this.options.userId) {
					if (_this.options.playSound){
						_this.playSound();
					}
				}
				_this.options.newMessage(message);
			}
		});
		this.options.adapter.server.getMessageHistory(this.options.roomId, this.options.conversationId, this.options.otherUserId, this.options.group_id,0, function(messages) {
			for (var i = 0; i < messages.length; i++) {
				_this.addMessage(messages[i], null, false,_this);
			}
			_this.adjustScroll();
			_this.thisScroll.refresh();
			_this.$textBox.keypress(function(e) {
				if (_this.sendTypingSignalTimeout == undefined) {
					_this.sendTypingSignalTimeout = setTimeout(function() {
						_this.sendTypingSignalTimeout = undefined;
					}, 3000);
					_this.sendTypingSignal();
				}
				if (e.which == 10) {
					var value = _this.$textBox.val();
					_this.$textBox.val(value + '\n');
				}
				if (e.which == 13) {
					e.preventDefault();
					var message = _this.$textBox.val();
					var clouds = [];
					var i = 0;
					var room_id = _this.options.roomId;
					if (_this.$textBox.val()) {
						_this.sendMessage(_this.$textBox.val());
						_this.$textBox.val('').trigger("autosize.resize");
					}
					$('#chatUploadFiles-' + _this.options.otherUserId + ' .preloadArea').each(function() {

						var cloud_id = $(this).attr('data-cloud');
						clouds[i] = cloud_id;
						i++;
						$.ajax({
							type: "POST",
							url: "/ChatAjax/cloneFromCloud",
							dataType: "JSON",
							data: {cloud_id: cloud_id, roomID: _this.options.roomId},
							success: function(response) {
								$('#chatUploadFiles-' + _this.options.otherUserId).empty();
							},
							error: function() {}
						});

					});
					$.post("/ChatAjax/addEvent.json",{
							clouds:clouds,
							roomID: room_id,
							message:message
						}
					);
				}
			});
		});
	}
	/*
	//Deprecated and not nneded anymore
	MessageBoard.prototype.markReadSend = function(chat_room_id) {
		var totalCount = 0;
		$.post('/ChatAjax/updateState.json', null, function(response) {
			markRead = new Array();
			for (i = 0; i < response.data.events.length; i++) {
				newEvent = response.data.events[i];
				if(newEvent.ChatEvent.room_id == chat_room_id){
					markRead.push(newEvent.ChatEvent.id);
					$('#message-user-count-' + newEvent.userId).remove();
				}
			}
			var data = response.data;
			if (markRead.length > 0) {
				if(highWay.isOpen()){
		            highWay.call('transport.post', [
		                '/mini-chat/rooms/mark-read/'+KonstruktorAdapterOptions.CURRENT_USER_ID+'.json',
		                { ids: markRead }
		            ]);
				} else {
					$.ajax({
						url: '/ChatAjax/markRead.json',
						method: 'POST',
						async: true,
						data: {
							ids: markRead
						},
					});
				}

				co = parseInt($('#chatTotalUnread').html());
				if (data.aUsers && data.aUsers.aUsers.length) {
					for (var i = 0; i < data.aUsers.aUsers.length; i++) {
						user = data.aUsers.aUsers[i];
						if (user.ChatContact) {
							count = parseInt(user.ChatContact.active_count);
							totalCount += count;
						}
					}
				}
				count = co - totalCount;
				if (count > 10) {
					count = '10+';
				} else if (!count) {
					count = '';
				}
				$('#chatTotalUnread').html(count);
			}
		}, 'json');
	}
	*/
	MessageBoard.prototype.chatImageInit = function(id, data) {
		var _this = this;
		var oFReader = new FileReader();
		oFReader.readAsDataURL(data.files[0]);
		oFReader.onload = function(oFREvent) {
			$('#chatUploadFiles-' + _this.options.otherUserId + ' #' + id + ' .tempImg').prepend('<img src="/img/fancybox/blank.gif" height=40 alt="" />');
			var img = $('#chatUploadFiles-' + _this.options.otherUserId + ' #' + id + ' .tempImg img').get(0);
			$(img).prop('src', oFREvent.target.result);
			var count = 0;
			var timer = setInterval(function() {
				var iW = img.width,
					iH = img.height;
				if (count > 50) {
					alert('Your photo is too large. Please upload another one');
				}
				if (iW < 5) {
					count++;
					return;
				}
				clearInterval(timer);
				var imageLeftOffset = -(84 * iW / iH - 84) / 2;
				var imageTopOffset = -(84 * iH / iW - 84) / 2;
				$(img).css('width', 'auto');
				$(img).css('max-height', '40px');
				$(img).data(data);
			}, 100);
		}
	}
	MessageBoard.prototype.addImageToMessage = function(files_data) {
		var generateGuidPart = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		var clientGuid = (generateGuidPart() + generateGuidPart() + '-' + generateGuidPart() + '-' + generateGuidPart() + '-' + generateGuidPart() + '-' + generateGuidPart() + generateGuidPart() + generateGuidPart());
		this.options.adapter.server.sendFiles(this.options.roomId, this.options.conversationId, this.options.otherUserId, files_data, clientGuid, function() {});
		$('#chatUploadFiles-' + this.options.otherUserId).html('');
	}
	MessageBoard.prototype.showTypingSignal = function(user) {
		var _this = this;
		if (this.$typingSignal)
			this.$typingSignal.remove();
		this.$typingSignal = $("<p/>").addClass("typing-signal").text(user.Name + this.options.typingText);
		this.$messagesWrapper.append(this.$typingSignal);
		if (this.typingSignalTimeout)
			clearTimeout(this.typingSignalTimeout);
		this.typingSignalTimeout = setTimeout(function() {
			_this.removeTypingSignal();
		}, 5000);
		this.adjustScroll();
	};
	MessageBoard.prototype.removeTypingSignal = function() {
		if (this.$typingSignal)
			this.$typingSignal.remove();
		if (this.typingSignalTimeout)
			clearTimeout(this.typingSignalTimeout);
	};
	MessageBoard.prototype.adjustScroll = function() {

		this.$messagesWrapper[0].scrollTop = this.$messagesWrapper[0].scrollHeight;
		if (this.thisScroll != null) {
			this.thisScroll.scrollTo(0, -(this.$messagesWrapper[0].scrollHeight - 201), 0);
		}
	};
	MessageBoard.prototype.sendTypingSignal = function() {
		this.options.adapter.server.sendTypingSignal(this.options.roomId, this.options.conversationId, this.options.otherUserId, function() {});
	};
	MessageBoard.prototype.sendMessage = function(messageText) {
		var generateGuidPart = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		var clientGuid = (generateGuidPart() + generateGuidPart() + '-' + generateGuidPart() + '-' + generateGuidPart() + '-' + generateGuidPart() + '-' + generateGuidPart() + generateGuidPart() + generateGuidPart());
		var message = new ChatMessageInfo();
		message.UserFromId = this.options.userId;
		message.roomId = this.options.roomId;
		message.Message = messageText;
		this.options.adapter.server.sendMessage(this.options.roomId, this.options.conversationId, this.options.otherUserId, messageText, clientGuid, function() {});
	};
	MessageBoard.prototype.playSound = function() {
		var $soundContainer = $("#soundContainer");
		if (!$soundContainer.length)
			$soundContainer = $("<div>").attr("id", "soundContainer").appendTo($("body"));
		var baseFileName = "/" + this.options.chatJsContentPath + "sounds/chat";
		var oggFileName = baseFileName + ".ogg";
		var mp3FileName = baseFileName + ".mp3";
		var $audioTag = $("<audio/>").attr("autoplay", "autoplay");
		$("<source/>").attr("src", oggFileName).attr("type", "audio/ogg").appendTo($audioTag);
		$("<source/>").attr("src", mp3FileName).attr("type", "audio/mpeg").appendTo($audioTag);
		$("<embed/>").attr("src", mp3FileName).attr("autostart", "true").attr("loop", "false").appendTo($audioTag);
		$audioTag.appendTo($soundContainer);
	};
	MessageBoard.prototype.focus = function() {
		this.$textBox.focus();
	};
	MessageBoard.prototype.addMessage = function(message, clientGuid, scroll, thisis) {

		_this = thisis;
		if ((message.msgId != 'undefined') && (!$('#message-number-' + message.msgId).length)) {
			$('#message-user-count-' + message.userId).remove();
			$('#roomUnread_' + message.RoomId).html('');
			if (scroll == undefined)
				scroll = true;
			//_this.markReadSend(message.RoomId);
			var msg_created = '';
			currentDate = date = moment.utc().local();
			if (message.Created !== undefined) {
				date = moment.utc(message.Created).local();
			}
			msg_created = date.format('DD.MM.YY');
			if(currentDate.format('DD.MM.YY') == msg_created){
				msg_created = date.format('HH:mm:ss');
			}
			if (message.Type == 'file') {
				if (message.UserFromId != _this.options.userId) {
					_this.removeTypingSignal();
				}
				if (message.ClientGuid && $("p[data-val-client-guid='" + message.ClientGuid + "']").length) {
					$("p[data-val-client-guid='" + message.ClientGuid + "']").removeClass("temp-message").removeAttr("data-val-client-guid");
				} else {
					var fileData = message.Message;
					if (typeof(fileData.media_type) != 'undefined'){
						if (fileData.media_type == 'image') {
							var sizew = fileData.orig_w / fileData.orig_h;
							var dimensions = fileData.orig_w + 'x' + fileData.orig_h;
							if (sizew < 3) {
								var $messageP = $("<p/>").addClass('image-file').html('<a href="/File/preview/' + fileData.id + '" style="height:80px;" target="_blank"><img id="chat-image-little-id-' + fileData.id + '" src="' + fileData.url_img.replace(/noresize/, '200x') + '" data-url="' + fileData.url_download + '" data-size="' + dimensions + '" /></a>');
							} else {
								var $messageP = $("<p/>").addClass('image-file').html('<a href="/File/preview/' + fileData.id + '" target="_blank">' + fileData.orig_fname + '</a>');
							}
						} else if (fileData.media_type == 'video') {
							var $messageP = $("<p/>").addClass('image-file').html('<span data-url-down="'+fileData.url_download + '" class="video-pop-this chat-video-link" data-converted="' + fileData.converted + '">' + fileData.orig_fname + '</span>');
						} else {
							action = 'preview';
							if ((/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
								action = 'download';
							}
							var $messageP = $("<p/>").addClass('image-file').html('<a href="/File/'+action+'/' + fileData.id + '" target="_blank">' + fileData.orig_fname + '</a>');
						}
					}
					var $lastMessage = $("div.chat-message:last", _this.$messagesWrapper);
					//if (_this.options.userId == message.UserFromId) {
					console.log(message.direction);
					if (message.direction == 'out') {
						var $chatMessage = $("<div/>").addClass("chat-message chat-message-self").css('overflow', 'hidden').attr("data-val-user-from", message.UserFromId);
						$chatMessage.appendTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					} else {
						var $chatMessage = $("<div/>").addClass("chat-message").attr("data-val-user-from", message.UserFromId).css('overflow', 'hidden');
						$chatMessage.appendTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					}
				}
			} else {
				if (message.UserFromId != _this.options.userId) {
					_this.removeTypingSignal();
				}

				function linkify($element) {
					$element.addClass('link-block');
					var inputText = $element.html();
					var replacedText, replacePattern1, replacePattern2, replacePattern3;
					replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
					replacedText = inputText.replace(replacePattern1, '<div class="link"><a href="$1"  target="_blank"><span>$1</span></a></div>');
					replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
					replacedText = replacedText.replace(replacePattern2, '<div class="link">$1<a href="http://$2" target="_blank">$2</a></div>');
					replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
					replacedText = replacedText.replace(replacePattern3, '<div class="link"><a href="mailto:$1">$1</a></div>');
					return $element.html(replacedText);
				}
				if (message.ClientGuid && $("p[data-val-client-guid='" + message.ClientGuid + "']").length) {
					$("p[data-val-client-guid='" + message.ClientGuid + "']").removeClass("temp-message").removeAttr("data-val-client-guid");
				} else {
					var $messageP = $("<p/>").text(message.Message);
					if (clientGuid)
						$messageP.attr("data-val-client-guid", clientGuid).addClass("temp-message");
					linkify($messageP);
					$replText = $messageP.html().replace(/\n/g, "<br />");
					$messageP.html($replText);

					var $lastMessage = $("div.chat-message:last", _this.$messagesWrapper);
					//if (_this.options.userId == message.UserFromId) {
					if (message.direction == 'out') {
						var $chatMessage = $("<div/>").addClass("chat-message chat-message-self").css('overflow', 'hidden').attr("data-val-user-from", message.UserFromId);
						$chatMessage.appendTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					} else {
						var $chatMessage = $("<div/>").addClass("chat-message").css('overflow', 'hidden').attr("data-val-user-from", message.UserFromId);
						$chatMessage.appendTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					}
				}
			}
			if (scroll)
				_this.adjustScroll();
		}
	};
	MessageBoard.prototype.addMessageToTop = function(message, clientGuid, scroll,thisis) {

		_this = thisis;
		if ((message.msgId != 'undefined') && (!$('#message-number-' + message.msgId).length)) {
			$('#message-user-count-' + message.userId).remove();
			$('#roomUnread_' + message.RoomId).html('');
			if (scroll == undefined)
				scroll = true;
			//_this.markReadSend(message.RoomId);

			var msg_created = '';
			currentDate = date = moment.utc().local();
			if (message.Created !== undefined) {
				date = moment.utc(message.Created).local();
			}
			msg_created = date.format('DD.MM.YY');
			if(currentDate.format('DD.MM.YY') == msg_created){
				msg_created = date.format('HH:mm:ss');
			}
			if (message.Type == 'file') {
				if (message.UserFromId != _this.options.userId) {
					_this.removeTypingSignal();
				}
				if (message.ClientGuid && $("p[data-val-client-guid='" + message.ClientGuid + "']").length) {
					$("p[data-val-client-guid='" + message.ClientGuid + "']").removeClass("temp-message").removeAttr("data-val-client-guid");
				} else {
					var fileData = message.Message;
					if (typeof(fileData.media_type) != 'undefined')
						if (fileData.media_type == 'image') {
							var sizew = fileData.orig_w / fileData.orig_h;
							var dimensions = fileData.orig_w + 'x' + fileData.orig_h;
							if (sizew < 3) {
								var $messageP = $("<p/>").addClass('image-file').html('<a href="/File/preview/' + fileData.id + '" style="height:80px;" target="_blank"><img id="chat-image-little-id-' + fileData.id + '" src="' + fileData.url_img.replace(/noresize/, '200x') + '" data-url="' + fileData.url_download + '" data-size="' + dimensions + '" /></a>');
							} else {
								var $messageP = $("<p/>").addClass('image-file').html('<a href="/File/preview/' + fileData.id + '" target="_blank">' + fileData.orig_fname + '</a>');
							}
						} else {
							var $messageP = $("<p/>").addClass('image-file').html('<a href="/File/preview/' + fileData.id + '" target="_blank">' + fileData.orig_fname + '</a>');
						}
					var $lastMessage = $("div.chat-message:last", _this.$messagesWrapper);
					//if (_this.options.userId == message.UserFromId) {
					if (message.direction == 'out') {
						var $chatMessage = $("<div/>").addClass("chat-message chat-message-self").css('overflow', 'hidden').attr("data-val-user-from", message.UserFromId);
						$chatMessage.prependTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					} else {
						var $chatMessage = $("<div/>").addClass("chat-message").attr("data-val-user-from", message.UserFromId).css('overflow', 'hidden');
						$chatMessage.prependTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					}
				}
			} else {
				if (message.UserFromId != _this.options.userId) {
					_this.removeTypingSignal();
				}

				function linkify($element) {
					$element.addClass('link-block');
					var inputText = $element.html();
					var replacedText, replacePattern1, replacePattern2, replacePattern3;
					replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
					replacedText = inputText.replace(replacePattern1, '<div class="link"><a href="$1"  target="_blank"><span>$1</span></a></div>');
					replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
					replacedText = replacedText.replace(replacePattern2, '<div class="link">$1<a href="http://$2" target="_blank">$2</a></div>');
					replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
					replacedText = replacedText.replace(replacePattern3, '<div class="link"><a href="mailto:$1">$1</a></div>');
					return $element.html(replacedText);
				}
				if (message.ClientGuid && $("p[data-val-client-guid='" + message.ClientGuid + "']").length) {
					$("p[data-val-client-guid='" + message.ClientGuid + "']").removeClass("temp-message").removeAttr("data-val-client-guid");
				} else {
					var $messageP = $("<p/>").text(message.Message);
					if (clientGuid)
						$messageP.attr("data-val-client-guid", clientGuid).addClass("temp-message");
					linkify($messageP);
					$replText = $messageP.html().replace(/\n/g, "<br />");
					$messageP.html($replText);
					var $lastMessage = $("div.chat-message:last", _this.$messagesWrapper);
					//if (_this.options.userId == message.UserFromId) {
					if (message.direction == 'out') {
						var $chatMessage = $("<div/>").addClass("chat-message chat-message-self").css('overflow', 'hidden').attr("data-val-user-from", message.UserFromId);
						$chatMessage.prependTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					} else {
						var $chatMessage = $("<div/>").addClass("chat-message").css('overflow', 'hidden').attr("data-val-user-from", message.UserFromId);
						$chatMessage.prependTo(_this.$messagesWrapper);
						var $gravatarWrapper = $("<div/>").addClass("chat-gravatar-wrapper").appendTo($chatMessage);
						var $textWrapper = $("<div/>").addClass("chat-text-wrapper").attr('id', 'message-number-' + message.msgId).appendTo($chatMessage);
						$('<div />').addClass('msg-date').text(msg_created).appendTo($textWrapper);
						$messageP.appendTo($textWrapper);
					}
				}
			}

			//if (scroll)
			//	_this.adjustScroll();
		}
	};
	return MessageBoard;
})();
$.fn.messageBoard = function(options) {
	if (this.length) {
		this.each(function() {
			var data = new MessageBoard($(this), options);
			$(this).data('messageBoard', data);
		});
	}
	return this;
};

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

/// <reference path="../../Scripts/Typings/jquery/jquery.d.ts"/>
/// <reference path="jquery.chatjs.interfaces.ts"/>
/// <reference path="jquery.chatjs.utils.ts"/>
/// <reference path="jquery.chatjs.adapter.ts"/>
/// <reference path="jquery.chatjs.window.ts"/>
/// <reference path="jquery.chatjs.messageboard.ts"/>

var PmWindowInfo = (function () {
    function PmWindowInfo() {
    }
    return PmWindowInfo;
})();

var PmWindowState = (function () {
    function PmWindowState() {
    }
    return PmWindowState;
})();

var ChatPmWindowOptions = (function () {
    function ChatPmWindowOptions() {
    }
    return ChatPmWindowOptions;
})();

// window that contains a conversation between users
var ChatPmWindow = (function () {
    function ChatPmWindow(options) {

        var _this = this;

        var defaultOptions = new ChatPmWindowOptions();
        defaultOptions.typingText = " is typing...";
        defaultOptions.isMaximized = true;
        defaultOptions.onCreated = function () {
        };
        defaultOptions.onClose = function () {
        };
        defaultOptions.chatJsContentPath = "/chatjs/";

        this.options = $.extend({}, defaultOptions, options);
        this.options.adapter.server.getUserInfo(this.options.otherUserId, this.options.group_id, function (userInfo) {
            var chatWindowOptions = new ChatWindowOptions();
            chatWindowOptions.title = '<img class="chatjs-avatar rounded '+userInfo.ProfilePictureClass+'" src="' + userInfo.ProfilePictureUrl + '">' + userInfo.Name;
			//chatWindowOptions.title = '<img class="chatjs-avatar rounded '+userInfo.ProfilePictureClass+'" src="' + userInfo.ProfilePictureUrl + '" title="'+ userInfo.Name+'">';
            chatWindowOptions.userId = userInfo.Id;
            chatWindowOptions.roomId = userInfo.RoomId;
            chatWindowOptions.canClose = true;
            chatWindowOptions.isMaximized = _this.options.isMaximized;
            var historyUpdater = null;

            chatWindowOptions.onCreated = function (window) {
                var messageBoardOptions = new MessageBoardOptions();
                messageBoardOptions.adapter = _this.options.adapter;
                messageBoardOptions.userId = _this.options.userId;
                messageBoardOptions.group_id = userInfo.group_id;
                messageBoardOptions.roomId = chatWindowOptions.roomId;
                //messageBoardOptions.conversationId = null;//chatWindowOptions.roomId;
                messageBoardOptions.height = 280;
                messageBoardOptions.otherUserId = _this.options.otherUserId;
                messageBoardOptions.chatJsContentPath = _this.options.chatJsContentPath;
                window.$windowInnerContent.messageBoard(messageBoardOptions);
                window.$windowInnerContent.addClass("pm-window");
                function historyUpdate(){
                    _this.options.adapter.server.getMessageHistory(chatWindowOptions.roomId, chatWindowOptions.roomId, _this.options.otherUserId, _this.options.group_id, 0, function(chatMessages){
                        for (var i = 0; i < chatMessages.length; i++) {
                            minichat.options.adapter.client.triggerMessagesChanged(chatMessages[i]);
                        }
                    });
                }
                historyUpdater = setInterval(historyUpdate, 10000);
            };
            chatWindowOptions.onClose = function () {
                clearInterval(historyUpdater);
                var states  = ChatController.prototype.readCookie('chatjsposition');
                //Cause we have only one window, reset array
                states.pmWindows = [];
                /*
                $.each(states.pmWindows, function(index, pmWindow){
                    if(pmWindow.otherUserId == _this.options.otherUserId){
                        states.pmWindows[index].position = false;
                    }
                });
                */
                ChatController.prototype.createCookie('chatjsposition', states);
                _this.options.onClose(_this);
            };
            chatWindowOptions.onMaximizedStateChanged = function (chatPmWindow, isMaximized) {
                _this.options.onMaximizedStateChanged(_this, isMaximized);
            };

            _this.chatWindow = $.chatWindow(chatWindowOptions);
            _this.options.onCreated(_this);
        });
    }

    ChatPmWindow.prototype.focus = function () {
    };

    ChatPmWindow.prototype.setRightOffset = function (offset) {
        this.chatWindow.setRightOffset(offset);
    };

    ChatPmWindow.prototype.getWidth = function () {
        return this.chatWindow.getWidth();
    };

    ChatPmWindow.prototype.getState = function () {
        var state = new PmWindowState();
        state.isMaximized = this.chatWindow.getState();
        state.otherUserId = this.options.otherUserId;
        return state;
    };

    ChatPmWindow.prototype.setState = function (state) {
        // PmWindow ignores the otherUserId option while setting state
        this.chatWindow.setState(state.isMaximized);
    };
    return ChatPmWindow;
})();

$.chatPmWindow = function (options) {
    var pmWindow = new ChatPmWindow(options);
    return pmWindow;
};
//# sourceMappingURL=jquery.chatjs.pmwindow.js.map

﻿/// <reference path="../../Scripts/Typings/jquery/jquery.d.ts"/>
/// <reference path="jquery.chatjs.interfaces.ts"/>
/// <reference path="jquery.chatjs.adapter.ts"/>
/// <reference path="jquery.chatjs.utils.ts"/>
/// <reference path="jquery.chatjs.window.ts"/>
/// <reference path="jquery.chatjs.userlist.ts"/>

var ChatFriendsWindowState = (function () {
    function ChatFriendsWindowState() {
    }
    return ChatFriendsWindowState;
})();

var ChatFriendsWindowOptions = (function () {
    function ChatFriendsWindowOptions() {
    }
    return ChatFriendsWindowOptions;
})();

// window that contains a list of friends. This component is used as opposed to "jquery.chatjs.rooms". The "rooms" component
// should be used when the user has the ability to select rooms and broadcast them. The "friends window" is used when you want a
// Facebook style friends list.
var ChatFriendsWindow = (function () {

    function ChatFriendsWindow(options) {
	    
        var _this = this;
        var defaultOptions = new ChatFriendsWindowOptions();
        defaultOptions.titleText = "Friends";
        defaultOptions.isMaximized = true;
        defaultOptions.offsetRight = 10;
        defaultOptions.emptyRoomText = "No users for chatting.";
        defaultOptions.onCreated = function () {
        };

        this.options = $.extend({}, defaultOptions, options);

        this.options.adapter.server.enterRoom(this.options.roomId, function () {
            // loads the user list
        });

        var chatWindowOptions = new ChatWindowOptions();
        chatWindowOptions.title = this.options.titleText;
        chatWindowOptions.canClose = false;
        chatWindowOptions.height = 300;
        chatWindowOptions.isMaximized = this.options.isMaximized;

        chatWindowOptions.onMaximizedStateChanged = function (chatWindow, isMaximized) {
            _this.options.onStateChanged(isMaximized);
        };

        chatWindowOptions.onCreated = function (window) {
            // once the chat window is created, it's time to add content
            var userListOptions = new UserListOptions();
            userListOptions.adapter = _this.options.adapter;
            userListOptions.roomId = _this.options.roomId;
            userListOptions.userId = _this.options.userId;
            userListOptions.height = _this.options.contentHeight;
            userListOptions.excludeCurrentUser = true;
            userListOptions.emptyRoomText = _this.options.emptyRoomText;
            userListOptions.userClicked = _this.options.userClicked;
            window.$windowInnerContent.userList(userListOptions);
            historyUpdater = setInterval(function(){
                _this.options.adapter.server.updateUserList(userListOptions.roomId, userListOptions.roomId, function(chatUsers){
                    //TODO: for some rason updateUserList does not return proper chatUsers
                    if(chatUsers.length > 0){
                        minichat.options.adapter.client.triggerUserListChanged(chatUsers);
                    }
                });
            }, 10000);
        };
	    
        this.chatWindow = $.chatWindow(chatWindowOptions);
        this.chatWindow.setRightOffset(this.options.offsetRight);
        this.options.onCreated(this);
    }
    ChatFriendsWindow.prototype.focus = function () {
    };

    ChatFriendsWindow.prototype.setRightOffset = function (offset) {
        this.chatWindow.setRightOffset(offset);
    };

    ChatFriendsWindow.prototype.getWidth = function () {
        return this.chatWindow.getWidth();
    };

    ChatFriendsWindow.prototype.getState = function () {
        var state = new ChatFriendsWindowState();
        state.isMaximized = this.chatWindow.getState();
        return state;
    };

    ChatFriendsWindow.prototype.setState = function (state) {
        // this.chatWindow.setState(state.isMaximized);
    };
    return ChatFriendsWindow;
})();

$.chatFriendsWindow = function (options) {
    var friendsWindow = new ChatFriendsWindow(options);
    return friendsWindow;
};
//# sourceMappingURL=jquery.chatjs.friendswindow.js.map

/// <reference path="../../Scripts/Typings/jquery/jquery.d.ts"/>
/// <reference path="../../Scripts/Typings/autosize/autosize.d.ts"/>
/// <reference path="jquery.chatjs.adapter.ts"/>
/// <reference path="jquery.chatjs.pmwindow.ts"/>
/// <reference path="jquery.chatjs.friendswindow.ts"/>


var ChatControllerOptions = (function () {
    function ChatControllerOptions() {
    }
    return ChatControllerOptions;
})();

var ChatJsState = (function () {
    function ChatJsState() {
        this.pmWindows = [];
        this.mainWindowState = new ChatFriendsWindowState();
    }
    return ChatJsState;
})();

var ChatController = (function () {

    function ChatController(options) {

        var _this = this;
        var defaultOptions = new ChatControllerOptions();
        defaultOptions.roomId = null;
        defaultOptions.friendsTitleText = "Friends";
        defaultOptions.availableRoomsText = "Available rooms";
        defaultOptions.typingText = " is typing...";
        defaultOptions.offsetRight = 10;
        defaultOptions.windowsSpacing = 5;
        defaultOptions.enableSound = true;
        defaultOptions.persistenceMode = "cookie";
        defaultOptions.persistenceCookieName = "chatjsposition";
        defaultOptions.chatJsContentPath = "/chatjs/";

        this.options = $.extend({}, defaultOptions, options);

        // check required properties
        if (!this.options.roomId)
            throw "Room id option is required";

        this.pmWindows = [];

        // getting the adapter started. You cannot call the adapter BEFORE this is done.
        this.options.adapter.init(function () {
            var state = _this.getState();
            var states = _this.getState();

            // the controller must have a listener to the "messages-changed" event because it has to create
            // new PM windows when the user receives it

            /*_this.options.adapter.client.onMessagesChanged(function (message) {

                if (message.UserToId && message.UserToId == _this.options.userId && !_this.findPmWindowByOtherUserId(message.UserFromId)) {
                    //_this.createPmWindow(message.UserFromId, true, true);
                }
            });
*/
            // if the user is able to select rooms
            var friendsWindowOptions = new ChatFriendsWindowOptions();
            friendsWindowOptions.roomId = _this.options.roomId;
            friendsWindowOptions.adapter = _this.options.adapter;
            friendsWindowOptions.userId = _this.options.userId;
            friendsWindowOptions.offsetRight = _this.options.offsetRight;
            friendsWindowOptions.titleText = _this.options.friendsTitleText;
            friendsWindowOptions.isMaximized = state ? state.mainWindowState.isMaximized : true;

            friendsWindowOptions.onCreated = function () {
                if(states != null){
                    for (var i = 0; i < states.pmWindows.length; i++) {
                        _this.createPmWindow(states.pmWindows[i].otherUserId, true, true, null);
                    }
                }
            };

            // when the friends window changes state, we must save the state of the controller
            friendsWindowOptions.onStateChanged = function () {
                _this.saveState();
            };

            // when the user clicks another user, we must create a pm window
            friendsWindowOptions.userClicked = function (userId, group, room) {
                _this.options.group_id = group;
                _this.options.roomId = room;
                if (userId != _this.options.userId) {
                    // verify whether there's already a PM window for this user
                    var existingPmWindow = _this.findPmWindowByOtherUserId(userId, group);
                    if (existingPmWindow){
                        existingPmWindow.focus();
                    } else {
	                    console.log(111);
                        _this.createPmWindow(userId, true, true, group);
                    }
                }
            };

            _this.mainWindow = $.chatFriendsWindow(friendsWindowOptions);
            _this.setState(states);
        });

        // for debugging only
        window.chatJs = this;
    }
    // creates a new PM window for the given user
    ChatController.prototype.createPmWindow = function (otherUserId, isMaximized, saveState, group) {

	    // console.log(otherUserId);
	    // console.log(isMaximized);
	    // console.log(saveState);
	    // console.log(group);
	    // console.log(this.options);
	    // console.log(this);

	    // ChatController.prototype.createPmWindow('22',true,true,null);

        var _this = this;

        var chatPmOptions = new ChatPmWindowOptions();
        chatPmOptions.userId = this.options.userId;
        chatPmOptions.group_id = group;
        chatPmOptions.roomId = this.options.roomId;
        chatPmOptions.otherUserId = otherUserId;
        chatPmOptions.adapter = this.options.adapter;
        chatPmOptions.typingText = this.options.typingText;
        chatPmOptions.isMaximized = isMaximized;
        chatPmOptions.chatJsContentPath = this.options.chatJsContentPath;

        chatPmOptions.onCreated = function (pmWindow) {

            _this.pmWindows.push({
                otherUserId: otherUserId,
                conversationId: null,
                pmWindow: pmWindow,
                group_id: group,
                roomId: chatPmOptions.roomId
            });

            _this.organizePmWindows();
            //if (saveState)
            _this.saveState();

        };
        chatPmOptions.onClose = function () {
            for (var i = 0; i < _this.pmWindows.length; i++)
                if (_this.pmWindows[i].otherUserId == otherUserId) {
                    this.adapter.client.onPMClose();
                    _this.pmWindows.splice(i, 1);
                    _this.saveState();
                    _this.organizePmWindows();
                    break;
                }
        };
        chatPmOptions.onMaximizedStateChanged = function () {
            _this.saveState();
        };

        return $.chatPmWindow(chatPmOptions);
    };

    // saves the windows states
    ChatController.prototype.saveState = function () {
        var _this = this;
        var state = new ChatJsState();
        var states  = ChatController.prototype.readCookie(this.options.persistenceCookieName);
        /*
        for (var i = 0; i < this.pmWindows.length; i++) {
          if(states != null && states.pmWindows[i] != null)
            if(typeof(states.pmWindows[i].position) != 'undefined'){
                positionWindow = states.pmWindows[i].position;
            }
            state.pmWindows.push({
                otherUserId: this.pmWindows[i].otherUserId,
                conversationId: null,
                isMaximized: this.pmWindows[i].pmWindow.getState().isMaximized,
                position: positionWindow
            });
        }
        */
        if(this.pmWindows.length){
            $.each(this.pmWindows, function(index, pmWindow){
                positionWindow = archive = {}
                if(states.pmWindows.length){
                    for (var i = 0; i < states.pmWindows.length; i++) {
                        if(states.pmWindows[i].otherUserId == pmWindow.otherUserId){
                            archive = states.pmWindows[i];
                            break;
                        }
                    }
                }
                if(typeof archive.position != 'undefined'){
                    positionWindow = archive.position;
                }
                state.pmWindows.push({
                    otherUserId: _this.pmWindows[index].otherUserId,
                    conversationId: null,
                    isMaximized: _this.pmWindows[index].pmWindow.getState().isMaximized,
                    position: positionWindow
                });
            });

            // persist rooms state
            state.mainWindowState = this.mainWindow.getState();

        } else {
            state = states;
        }
        switch (this.options.persistenceMode) {
            case "cookie":
                this.createCookie(this.options.persistenceCookieName, state);
                break;
            case "server":
                throw "Server persistence is not supported yet";
            default:
                throw "Invalid persistence mode. Available modes are: cookie and server";
        }

        return state;
    };

    ChatController.prototype.getState = function () {
        var state;
        switch (this.options.persistenceMode) {
            case "cookie":
                state = this.readCookie(this.options.persistenceCookieName);
                break;
            case "server":
                throw "Server persistence is not supported yet";
            default:
                throw "Invalid persistence mode. Available modes are: cookie and server";
        }
        if(state == null){
            isMaximized = this.readCookie('state_window');
            state = {pmWindows: [], mainWindowState: {isMaximized: isMaximized} };
            this.createCookie(this.options.persistenceCookieName, state);
        }
        return state;
    };

    // loads the windows states
    ChatController.prototype.setState = function (state) {

        if (typeof state === "undefined") { state = null; }
        // if a state hasn't been passed in, gets the state. If it continues to be null/undefined, then there's nothing to be done.
        if (!state)
            state = this.getState();
        if (!state)
            return;

        for (var i = 0; i < state.pmWindows.length; i++) {
            var shouldCreatePmWindow = true;

            // if there's already a PM window for the given user, we'll not create it
            if (this.pmWindows.length) {
                for (var j = 0; j < this.pmWindows.length; j++) {
                    if (state.pmWindows[i].otherUserId && this.pmWindows[j].otherUserId == state.pmWindows[j].otherUserId) {
                        shouldCreatePmWindow = false;
                        break;
                    }
                }
            }
        }

        this.mainWindow.setState(state.mainWindowState, false);
    };

    ChatController.prototype.eraseCookie = function (name) {
        this.createCookie(name, "", -1);
    };

    // reads a cookie. The cookie value will be converted to a JSON object if possible, otherwise the value will be returned as is
    ChatController.prototype.readCookie = function (name) {
        var nameEq = name + "=";
        var ca = document.cookie.split(';');
        var cookieValue;
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEq) == 0) {
                cookieValue = c.substring(nameEq.length, c.length);
            }
        }
        if (cookieValue) {
            try  {
                return JSON.parse(cookieValue);
            } catch (e) {
                return cookieValue;
            }
        } else {
            return null;
        }
    };

    // creates a cookie. The passed in value will be converted to JSON, if not a string
    ChatController.prototype.createCookie = function (name, value, days) {
        var stringedValue;
        if (typeof value == "string"){
            stringedValue = value;
        } else {
            stringedValue = JSON.stringify(value);
        }
        if (value)
            var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + stringedValue + expires + "; path=/";
    };

    ChatController.prototype.findPmWindowByOtherUserId = function (otherUserId, group_id) {
      var windows = null;
        for (var i = 0; i < this.pmWindows.length; i++){
            if((navigator.userAgent.search(/ipad/i) >= 0) || (navigator.userAgent.search(/iphone/i) >= 0)) {
                if (this.pmWindows[i].otherUserId == otherUserId){
                    windows =  this.pmWindows[i].pmWindow;
                }else{
                    this.pmWindows[i].pmWindow.chatWindow.remove();
                }
            } else {
                if (this.pmWindows[i].otherUserId == otherUserId){
                    return this.pmWindows[i].pmWindow;
                } else {
                    this.pmWindows[i].pmWindow.chatWindow.remove();
                }
            }
      }
      return windows;
    };

    // organizes the pm windows
    ChatController.prototype.organizePmWindows = function () {
        // this is the initial right offset
        var rightOffset = +this.options.offsetRight + this.mainWindow.getWidth() + this.options.windowsSpacing;
        for (var i = 0; i < this.pmWindows.length; i++) {
            this.pmWindows[i].pmWindow.setRightOffset(rightOffset);
            if($('.wrapper-container').width() >= (rightOffset+this.pmWindows[i].pmWindow.getWidth()+20)){
              var states  = ChatController.prototype.readCookie('chatjsposition');
              if(states != null)
              if(typeof(states.pmWindows[i]) == 'undefined'){
                rightOffset += this.pmWindows[i].pmWindow.getWidth() + this.options.windowsSpacing;
              }else{
                if(typeof(states.pmWindows[i].position) == 'undefined' || states.pmWindows[i].position == false){
                  rightOffset += this.pmWindows[i].pmWindow.getWidth() + this.options.windowsSpacing;
                }
              }
            }
        }
    };
    return ChatController;
})();

$.chat = function (options) {
    var chat = new ChatController(options);
	window.chatBackDoor = chat;
    return chat;
};
//# sourceMappingURL=jquery.chatjs.controller.js.map
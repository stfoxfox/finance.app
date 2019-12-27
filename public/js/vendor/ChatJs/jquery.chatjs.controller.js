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

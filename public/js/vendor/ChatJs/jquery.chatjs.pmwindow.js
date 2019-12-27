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

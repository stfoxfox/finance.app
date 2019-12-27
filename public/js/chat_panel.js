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

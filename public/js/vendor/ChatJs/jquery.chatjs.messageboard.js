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

!function () {
	'use strict';

	function acceptRequest(request, user_id, event_id) {
		var result = false;
		jQuery.ajax({
			method: "POST",
			url: '/UserAjax/acceptInvites',
			async: false,
			data: {id: request, event_id: event_id, user_id: user_id},
			success: function (respnse) {
				result = true;
			}
		});
		return result;
	}

	function discardRequest(request, user_id, event_id) {
		var result = false;
		jQuery.ajax({
			method: "POST",
			url: '/UserAjax/discartInvites',
			async: false,
			data: {id: request, event_id: event_id, user_id: user_id},
			success: function (respnse) {
				result = true;
			}
		});
		return result;
	}

	function acceptShare(request, user_id, event_id) {
		var result = false;
		jQuery.ajax({
			method: "POST",
			url: '/UserAjax/acceptShareInvites',
			async: false,
			data: {id: request, event_id: event_id, user_id: user_id},
			success: function (respnse) {
				result = true;
			}
		});
		return result;
	}

	function deleteFromShare(request, user_id, event_id) {
		jQuery.ajax({
			method: "POST",
			url: '/UserAjax/deleteShareInvites',
			async: false,
			data: {id: request, event_id: event_id},
		}).done(function (response) {
			jQuery('.accept-' + event_id + '-' + user_id).remove();
		});
	}

	$(function() {

		var target = $('#task_list').find('.task');
		
		target.each(function () {
			var self = $(this);
			//Делаем блок похожей задачи ссылкой, кроме нужных нам ссылок
			var link = self.find('.js-link');
			link.on('click.linker', function () {
				self.off('click.linker');
				setTimeout(function () {
					self.on('click.linker', function () {

					});
				}, 300);
			});
			self.on('click.linker', function () {
				document.location.href = '/User/task/' + self.data('task_id');
			});

			//Скрываем инфу и показываем кнопку заявки в похожих задачах
			self.on('mouseenter', function () {
				self.find('.info').addClass('hide');
				self.find('.request_btn').removeClass('hide');
				self.find('.footer').css('padding', '0');
			});

			self.on('mouseleave', function () {
				self.find('.info').removeClass('hide');
				self.find('.request_btn').addClass('hide');
				self.find('.footer').css('padding', '5px');
			});
		});

		//Вешаем событие для подтверждения/отказа заявки на задачу

		$('#requests').find('.request').each(function () {
			var $this = $(this);
			var requestID = $this.data('task_id');
			var userID = $this.data('user_id');
			var eventID = $this.data('event_id');
			$this.find('.accept a').on('click', function (e) {

				var result = acceptRequest(requestID, userID, eventID);
				if(result){
					$this.hide();
				}
			});

			$this.find('.decline a').on('click', function (e) {
				var result = discardRequest(requestID, userID, eventID);
				if(result){
					$this.hide();
				}
			});
		});
	});

}();


var CloudMover = {
	afterMove: function () {},
	render: function ($this, params) {
		if (!$this.data('what')) {
			return;
		}
		params = params == 'undefined' ? {} : params;
		$.post(cloudURL.panelMove, params, function (response) {
			$('.cloud-manager.popover-content').html(response);

			$('.popoverFolderCreate').css({border: '1px solid #ccc'});
			$('.cloud-manager-move-back').on('click', function () {
				CloudMover.render($this, {id: $(this).data('id')});
			});
			$('.cloud-manager-move-select').on('click', function () {
				$('.cloud-manager-move-select').removeClass('active');
				$(this).toggleClass('active');
				$this.data('where', $(this).data('id'));
			});
			$('.cloud-manager-move-select').doubletap(
				function (event) {
					$target = $(event.currentTarget);
					CloudMover.render($this, {id: $target.data('id')});
				}
			);
			// mover
			$('.popoverFolderCreate .cloudMover').on('click', function () {
				if (!$this.data('what')) {
					return;
				}
				if ($this.data('what') == $this.data('where')) {
					return;
				}
				$.post(cloudURL.move, {id: $this.data('what'), parentId: $this.data('where')}, function () {
					CloudMover.afterMove();
				});
			});
			// close
			$('.popoverFolderCreate .closePopup').on('click', function () {
				$this.popover('hide');
			});
			// init
			$this.data('where', $('.cloud-move-where').data('where'))
		});
	}
};
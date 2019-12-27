var CloudManagerMover = {
	render: function ($this, params) {
		if (!$this.data('what')) {
			return;
		}
		params = params == 'undefined' ? {} : params;
		$.post(cloudURL.panelMove, params, function (response) {
			$('#cloud-manager-move-modal .modal-content').html(response);

			$('#cloud-manager-move-modal .circle_remove').removeClass('hide');

			$('.cloud-manager-move-back').on('click', function () {
				CloudManagerMover.render($this, {id: $(this).data('id')});
			});
			$('.cloud-manager-move-select').on('click', function () {
				$('.cloud-manager-move-select').removeClass('active');
				$(this).toggleClass('active');
				$this.data('where', $(this).data('id'));
			});
			$('.cloud-manager-move-select').doubletap(
				function (event) {
					$target = $(event.currentTarget);
					CloudManagerMover.render($this, {id: $target.data('id')});
				}
			);
			// mover
			$('#cloud-manager-move-modal .cloudMover').on('click', function () {
				if (!$this.data('what')) {
					return;
				}
				if ($this.data('what') == $this.data('where')) {
					return;
				}
				$.post(cloudURL.move, {id: $this.data('what'), parentId: $this.data('where')}, function () {
					location.reload(false);
				});
			});
			// init current folder as 'where'
			$this.data('where', $('.cloud-move-where').data('where'))
		});
	}
};
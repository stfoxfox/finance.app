if (!EditorPlugins) var EditorPlugins = {};

EditorPlugins.clips = {
	init: function()
	{
		var callback = $.proxy(function()
		{
			$('#editor_modal').find('.editor_clip_link').each($.proxy(function(i, s)
			{
				$(s).click($.proxy(function()
				{
					this.insertClip($(s).next().html());
					return false;

				}, this));
			}, this));

			this.selectionSave();
			this.bufferSet();

		}, this );

		this.buttonAdd('clips', 'Clips', function(e)
		{
			this.modalInit('Clips', '#clipsmodal', 500, callback);
		});
	},
	insertClip: function(html)
	{
		this.selectionRestore();
		this.insertHtml($.trim(html));
		this.modalClose();
	}
};


var ArticleCategory = {
	panel: null, 
	
	initPanel: function (container) {
		ArticleCategory.panel = container;
		$(ArticleCategory.panel).load(articleURL.panel, null, function(){
			ArticleCategory.initHandlers();
		});
	},
	
	initHandlers: function() {
		$('#searchArticleCatForm').ajaxForm({
			url: articleURL.panel,
			target: ArticleCategory.panel,
			success: function() { ArticleCategory.initHandlers(); }
		});
	}
}
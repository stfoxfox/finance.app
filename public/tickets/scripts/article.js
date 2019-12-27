function vote_article(vote, articleid, tok) {
	$.ajax({
		url: global_base_url + "article/vote/",
		type: "GET",
		data: {
			vote: vote,
			articleid: articleid,
			tok : tok
		},
		success: function(msg) {
			$('#article-votes').html(msg);
		}
	});
}
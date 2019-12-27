$(document).ready(function() {
	$('#pop-tab').click(function() {
		$('#new-tab').addClass("faded");
		$('#pop-tab').removeClass("faded");
		$.ajax({
			url: global_base_url + "index/get_articles/",
			type: "GET",
			data: {
				type: 0
			},
			beforeSend: function() {
			     $('#article-loader').show();
			  },
			  complete: function(){
			     $('#article-loader').hide();
			  },
			success: function(msg) {
				$('#articles-b').html(msg);
			}
		});
	});

	$('#new-tab').click(function() {
		$('#new-tab').removeClass("faded");
		$('#pop-tab').addClass("faded");
		$.ajax({
			url: global_base_url + "index/get_articles/",
			type: "GET",
			data: {
				type: 1
			},
			beforeSend: function() {
			     $('#article-loader').show();
			  },
			  complete: function(){
			     $('#article-loader').hide();
			  },
			success: function(msg) {
				$('#articles-b').html(msg);
			}
		});
	});
});
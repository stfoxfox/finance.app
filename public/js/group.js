var Group = {
	panel: null,

	initPanel: function (container) {
		Group.panel = container;
		$(Group.panel).load(groupURL.panel, null, function(){
			Group.initHandlers();
		});
	},

	initHandlers: function() {
		$('#searchGroupForm').ajaxForm({
			url: groupURL.panel,
			target: Group.panel,
			success: function() { Group.initHandlers(); }
		});
	},

	renderGalleryVideoAdmin: function(data) {
		return tmpl('group-gallery-video-admin', data);
	},

	renderGalleryImageAdmin: function(data) {
		return tmpl('group-gallery-image-admin', data);
	},

	showGalleryAdmin: function(data) {
		$('.photoCollection').html(Group.renderGalleryVideoAdmin(data.videos) + Group.renderGalleryImageAdmin(data.images));

		if ((data.images.length + data.videos.length) < groupDef.maxImages) {
			$('.photoButtons').show();
		} else {
			$('.photoButtons').hide();
		}
	},

	updateGalleryAdmin: function(group_id) {
		$.post(groupURL.getGallery, {data: {group_id: group_id}}, function(response){
			if (checkJson(response)) {
				Group.showGalleryAdmin(response.data);
			}
		});
	},

	delGalleryImage: function(group_id, id) {
		$.post(mediaURL.remove, {data: {object_type: 'GroupGallery', object_id: group_id, id: id}}, function(response){
			Group.updateGalleryAdmin(group_id);
		});
	},

	addGalleryVideo: function(group_id) {
		var url = $('.newVideoPopup #add-new-video').val();
		if (url) {
			$.post(groupURL.addGalleryVideo, {data: {group_id: group_id, url: url}}, function(response){
				if (checkJson(response)) {
					$('.newVideoPopup #add-new-video').val('');
					Group.showGalleryAdmin(response.data);
				}
			});
		}
	},

	delGalleryVideo: function(group_id, id) {
		$.post(groupURL.delGalleryVideo, {data: {group_id: group_id, id: id}}, function(response){
			if (checkJson(response)) {
				Group.showGalleryAdmin(response.data);
			}
		});
	},

	join: function(group_id, user_id) {
		$.post(groupURL.join, {data: {group_id: group_id, user_id: user_id}}, function(response){
			if (checkJson(response)) {
				alert($('.joined').html());
				$('#joinGroup').hide();
			}
		});
	}
}

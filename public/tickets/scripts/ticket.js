function addNewFile() {
	$('#file_uploads').append('<li class="list-group-item"><input type="file" name="files[]" size="20" /></li>')
}

function showNotes() {
	$('#anotes').toggle();
}

function load_canned() {
	var res = $('#cannedRes').val();
	if(res == 0 || res == null) return;
	res = $('#cannedResText-'+res).html();
	res = res.replace("[TICKET_USER]", ticket_user);
	res = res.replace("[ADMIN_USER]", admin_user);
	tinyMCE.get("replyBox").setContent( res );
}
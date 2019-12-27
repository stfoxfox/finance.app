$(function() {
	$('.redactor_box').redactor({
		focus: true,
		phpTags: false,
		plugins: ['table', 'video'],
		imageUpload: '/redactor/mediafiles/upload/image',
		fileUpload: '/redactor/mediafiles/upload/file',
		imageGetJson: '/redactor/mediafiles/getmediaimages.json',
		minHeight: 200,
		buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'underline', 'deleted', '|', 
                'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
                'link', '|',
                'fontcolor', 'backcolor', '|', 'alignment', '|', 'horizontalrule']
	});
});

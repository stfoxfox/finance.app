var sum_bitrate = 0, count_bitrate = 0, context, uploadBtn, objectType, resizeAspect, aspect, jcrop_api, jcrop_data = [], avatar_changed = false;
var acceptedExt = [ 'jpg', 'jpeg', 'png', 'gif' ];
var cropPreviewWidth = 200;

function getFileType(file) {
	var type = file.type.replace(/application\//, '');
	if (type.length > 4) {
		var fname = file.name.split('.');
		if (fname.length > 1) {
			type = fname.pop();
		}
		if (type.length > 4) {
			type = '';
		}
	}
	return type;
}

function getProgressContext(data) {
	var progressID = $(data.fileInput).data('progress_id');
	return (progressID) ? $('#' + progressID).get(0) : document.body;
}

function saveJcropData(c) {
	jcrop_data = [Math.floor(c.x / resizeAspect), Math.floor(c.y / resizeAspect), Math.floor(c.w / resizeAspect), Math.floor(c.h / resizeAspect)];
};

function jcropInit(data) {
	var oFReader = new FileReader();
	oFReader.readAsDataURL(data.files[0]);

	oFReader.onload = function (oFREvent) {

		if (jcrop_api) {
			jcrop_api.destroy();
		}
		//$('img#tempAvatar').remove();
        if(objectType !== 'User') {
            $('img#tempAvatar').remove();
            $('.avatar-img-'+objectType).append('<img id="tempAvatar" src="" alt="" />');
        }
        else {
            //$('#tempAvatar').remove();
            $('#cropper-modal-img-wrap img').attr('src', oFREvent.target.result);
            //$('.avatar-user-div').append('<div id="tempAvatar"></div>');
            //$('.avatar-img-'+objectType).attr('src')
            $('#cropper-modal').modal('show');
            avatar_changed = oFREvent.target.result;
            return;
        }

		var img = $('img#tempAvatar').get(0);
   		$(img).hide().prop('src', oFREvent.target.result);
   		
   		var count = 0;
   		var timer = setInterval(function(){
   			var iW = img.width, iH = img.height;
   			if (count > 50) {
   				alert('Your photo is too large. Please upload another one');
   			}
   			if (iW < 5) {
   				count++;
   				return;
   			}
   			clearInterval(timer);
   			
   			uploadBtn.show();
   			$(img).show();

	   		resizeAspect = cropPreviewWidth / iW;
	   		$(img).prop('width', cropPreviewWidth);
	   		$(img).prop('height', iH * resizeAspect);
			
			if((navigator.userAgent.search(/ipad/i) >= 0) || (navigator.userAgent.search(/iphone/i) >= 0)) {
                	
				var iWidth = $('div.col-sm-3.leftFormBlock').width();

				resizeAspect = iWidth / iW;
				$(img).prop('width', iWidth);
				$(img).prop('height', iH * resizeAspect);	
	
                var is_landscape = false;
                EXIF.getData(img, function() {
                    if(EXIF.getTag(img, 'Orientation') > 5) {
                        $(img).prop('width', iH * resizeAspect);
                        $(img).prop('height', cropPreviewWidth);
                    }
                });
                /*
				$(img).prop('width', iH * resizeAspect);
				$(img).prop('height', 200);
				alert($(img).prop('width'));
                */
			}
	   		
	   		var min = Math.min(iW, iH);
			var aspect = 1;
	   		// console.log(['Orig size', iW, iH, 'Current', img.width, img.height, 'Select', min]);
	   		// alert(['Orig size', iW, iH, 'Current', img.width, img.height, 'Select', min].join());
			if (objectType == 'GroupGallery') {
				aspect = 16 / 9;
			}
			$('#tempAvatar').Jcrop({
				aspectRatio: aspect,
				bgOpacity: 0.5,
				setSelect: [ 0, 0, min, min],
				onSelect: saveJcropData,
        		onChange: saveJcropData
			}, function(){
			    jcrop_api = this;
			});
   		}, 100);
	}
}

$(function () {
    var $image = $('#cropper-modal .img-responsive');
        var cropBoxData,
        canvasData;
    if (objectType == 'GroupGallery') {
        aspect = 16 / 9;
    }
    else
        aspect = 1;
    $('#cropper-modal').on('shown.bs.modal', function () {
        $image.cropper({
            autoCropArea: 0.5,
            minCropBoxWidth: 200,
            aspectRatio: aspect,
            background: false,
            preview: '.avatar-user-div',
            built: function (e) {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            },
            crop: function (e) {
                jcrop_data = [e.x, e.y, e.width, e.height];
            }
        });
    }).on('hidden.bs.modal', function () {
        cropBoxData = $image.cropper('getCropBoxData');
        canvasData = $image.cropper('getCanvasData');
        $image.cropper('destroy');
        $('.avatar-user-div img').show();
    });
    $('.save-upload').click(function(){
        $('.avatar-user-div img').attr('src', avatar_changed);
        $('#cropper-modal').modal('hide');
        $('#userAvatarUpload').click();
    });
	$('.fileuploader').fileupload({
		url: mediaURL.upload,
		dataType: 'json',
            done: function (e, data) {
			var file = data.result.files[0];
			file.object_type = $(data.fileInput).data('object_type');
			if($(data.fileInput).data('real_type') == 'Group'){
				file.object_type = 'Group';
			}
			file.object_id = $(data.fileInput).data('object_id');
			file.crop = jcrop_data;
			
			$('.inputFile').hide();
			$('#processFile', getProgressContext(data)).show();
			
			$('.progress').css('height', 0);
			$('.progress .progress-bar').css('width', 0);
			
			$.post(mediaURL.move, file, function(response){
                $('#processFile', getProgressContext(data)).hide();
                $('.inputFile').show();
                $('#progress-bar', getProgressContext(data)).hide();
                if (checkJson(response)) {
                	if (file.object_type == 'ProjectEvent') {
                		window.location.reload();
                	} else { // User Avatar, User University, Group Avatar
						
						if (file.object_type == 'GroupGallery') {
							Group.updateGalleryAdmin($(data.fileInput).data('object_id'));
						} else 

                		var imgID = $(data.fileInput).data('object_type') + $(data.fileInput).data('object_id');
                		var mediaID = $('#' + imgID).data('media_id');
                		if (mediaID) {
                			$(data.fileInput).data('id', mediaID);
                		}
                		$('#' + imgID).prop('src', response.data[0].Media.url_img.replace(/noresize/, $('#' + imgID).data('resize')));
                		$('#' + imgID).data('media_id', response.data[0].Media.id);
                		if (($(data.fileInput).prop('id') == 'userAvatarChoose') || ($(data.fileInput).prop('id') == 'groupGalleryChoose')) {
                            if (jcrop_api) {
								jcrop_api.destroy();
								jcrop_api = null;
							}
							$('#' + imgID).show();
							$('#tempAvatar').remove();
							uploadBtn.hide();
                		}
                	}
                }
            }, 'json');
		},
		add: function (e, data) {
            if (e.isDefaultPrevented()) {
				return false;
			}

			context = getProgressContext(data);
			$('.progress .progress-bar', context).css('width', 0);
			$('#progress-bar', context).show();
			$('#progress-stats', context).html('&nbsp;');
			
			$('.progress').css('height', '20px');
			
			var clickedButton = data.fileInput[0];
			if (($(clickedButton).prop('id') == 'userAvatarChoose') || ($(clickedButton).prop('id') == 'userUniversityChoose') || ($(clickedButton).prop('id') == 'groupGalleryChoose')) {
				
				var ext = getFileType(data.files[0]);
				if ($.inArray(ext, acceptedExt) < 0) {
					alert('Selected file is not an image');
					$('.progress').css('height', 0);
					$('#progress-bar', context).hide();
					$('#progress-stats', context).html('');
					return;
				}
				
				if (($(clickedButton).prop('id') == 'userAvatarChoose') || ($(clickedButton).prop('id') == 'groupGalleryChoose')) {
					var imgDOM = 'img#' + $(clickedButton).data('object_type') + $(clickedButton).data('object_id');
					if( $(imgDOM).attr('data-crop_resize') ) {
						cropPreviewWidth = $(imgDOM).data('crop_resize');
					} else {
						cropPreviewWidth = 200;	
					}
					// $('#userAvatarUpload').data(data);
					$('img#' + $(clickedButton).data('object_type') + $(clickedButton).data('object_id')).hide();
					uploadBtn = $(this).parents('.inputFile').find('.upload');
					objectType = $(clickedButton).data('object_type');
					uploadBtn.data(data);
					jcropInit(data);
					return;
				}
			}
			
			$('.inputFile').hide();
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('.progress .progress-bar', getProgressContext(data)).css('width', progress + '%');
			sum_bitrate+= data.bitrate;
			count_bitrate++;
			var avg_bitrate = sum_bitrate / count_bitrate;
			var html = Format.bitrate(avg_bitrate) + ' | ' +
				Format.time((data.total - data.loaded) * 8 / avg_bitrate) + ' | ' +
				Format.percentage(data.loaded / data.total) + ' | ' +
				Format.fileSize(data.loaded) + ' / ' + Format.fileSize(data.total);
			//$('#progress-stats', context).html(chatLocale.Loading); // html
			$('#progress-stats', context).html(progress + '%');
		}
	}).prop('disabled', !$.support.fileInput)
		.parent().addClass($.support.fileInput ? undefined : 'disabled');
});


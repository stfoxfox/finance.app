$(document).ready(function () {
    // init
    Cloud.managerUploadCounter = 0;

    $('#create-btn').tooltip({
        container: '#create-btn',
        trigger: 'click',
        html: true,
        title: $('#create-tooltip-content').html(),
        placement: 'bottom'
    });

    $('#cloud-manager-view').tooltip({
        container: '#cloud-manager-view',
        trigger: 'click',
        html: true,
        title: $('#view-tooltip-content').html(),
        placement: 'bottom'
    });

    $('#cloud-manager-sort').tooltip({
        container: '#cloud-manager-sort',
        trigger: 'click',
        html: true,
        title: $('#sort-tooltip-content').html(),
        placement: 'bottom'
    });

    $(document).on('click', function(e){
        if( $(e.target).prop('id') != 'create-btn' ) {
            $('#create-btn').tooltip('hide');
        }
        if( $(e.target).prop('id') != 'cloud-manager-sort' && $(e.target).parents('.btn').prop('id') != 'cloud-manager-sort' ) {
            $('#cloud-manager-sort').tooltip('hide');
        }
        if( $(e.target).prop('id') != 'cloud-manager-view' && $(e.target).parents('.btn').prop('id') != 'cloud-manager-view' ) {
            $('#cloud-manager-view').tooltip('hide');
        }

    })

    // css
    $('select').styler();

    // view query
    $('#cloud-manager-sort').on('click', '.tooltip-select', function () {
        $(this).closest('form').children('[name="sort"]').val($(this).data('sort'));
        $(this).closest('form').submit();
    });

    $('#cloud-manager-view').on('click', '.tooltip-select', function (e) {
        $(this).closest('form').children('[name="view"]').val($(this).data('view'));
        $(this).closest('form').submit();
    });

    $('#cloud-manager-view, #create-btn, #cloud-manager-view, #cloud-manager-path').on('show.bs.tooltip', function (e) {
        $(this).removeClass('active').addClass('active');
    });

    $('#cloud-manager-view, #create-btn, #cloud-manager-view, #cloud-manager-path').on('hidden.bs.tooltip', function (e) {
        $(this).removeClass('active');
    });

    // add folder
    $('#cloud-manager-add-folder').on('submit', function () {
        $form = $(this);
        $.post(cloudURL.addFolder, $form.serialize(), function (response) {
            location.reload(false);
        });
        return false;
    });

    // select file or folder
    $('.foldersAndFiles').on('click', '.item:not(".shared-folder")', function (e) {

        $(this).toggleClass('active');

        $('#cloud-manager-delete').data({type: '', id: ''});
        $('#cloud-manager-upload').data('url', '');

        $('#cloud-manager-delete').data({type: $(this).data('type'), id: $(this).data('id')});
        $('#cloud-manager-share').data('link', location.protocol + '//' + location.host + $(this).data('url'));
        $('#cloud-manager-move').data('what', $(this).data('id'));
        if ($(this).data('type') == 'file') {
            $('#cloud-manager-upload').data('url', $(this).data('url'));
        }
        e.preventDefault();
        return false;
    });

    // delete file or folder
    $('#cloud-manager-delete').on('click', function () {
        if (!$(this).data('type') || !$(this).data('id')) {
            return;
        }
        if (!confirm(cloudLocale.confirm)) {
            return;
        }
        $.post(cloudURL.delFolder, {id: $(this).data('id')}, function (response) {
            location.reload(false);
        });
    });

    // upload file
    $('#cloud-manager-upload').on('click', function () {
        var url = $(this).data('url');
        if (!url) {
            return;
        }
        if(url.indexOf("/preview/") > 0){
            url = url.replace("/preview/", "/download/");
        }
        location.href = url;
    });

    // uploader
    $('#cloud-manager-upload-btn').click(function () {
        $('#cloud-manager-upload-input').click();
    });

    $('#cloud-manager-upload-input').fileupload({
        url: mediaURL.upload,
        dataType: 'json',
        done: function (e, data) {
            var file = data.result.files[0];
            if(file.hasOwnProperty('error') && file['error'] == 'File Storage limit exceeded') {
                var temp = $('#cloud-manager-list .item .filetype');
                var temp_parent = temp.parent().has('.progress');
                temp_parent.empty().html('<div style="color: red;">' + file['error'] + '</div>');
                setTimeout(function () {
                    temp_parent.fadeOut('slow', function () {
                        temp_parent.remove();
                    })
                }, 3000);
                return false;
            }
            file.object_type = $(data.fileInput).data('object_type');
            file.object_id = $(data.fileInput).data('object_id');
            $.post(mediaURL.move, file, function (response) {
                var newFile = {
                    Cloud: {
                        media_id: response.data[0].Media.id,
                        name: response.data[0].Media.orig_fname,
                        parent_id: file.object_id
                    }
                };

				$.post(cloudURL.addFolder, newFile, function () {
					if (--Cloud.managerUploadCounter == 0) {
						location.reload();
						//if ((file.type.indexOf('video')+1)) {
						//	$('.show-after-upload').fadeIn(400);
						//} else {
						//	location.reload(false);
						//}
					}
				});


            });
        },
        add: function (e, data) {
            //if( !!window.preventUpload || window.preventUpload == true) {
            //    return false;
            //}

            //window.preventUpload = true;

            var ul = $('#cloud-manager-list');
            var fileType = data.files[0].name.split('.').pop().toLowerCase().replace('jpeg', 'jpg');
            var $tpl = $('#cloud-manager-tpl-file-upload .item').clone();
            var fileClass = Cloud.hasType(fileType) ? 'filetype ' + fileType : 'glyphicons file';
            $tpl.find('.filetype').attr('class', fileClass);
            $tpl.find('.title').text(data.files[0].name);
            data.context = $tpl.prependTo(ul);
            Cloud.managerUploadCounter++;
            data.submit();
        },
        progress: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.context.find('.percentage').html(progress + '%');
            data.context.find('.progress-bar').attr('style', 'width: ' + progress + '%');
        },
        fail: function (e, data) {
            if(data.jqXHR.status = 403){
                $('#space-notification-modal').modal('show');
            }
        }
    });

    // move
    $('#cloud-manager-move').on('click', function () {
        if (!$(this).data('what')) {
            return;
        }
        $('#cloud-manager-move-modal').modal('show');
    });

    $('#cloud-manager-move-modal').on('shown.bs.modal', function () {
        CloudManagerMover.render($('#cloud-manager-move'));
        $('body').css("position","fixed");
    });

    $('#cloud-manager-move-modal').on('hide.bs.modal', function () {
        $('#cloud-manager-move-modal .modal-content').html('');
        $('.foldersFilesList').getNiceScroll().hide();
        $('body').css("position","static");
    });

    // share
    $('#cloud-manager-share').on('click', function () {
        if (!$(this).data('link')) {
            return;
        }
        $('#cloud-manager-share-modal .link').text($(this).data('link'));
        $('#cloud-manager-share-modal').modal('show');
    });
    $('#cloud-manager-share-modal').on('hide.bs.modal', function () {
        $('#cloud-manager-share-modal .link').text('');
    });
});

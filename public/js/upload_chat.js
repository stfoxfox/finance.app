var files_data = [], fileCount = 0;
var acceptedExt = [ 'jpg', 'png', 'gif' ];

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

function chatImageInit(id, data) {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(data.files[0]);
    //console.log(oFReader);
    oFReader.onload = function (oFREvent) {

        $('#' + id + ' .tempImg').prepend('<img src="/img/fancybox/blank.gif" alt="" />');
        var img = $('#' + id + ' .tempImg img').get(0);
        $(img).prop('src', oFREvent.target.result);
        var count = 0;
        var timer = setInterval(function(){
/*          var iW = img.width, iH = img.height;
               if (count > 50) {
                   alert('Your photo is too large. Please upload another one');
               }
               if (iW < 5) {
                   count++;
                   return;
               }
               clearInterval(timer);
*/
        /*    var imageLeftOffset = -(84*iW/iH - 84)/2;
            var imageTopOffset = -(84*iH/iW - 84)/2;

            if (iW > iH) {
                $(img).css('max-height', '100%');
                $(img).css('margin-left', imageLeftOffset);
            } else {
                $(img).css('max-width', '100%');
                $(img).css('margin-top', imageTopOffset);
            }
            $(img).data(data);
*/
           }, 100);
        $(img).data(data);
    }
}

$(function () {
    $('.fileuploader').fileupload({
        url: mediaURL.upload,
        dataType: 'json',
        done: function (e, data) {
            files_data.push(data.result.files[0]);
            if (files_data.length == $('.preloadArea').length) {
                Chat.Panel.rooms[Chat.Panel.activeRoom].sendFiles(files_data);
                files_data = [];
                fileCount = 0;
            }
        },
        add: function (e, data) {
            if (e.isDefaultPrevented()) {
                return false;
            }
            fileCount++;
            var type = getFileType(data.files[0]);
            var id = 'chat-file_' + fileCount;
            $('#chatUploadFiles').append(tmpl('preload-chat-file', {id: id, type: type}));
            data.context = id;
            if ($.inArray(type, ['jpg', 'jpeg', 'png', 'gif']) > -1) {
                chatImageInit(id, data);
            } else {
                $('#' + id + ' span.filetype').data(data);
            }
            Chat.fixPanelHeight();
        },
        progress: function (e, data) {
            var progress = Math.floor(data.loaded / data.total * 100);
            $('.progress .progress-bar', $('#' + data.context).get(0)).css('width', progress + '%');
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            // $('.progress .progress-bar').css('width', progress + '%');
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
});

$(function() {
    tinymce.init({
        selector: '.tiny-mce',
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code cloudfilemanager'
        ],
        media_live_embeds: true,
        autoresize_on_init: true,
        relative_urls: false,
        image_advtab: true,
        menubar: false,
        external_filemanager_path:"/Cloud/index",
        filemanager_title: "File manager" ,
        toolbar: 'bold italic underline strikethrough | link blockquote media code | bullist numlist  aligncenter alignleft alignright | undo redo | cloudfilemanager fullscreen'
    });
});
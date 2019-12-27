/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*jshint unused:false */
/*global tinymce:true */

/**
 * Example plugin that adds a toolbar button and menu item.
 */
tinymce.PluginManager.add('cloudfilemanager', function(editor, url) {
	var is_opened = false;
	// Add a button that opens a window
	editor.addButton('cloudfilemanager', {
		text: 'Cloud',
		icon: 'folder',
		onclick: function() {
			if (!is_opened) {
				// Open window
				editor.windowManager.open({
					title: myFilesTitle ? myFilesTitle : 'My files',
					width: 600,
					height: 400,
					file: '/Cloud/fortiny',
					buttons: [
						{
							text: myFilesInsert,
							onclick: function () {
								// Top most window object
								var win = editor.windowManager.getWindows()[0];
								var winElement = win.getContentWindow().document.querySelector('#cloud-list .cloud-list_item.cloud-list_item-selected');
								//var winElement2 = win.getContentWindow().document.querySelector('.cloud-list_item-selected');
								//alert(winElement2);
								if (winElement) {
									var winElementMedia = winElement.getAttribute('data-download');
									var winElementType = winElement.getAttribute('data-type');
									var winElementUrl = winElement.getAttribute('data-url');
									var winElementText = winElement.getAttribute('data-name');
									var winElementExt = winElement.getAttribute('data-ext');
									if (winElementType == 'file' && typeof winElementMedia != 'undefined' && winElementMedia != null && winElementMedia != 'false') {
										editor.insertContent('<img src="' + winElementMedia + '"/>');
										win.close();
										is_opened = false;
									} else if (winElementType == 'file' && (winElementExt == 'mp4' || winElementExt == 'ogg' || winElementExt == 'wmv' || winElementExt == 'avi' || winElementExt == 'webm')) {

										editor.insertContent('<video src="' + winElement.getAttribute('data-download') + '" controls preload></video>');
										win.close();
										is_opened = false;
									} else if (winElementType == 'file') {
										editor.insertContent('<a href="' + winElementUrl + '">' + winElementText + '</a>');
										win.close();
										is_opened = false;
									} else {
										alert('Выбраный элемент должен быть файлом а не папкой.')
									}
								} else {
									alert('Не выбран файл!')
								}

							}
						},

						{text: myFilesClose, onclick: function(){
							var win = editor.windowManager.getWindows()[0];
							win.close();
							is_opened = false;
						}}
					],
					onsubmit: function (e) {
						// Insert content when the window form is submitted
						editor.insertContent('Title: ' + e.data.title);
						is_opened = false;
					},
					onclose: function(e) {
						is_opened = false;
					}
				});
			}

			//set flag `opened`:
			is_opened = true;
		}
	});
});

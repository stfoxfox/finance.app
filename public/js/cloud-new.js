var cloudSelectedAll = {};
var cloudSelectedFile = {};
var cloudSelectedFolder = {};

var isTouchDevice = 'ontouchstart' in document.documentElement;

function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
	options = options || {};

	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie  + '; path=/;';
}

$(document).ready(function() {
	// console.log(mediaURL.upload);
	if($('#acceptedFiles').length){
		var acceptedFiles = $('#acceptedFiles').text();
	}else{
		var acceptedFiles = ".txt, .doc, .rtf, .log, .tex, .msg, .text, .wpd, .wps, .docx, .page, .csv, .dat, .tar, .xml, .vcf, .pps, .key, .ppt, .pptx, .sdf, .gbr, .ged, .mp3, .m4a, .waw, .wma, .mpa, .iff, .aif, .ra, .mid, .m3v, .e_3gp, .shf, .avi, .asx, .mp4, .e_3g2, .mpg, .asf, .vob, .wmv, .mov, .srt, .m4v, .flv, .rm, .png, .psd, .psp, .jpg, .jpeg, .tif, .tiff, .gif, .bmp, .tga, .thm, .yuv, .dds, .ai, .eps, .ps, .svg, .pdf, .pct, .indd, .xlr, .xls, .xlsx, .db, .dbf, .mdb, .pdb, .sql, .aacd, .app, .exe, .com, .bat, .apk, .jar, .hsf, .pif, .vb, .cgi, .css, .js, .php, .xhtml, .htm, .html, .asp, .cer, .jsp, .cfm, .aspx, .rss, .csr, .less, .otf, .ttf, .font, .fnt, .eot, .woff, .zip, .zipx, .rar, .targ, .sitx, .deb, .e_7z, .pkg, .rpm, .cbr, .gz, .dmg, .cue, .bin, .iso, .hdf, .vcd, .bak, .tmp, .ics, .msi, .cfg, .ini, .prf";
	}
	// загрузка файла -->
	var cloudDropzone = new Dropzone(document.body, {
		url: "/media/ajax/upload",
		autoProcessQueue: true,
		paramName : 'files',
		uploadMultiple: false,
		acceptedFiles: acceptedFiles,
		previewsContainer: "#cloud-list",
		clickable: '#cloud-nav_upload',
		thumbnailWidth: 198,
		thumbnailHeight: 100,
		previewTemplate: document.getElementById('preview-template').innerHTML
	});

	cloudDropzone.on("addedfile", function(file) {
		console.log('addedfile');

		// добавляем расширение файла
		var extension = file.name.split('.').pop();
		$(file.previewElement).find('.cloud-list_item-title .filetype').text(extension);
		$(file.previewElement).find('.cloud-list_item-preview').addClass(extension);
		//в начала списка
		//$(file.previewElement).detach();
		$(".cloud-list_item--clear").after(file.previewElement);
	});

	cloudDropzone.on("processing", function(file) {
		console.log('processing');

		// показываем загруженные файлы
		$(file.previewElement).removeClass('cloud-list_item--hide');
	});

	cloudDropzone.on("uploadprogress", function() {
		console.log('uploadprogress');
	});

	cloudDropzone.on("success", function(file, response) {
		console.log(file);
		if( typeof response != 'object' ) {
			response = $.parseJSON(response);
		}
		var moveImage = response.files[0];
		moveImage.object_type = 'Cloud';
		if(parseInt($('#cloud-nav_upload').attr('data-parent')) > 0){
			moveImage.parent_id = parseInt($('#cloud-nav_upload').attr('data-parent'));
		}
		var ret = '';

		$.ajax({
			type: "POST",
			url: "/media/ajax/move.json",
			dataType: "JSON",
			data: moveImage,
			success: function(response) {
				//console.log(response);
				$(file.previewElement).addClass('js_cloud-list_item');
				$(file.previewElement).attr('data-id',response.Cloud.id);
				$(file.previewElement).attr('data-type','file');
				$(file.previewElement).attr('data-table','cloud');
				$(file.previewElement).attr('data-ext',response.Media.ext.replace('.',''));
				$(file.previewElement).attr('data-download',window.location.protocol + '//' + window.location.hostname + response.Media.url_download);
				$(file.previewElement).attr('data-url',window.location.protocol + '//' + window.location.hostname + '/File/preview/' + response.Media.id);
				if(response.Media.media_type == 'image' && response.Media.url_img) {
					$(file.previewElement).attr('data-media',response.Media.url_img);
				}
				$(file.previewElement).attr('data-size',response.Media.orig_fsize);
				$(file.previewElement).attr('data-name',response.Media.orig_fname);
				$(file.previewElement).attr('data-created',Math.round(new Date(response.Cloud.created).getTime()/1000));

				$(file.previewElement).attr('data-media-id',response.Media.id);
				$(file.previewElement).attr('data-media-type',response.Media.type);
				$(file.previewElement).attr('data-crop',response.Media.crop);
				$(file.previewElement).attr('data-media-download',response.Media.url_download);
				$(file.previewElement).attr('data-export-url',response.Media.url_download);
                //$('div[data-id='+response.Cloud.id+'] .close__').attr('data-id',response.Cloud.id);
				initDrag();
			},
			error: function() {
				ret = 'error'
			}
		});

		// убираем progressbar после загрузки
		window.setTimeout(function(){
			$(file.previewElement).find('.cloud-list_progress').addClass('cloud-list_progress--hide');

			window.setTimeout(function(){
				$(file.previewElement).find('.cloud-list_progress').remove();
			}, 400);
		}, 600);
	});

	// все файлы загруженны
	cloudDropzone.on("queuecomplete", function() {
		console.log('все файлы загруженны');
	});

	// все файлы загруженны
	cloudDropzone.on("error", function(file, response) {
		cloudDropzone.removeFile(file);
		$.magnificPopup.open({
			items: {
				src: '#subscribes-popup',
				type: 'inline'
			},
			removalDelay: 300,
			mainClass: 'zoom-in'
		});
		//console.log(response);
	});
	// <-- загрузка файла


	// Выделение файла -->
	function getSize(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	}

	function toggleFileHandlerNav() {
		var header = $('.cloud-nav');
		$('.cloud-nav_file-handler').removeClass('cloud-nav_file-handler--visible');
		header.removeClass('height160');

		if(getSize(cloudSelectedFolder) == 0 && getSize(cloudSelectedFile) == 1){
			// если выделен только 1 файл и 0 папок (можно расшарить, скачать, просмотреть, удалить, распечатать)
			$('.cloud-nav_share, .cloud-nav_download, .cloud-nav_watch, .cloud-nav_print, .cloud-nav_trash').addClass('cloud-nav_file-handler--visible');
			header.addClass('height160');
		} else if (getSize(cloudSelectedFolder) == 0 && getSize(cloudSelectedFile) > 1) {
			// если выделено несколько файлов и 0 папок (можно удалить, скачать)
			$('.cloud-nav_download, .cloud-nav_trash').addClass('cloud-nav_file-handler--visible');
			header.addClass('height160');
		} else if (getSize(cloudSelectedFolder) > 0 && getSize(cloudSelectedFile) > 0) {
			// если выделены и файл и папка одновременно (можно удалить)
			$('.cloud-nav_trash').addClass('cloud-nav_file-handler--visible');
			header.addClass('height160');
		} else if (getSize(cloudSelectedFolder) == 1 && getSize(cloudSelectedFile) == 0) {
			// если выделена только 1 папка и 0 файлов (можно расшарить, просмотреть, удалить)
			$('.cloud-nav_share, .cloud-nav_watch, .cloud-nav_trash').addClass('cloud-nav_file-handler--visible');
			header.addClass('height160');
		} else if (getSize(cloudSelectedFolder) > 1 && getSize(cloudSelectedFile) == 0) {
			// если выделено несколько папок и 0 файлов (можно удалить)
			$('.cloud-nav_trash').addClass('cloud-nav_file-handler--visible');
			header.addClass('height160');
		}
	}

	function selectItem(item, action){
		if(action === true){
			cloudSelectedAll[item.id] = item;
		} else if (action === false) {
			delete cloudSelectedAll[item.id];
		}

		console.log(cloudSelectedAll);

		var selectedCount = getSize(cloudSelectedAll);

		cloudSelectedFolder = {};
		cloudSelectedFile = {};

		if(selectedCount) {
			for (key in cloudSelectedAll) {
				if(cloudSelectedAll[key].type == 'folder') {
					cloudSelectedFolder[cloudSelectedAll[key].id] = cloudSelectedAll[key];
				} else if (cloudSelectedAll[key].type == 'file') {
					cloudSelectedFile[cloudSelectedAll[key].id] = cloudSelectedAll[key];
				}
			}
		}

		// console.log(cloudSelectedFolder);
		// console.log(cloudSelectedAll);
	}

	$('body').on('click', '.js_cloud-list_item', function(event) {
		event.preventDefault();

		var itemID = $(this).data('id');
		var itemSRC = $(this).data('url');
		var itemDownload = $(this).data('download');
		var itemType = $(this).data('type');
		var itemExt = $(this).data('ext');
		var itemTable = $(this).data('table');
		var itemTarget = this;

		var item = {
			id: itemID,
			src: itemSRC,
			download: itemDownload,
			type: itemType,
			table: itemTable,
			ext: itemExt,
			el: itemTarget
		};

		if($(this).hasClass('cloud-list_item-selected')){
			$(this).removeClass('cloud-list_item-selected');
			selectItem(item, false);
		} else {
			$(this).addClass('cloud-list_item-selected');
			selectItem(item, true);
		}

		toggleFileHandlerNav();
	});
	// <-- Выделение файла


	// меняем вид отображения -->
	var viewMode = getCookie('viewMode');

	if(viewMode && viewMode == 'table'){
		$('#cloud-list').removeClass('grid-mode').addClass('table-mode');
		$('.cloud-list-holder').removeClass('cloud-list--hide');
		$('.cloud-nav_mode').removeClass('cloud-nav_mode--grid').addClass('cloud-nav_mode--table');
	} else {
		$('#cloud-list').removeClass('table-mode').addClass('grid-mode');
		$('.cloud-list-holder').removeClass('cloud-list--hide');
		$('.cloud-nav_mode').removeClass('cloud-nav_mode--table').addClass('cloud-nav_mode--grid');
	}

	$('.cloud-nav_mode').on('click', function(event) {
		event.preventDefault();

		if($('#cloud-list').hasClass('grid-mode')){
			$('.cloud-list-holder').addClass('cloud-list--hide');

			window.setTimeout(function(){
				$('.cloud-list-holder').removeClass('cloud-list--hide');
				$('#cloud-list').removeClass('grid-mode').addClass('table-mode');
			}, 450);

			$('.cloud-nav_mode').removeClass('cloud-nav_mode--grid').addClass('cloud-nav_mode--table');
			setCookie('viewMode', 'table');
		} else {
			$('.cloud-list-holder').addClass('cloud-list--hide');

			window.setTimeout(function(){
				$('.cloud-list-holder').removeClass('cloud-list--hide');
				$('#cloud-list').removeClass('table-mode').addClass('grid-mode');
			}, 450);

			$('.cloud-nav_mode').removeClass('cloud-nav_mode--table').addClass('cloud-nav_mode--grid');
			setCookie('viewMode', 'grid');
		}
	});
	// <-- меняем вид отображения


	// context-menu -->
	var $contextMenu = $('#context-menu');
	var contextMenuState = 0;
	var contextMenuSelectData = {};

	function setSelectedData(el) {
		contextMenuSelectData = {};

		contextMenuSelectData[$(el).data('id')] = {
			id: $(el).data('id'),
			src: $(el).data('url'),
			download: $(el).data('download'),
			type: $(el).data('type'),
			table: $(el).data('table'),
			ext: $(el).data('ext'),
			el: el
		};

		// убираем выделение
		$('.cloud-list_item').removeClass('cloud-list_item-selected');

		cloudSelectedAll = {};
		cloudSelectedFolder = {};
		cloudSelectedFile = {};
	}

	function toggleContextMenuOn(el) {
		$contextMenu.addClass('context-menu--active');
		contextMenuState = 1;
		setSelectedData(el);

		for (key in contextMenuSelectData) {
			if(contextMenuSelectData[key].type == 'folder') {
				$('.context-menu_item--file').css('display', 'none');
			} else if (contextMenuSelectData[key].type == 'file') {
				$('.context-menu_item--file').css('display', 'block');
			}
		}

		$('.cloud-list_item').removeClass('cloud-list_item--context-select');
		$(el).addClass('cloud-list_item--context-select');
	}

	function toggleContextMenuOff(el) {
		$contextMenu.removeClass('context-menu--active');
		contextMenuState = 0;
		$('.cloud-list_item').removeClass('cloud-list_item--context-select');
	}

	function getContextMenuPosition(event) {
		var posx = 0;
		var posy = 0;

		if (event.pageX || event.pageY) {
			posx = event.pageX;
			posy = event.pageY;
		} else if (event.clientX || event.clientY) {
			posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		} else if(event.originalEvent.changedTouches[0].pageX || event.originalEvent.changedTouches[0].pageY){
			posx = event.originalEvent.changedTouches[0].pageX;
			posy = event.originalEvent.changedTouches[0].pageY;
		}

		return {x: posx, y: posy};
	}

	function setContextMenuPosition(event) {
		var menuPosition = getContextMenuPosition(event);

		var menuPositionX = menuPosition.x;
		var menuPositionY = menuPosition.y;
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		var documentHeight = $(document).height();

		var menuWidth = $contextMenu[0].offsetWidth + 25;
		var menuHeight = $contextMenu[0].offsetHeight + 10;

		if ( (windowWidth - menuPositionX) < menuWidth ) {
			$contextMenu[0].style.left = windowWidth - menuWidth + "px";
		} else {
			$contextMenu[0].style.left = menuPositionX + "px";
		}

		console.log($('.wrapper-container').outerHeight() - menuPositionY);
		console.log(menuHeight);

		if ( ($('.wrapper-container').outerHeight() - menuPositionY) < (menuHeight - 80) ) {
			console.log(1);
			$contextMenu[0].style.top = $('.wrapper-container').outerHeight() - menuHeight + "px";
		} else if(((windowHeight + $(window).scrollTop()) - menuPositionY) < menuHeight) {
			console.log(2);
			$contextMenu[0].style.top = (windowHeight + $(window).scrollTop()) - menuHeight + "px";
		} else {
			console.log(3);
			$contextMenu[0].style.top = menuPositionY + "px";
		}
	}

	$('body').on('contextmenu', '.js_cloud-list_item', function(event) {
		event.preventDefault();
		toggleContextMenuOn(this);
		setContextMenuPosition(event);

		//console.log(contextMenuSelectData);
	});

	$('body').on('contextmenu click', function(event) {
		if(event.type == 'contextmenu' && !$(event.target).hasClass('.cloud-list_item') && !$(event.target).closest('.cloud-list_item').length){
			toggleContextMenuOff();
		} else if (event.type == 'click' && !isTouchDevice) {
			if(!$(event.target).hasClass('context-menu_link')) {
				toggleContextMenuOff();
			}
		}
	});

	$('body').on('touchstart', function(event) {
		if(!$(event.target).hasClass('context-menu_link')) {
			toggleContextMenuOff();
		}
	});

	$('.context-menu_link').on('click', function(event) {
		var action = $(this).data('action');

		switch (action) {
			case 'share':
				cloudShare(contextMenuSelectData);
				break;
			case 'move':
				cloudMove(contextMenuSelectData);
				break;
			case 'rename':
				cloudRename(contextMenuSelectData);
				break;
			case 'show':
				cloudView(contextMenuSelectData);
				break;
			case 'copy':
				cloudClone(contextMenuSelectData);
				break;
			case 'download':
				cloudDownload(contextMenuSelectData);
				break;
			case 'delete':
				cloudDelete(contextMenuSelectData);
				break;
		}

		window.setTimeout(function(){
			toggleContextMenuOff();
		}, 200);
	});
	// <-- context-menu


	// создание файла / папки -->
	$('body').on('click', function(event) {
		if(!$(event.target).hasClass('cloud-nav_create-btn')) {
			$('.cloud-nav_create-list').removeClass('cloud-nav_create-list--visible');
		} else {
			$('.cloud-nav_create-list').toggleClass('cloud-nav_create-list--visible');
		}
	});

	$('body').on('click', '.cloud-nav_create-list-item', function(event) {
		event.preventDefault();

		if($(this).data('type') == 'folder'){
			$.magnificPopup.open({
				items: {
					src: '#createFolderPopup',
					type: 'inline'
				},
				removalDelay: 300,
				mainClass: 'zoom-in'
			});
		} else if ($(this).data('type') == 'file') {
			window.location.href = "/Cloud/documentEdit";
		}
	});

	$('body').on('click', '.new-folder_btn', function(event) {
		event.preventDefault();

		var folderTitle = $('.new-folder_name').val();
		var idFolder, urlFolder, sizeFolder;
		$form = $('#createFolderPopup input');

		$.ajax({
				url: cloudURL.addFolder,
				type: 'POST',
				dataType: 'JSON',
				data: $form.serialize()
			})
			.success(function(response){
				$('.new-folder_name').val('');

				if(response.Cloud.id){
					idFolder = response.Cloud.id;
				}
				if(response.Media.url_folder){
					urlFolder = response.Media.url_folder;
				}
				if(response.Cloud.size_folder!='undefined'){
					sizeFolder = response.Cloud.size_folder;
				}

				var newFolder = $('<div class="cloud-list_item js_cloud-list_item cloud-list_item-folder" data-url="' + urlFolder + '" data-id="' + idFolder + '" data-table="cloud" data-type="folder" data-size="0" data-name="'+folderTitle+'" data-created="' + Math.round(new Date(response.Cloud.created).getTime()/1000) + '">'
					+ '<div class="cloud-list_item-title"><span class="title">'+folderTitle+'</span></div>'
					+ '<div class="cloud-list_item-size">' + sizeFolder + '</div>'
					+ '<div class="cloud-list_item-share"><div class="share-item_button">+</div></div>'
					+ '</div>');

				newFolder.insertBefore('.cloud-list_item--clear');
			});

		$.magnificPopup.close();
	});

	$('body').on('click', '.new-folder_close', function(event) {
		event.preventDefault();
		$.magnificPopup.close();
	});
	// <-- создание файла / папки


	// удаление -->
	function cloudDelete(data) {

		var idsArrC = [];
		var idsArrN = [];

		for (key in data) {
			$(data[key].el).remove();

			if(data[key].table=='cloud')
				idsArrC.push(data[key].id);

			if(data[key].table=='note')
				idsArrN.push(data[key].id);
		}

		cloudSelectedAll = {};
		cloudSelectedFolder = {};
		cloudSelectedFile = {};
		toggleFileHandlerNav();
		$.ajax({
				url: cloudURL.delFolder,
				type: 'POST',
				dataType: 'JSON',
				data: { idsC:idsArrC, idsN:idsArrN }
			})
			.success(function(response){
				console.log('файл удален');
			});
	};
	// <-- удаление


	// скачать -->
	function cloudDownload(data, context) {

		var url, link = document.createElement('a');
		link.style.display = 'none';
		document.body.appendChild(link);

		for (key in data) {
			if(data[key].type == 'file') {
				url = data[key].download;

				// url = url.replace("/preview/", "/download/");
				// url = url.replace("/documentView/", "/documentDownload/");
				link.setAttribute('href', url);
				link.setAttribute('target', '_blank');
				// link.setAttribute('download', url.substring(url.lastIndexOf('/') + 1, url.length));
				link.setAttribute('download', $($(data[key].el).find('.title span')[1]).text());

				link.click();
			} else {
				infoPopup('folder cant be downloaded');
			}
		}

		// document.body.removeChild(link);
	};
	// <-- скачать

	// просмотр -->
	function cloudView(data) {
		for (key in data) {

			var ext = data[key]['ext'];
			var src = data[key]['src'];
			var path = data[key]['download'];
			var table = data[key]['note'];

			if(ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif') {
				$.magnificPopup.open({
					items: {
						src: path,
						type: 'image'
					},
					removalDelay: 300,
					mainClass: 'zoom-in'
				});
			} else if((ext == 'docx' || ext == 'pdf' || ext == 'doc' || ext == 'xls' || ext == 'xlsx' || ext == 'txt') && isTouchDevice && table == 'cloud') {
				window.open(path);
			} else {
				window.location.href = src;
			}

		}
	}
	// <-- просмотр


	// печать -->
	function cloudPrint(data) {
		console.log(data);

		for (key in data) {
			if(data[key].type == 'file') {
				if(data[key].ext == 'pdf' || data[key].ext == 'png' || data[key].ext == 'jpg'){
					var url = data[key].download;

					var printFrame = document.getElementById('printFrame');
					printFrame.setAttribute('src', url); // printFrame.focus();

					printFrame.onload = function() {
						printFrame.contentWindow.print();
					};
				} /*else if(data[key].ext == 'docx' || data[key].ext == 'doc' || data[key].ext == 'xls' || data[key].ext == 'xlsx' || data[key].ext == 'txt') {
				 // var url = 'http://docs.google.com/viewer?url=' + data[key].download + '&embedded=true';
				 var url = "https://docs.google.com/viewer?url=http://konstruktor.wezom.ks.ua/files/cloud/2/271/bin_file.docx&embedded=true";

				 var printFrame = document.getElementById('printFrame');
				 printFrame.setAttribute('src', url); // printFrame.focus();
				 printFrame.onload = function() {
				 console.log(printFrame.contentWindow);
				 // printFrame.contentWindow.print();
				 };
				 } */ else {
					infoPopup('You can\'t print this file');
				}
			} else {
				infoPopup('folder can\'t be print');
			}
		}
	}
	// <-- печать


	// переместить -->
	var moveFolderSelected;

	function setFolderData(data) {
		var folderList = $('#move-list');
		folderList.html('');

		for(var i = 0; i < data.length; i++){
			if(data[i].type == 'folder'){
				var item = $('<li class="move-list_item move-list_item--folder" data-folder="' + data[i].id + '">' + data[i].title + '</li>');
				folderList.append(item);
			} else if(data[i].type == 'file'){
				var ext = data[i].title.split('.').pop();
				var item = $('<li class="move-list_item move-list_item--file"><span>' + ext + '</span>' + data[i].title + '</li>');
				folderList.append(item);
			}
		}
	}

	var rootTitle = '';
	var parent_id = 0;
	var curFolderId = 0;
	var startFId = $('.cloud-nav').data('fid');

	var initCustomScroll = false;

	function cloudMove(data) {
		$.magnificPopup.open({
			items: {
				src: '#movePopup',
				type: 'inline'
			},
			removalDelay: 300,
			mainClass: 'zoom-in',
			callbacks: {
				beforeOpen: function () {
					// имя папки получить аяксом
					$('.move_popup .move_title').text(rootTitle);
					console.log(data);
					$.ajax({
							url: cloudURL.getListByParent,
							type: 'POST',
							dataType: 'JSON',
							data: {
								parent_id : parent_id
							}
						})
						.success(function(response){
							if(!$.isEmptyObject(response.parentFolder)){
								parent_id = response.parentFolder.parent_id;
								rootTitle = response.parentFolder.title;
								curFolderId = response.parentFolder.id;
							}else{
								curFolderId = 0;
								rootTitle = '';
								parent_id = 0;
							}
							console.log(curFolderId);
							// ajax -> список папок -> success
							setFolderData(response.cloud);

							if(!initCustomScroll){
								$("#movePopup .move-scroll").mCustomScrollbar({
									autoDraggerLength: false
								});

								initCustomScroll = true;
							} else {
								$("#movePopup .move-scroll").mCustomScrollbar("update");
							}

							// <- success
						});
				},
				afterClose: function () {
					//$("#movePopup .move-scroll").mCustomScrollbar("disable");
				}
			}
		});

		$('body').off('click', '.move_btn--active');

		$('body').on('click', '.move_btn--active', function () {
			var fileID, movedEl, table;

			for(key in contextMenuSelectData){
				fileID = contextMenuSelectData[key].id;
				table = contextMenuSelectData[key].table;
				movedEl = contextMenuSelectData[key].el;
			}

			if(moveFolderSelected){
				var moveTo = moveFolderSelected;
			}else{
				var moveTo = curFolderId;
			}

			$.ajax({
					url: cloudURL.move,
					type: 'POST',
					dataType: 'JSON',
					data: {
						id : fileID,
						parentId : moveTo,
						table: table
					}
				})
				.success(function(response){
					$.magnificPopup.close();
					if(moveTo == undefined){
						moveTo = 0;
					}
					if(startFId*1 != moveTo*1){
						movedEl.remove();
					}
					if($('#controller-action').val()=='trash'){
						movedEl.remove();
					}
				});
		});

		$('body').on('click', '.move_close', function () {
			$.magnificPopup.close();
		});
	}

	var folderID;

	$('body').on('click', '.move-list_item--folder', function(){
		folderID = $(this).data('folder');
		$(this).siblings().removeClass('move-list_item--selected');

		if($(this).hasClass('move-list_item--selected')){
			$(this).removeClass('move-list_item--selected');
			moveFolderSelected = false;
		} else {
			$(this).addClass('move-list_item--selected');
			moveFolderSelected = $(this).data('folder');
		}

		/*if(moveFolderSelected){
		 $('.move_btn').removeClass('move_btn--disable').addClass('move_btn--active');
		 } else {
		 $('.move_btn').removeClass('move_btn--active').addClass('move_btn--disable');
		 }*/
	});

	$('body').on('dblclick', '.move-list_item--folder', function(){
		folderID = $(this).data('folder');

		$.ajax({
				url: cloudURL.getListByParent,
				type: 'POST',
				dataType: 'JSON',
				data: {
					parent_id : folderID
				}
			})
			.success(function(response){
				if(response.parentFolder){
					parent_id = response.parentFolder.parent_id;
					rootTitle = response.parentFolder.title;
					curFolderId = response.parentFolder.id;
					$('.move_popup .move_back-button').attr('data-folder',parent_id);
					$('.move_popup .move_title').text(rootTitle);
				}
				// ajax -> список папок -> success
				setFolderData(response.cloud);
				$("#movePopup .move-scroll").mCustomScrollbar("update");
				// <- success
			});
	});

	$('body').on('click', '.move_back-button', function(){
		$.ajax({
				url: cloudURL.getListByParent,
				type: 'POST',
				dataType: 'JSON',
				data: {
					parent_id : parent_id
				}
			})
			.success(function(response){
				if(response.parentFolder.title){
					parent_id = response.parentFolder.parent_id;
					rootTitle = response.parentFolder.title;
					curFolderId = response.parentFolder.id;
					$('.move_popup .move_title').text(rootTitle);
				}else{
					$('.move_popup .move_back-button').removeAttr('data-folder');
					$('.move_popup .move_title').text('');
				}
				// ajax -> список папок -> success
				setFolderData(response.cloud);
				$("#movePopup .move-scroll").mCustomScrollbar("update");
				// <- success
			});
	});
	// <-- переместить


	// переименовать -->
	function getCurrName(el) {
		/*var title = el.find('.cloud-list_item-title .title').html();
		 title = title.split('>').pop().split('.');
		 title.pop();
		 title = title.join('.');*/

		var title = el.find('.cloud-list_item-title .title span:nth-child(2)').text().split('.');
		title.pop();
		title = title.join('.');
		return title;
	}

	function cloudRename(data) {
		var el, id, ext, type, currTitle, table;

		for (key in data) {
			el = $(data[key].el);
			ext = data[key].ext;
			id = data[key].id;
			type = data[key].type;
			table = data[key].table;

			if(data[key].type == 'file'){
				currTitle = getCurrName(el);
			} else if (data[key].type == 'folder') {
				currTitle = el.find('.cloud-list_item-title .title').text();
			}
		}

		$.magnificPopup.open({
			items: {
				src: '#renamePopup',
				type: 'inline'
			},
			removalDelay: 300,
			mainClass: 'zoom-in',
			callbacks: {
				beforeOpen: function() {
					$('.rename-folder_name').val(currTitle);
				},
				afterClose: function() {
					$('.rename-folder_btn, .rename-folder_close').off('click');
					$('.rename-folder_name').val('');
				}
			}
		});

		$('body').off('click', '.rename-folder_btn');

		$('body').on('click', '.rename-folder_btn', function(event) {
			event.preventDefault();
			if(data[key].type == 'file'){
				var newTitle = $('.rename-folder_name').val() + '.' + ext;
			} else if (data[key].type == 'folder') {
				var newTitle = $('.rename-folder_name').val();
			}

			$.magnificPopup.close();
			$.ajax({
					url: cloudURL.rename,
					type: 'POST',
					dataType: 'JSON',
					data: {
						id : id,
						newTitle : newTitle,
						table : table
					}
				})
				.success(function(response){
					if(type == 'file') {
						el.find('.cloud-list_item-title .title').html('<span class="filetype">' + ext + '</span><span>' + newTitle+'</span>');
					} else if (type == 'folder') {
						el.find('.cloud-list_item-title .title').html(newTitle);
					}
				});
		});

		$('body').on('click', '.rename-folder_close', function(event) {
			event.preventDefault();
			$.magnificPopup.close();
		});
	}
	// <-- переименовать


	// дублировать -->
	function cloudClone(data) {
		for (key in data) {
			var cloneItem = $(data[key].el).clone();

			if(data[key].type == 'file') {
				$.ajax({
						url: cloudURL.clone,
						type: 'POST',
						dataType: 'JSON',
						data: {
							id : data[key].id,
							table : data[key].table
						}
					})
					.success(function(response) {
						// вернуть data-id, data-url, data-download
						cloneItem.attr('data-id', response.id);
						cloneItem.attr('data-url', response.url);
						cloneItem.attr('data-download', response.download);
						if(response.newTitle){
							cloneItem.find('.title').html('<span class="filetype">' + data[key].ext + '</span><span>' + response.newTitle + '</span>');
						}
						cloneItem.appendTo('#cloud-list');
					});
			} else if (data[key].type == 'folder') {
				infoPopup('мы не можем клонировать папку');
			}
		}
	}
	// <-- дублировать

	$('body').on('click', '.cloud-nav_file-handler', function(event) {
		event.preventDefault();

		var action = $(this).data('action');

		switch (action) {
			case 'share':
				cloudShare(cloudSelectedAll);
				break;
			case 'download':
				cloudDownload(cloudSelectedAll);
				break;
			case 'show':
				cloudView(cloudSelectedAll);
				break;
			case 'print':
				cloudPrint(cloudSelectedAll);
				break;
			case 'delete':
				cloudDelete(cloudSelectedAll);
				break;
		}
	});

	// просмотр при dblclick
	$('body').on('dblclick', '.cloud-list_item', function(event) {
		event.preventDefault();

		if(window.location.href.indexOf('fortiny') != -1) {
			return false;
		}

		var ext = $(this).data('ext');
		var src = $(this).data('url');
		var path = $(this).data('download');

		if(ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif') {
			$.magnificPopup.open({
				items: {
					src: path,
					type: 'image'
				},
				removalDelay: 300,
				mainClass: 'zoom-in'
			});
		} else {
			window.location.href = src;
		}
	});

	// doubletap для ipad
	$('.cloud-list_item').doubletap(function (event) {
		$this = $(event.currentTarget);

		if(window.location.href.indexOf('fortiny') != -1) {
			return false;
		}

		var ext = $this.data('ext');
		var src = $this.data('url');
		var path = $this.data('download');
		var table = $this.data('table');

		if(ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif') {
			$.magnificPopup.open({
				items: {
					src: path,
					type: 'image'
				},
				removalDelay: 300,
				mainClass: 'zoom-in'
			});
		} else if((ext == 'docx' || ext == 'pdf' || ext == 'doc' || ext == 'xls' || ext == 'xlsx' || ext == 'txt') && isTouchDevice && table == 'cloud') {
			window.open(path);
		} else {
			window.location.href = src;
		}
	});

	// фильтр -->
	$('body').on('click', function(event) {
		if(!$(event.target).hasClass('cloud-nav_sort')) {
			$('.cloud-nav_sort-list').removeClass('cloud-nav_sort-list--visible');
		} else {
			$('.cloud-nav_sort-list').toggleClass('cloud-nav_sort-list--visible');
		}
	});
	// <-- фильтр


	// drag and drop
	$(document).ajaxComplete(function(event, xhr, settings) {
		// инициализация позьзователей в чате
		if(~settings.url.indexOf('ChatAjax')) {
			$(".user-list-item").draggable({
				appendTo: 'body',
				helper: "clone",
				cursor: "move",
				revert: "invalid",
				start: function(event, ui) {
					ui.helper.addClass('user-list-item--draggable');

					window.setTimeout(function(){
						ui.helper.addClass('user-list-item--draggable-small');
					}, 200);
				}
			});
		}
	});

	function initDrag() {
		if($('#cloud-list').hasClass('notDraggable')){
			return false;
		}
		// инициализация позьзователей в списке файлов
		$(".js_cloud-list_item .share-item").draggable({
			appendTo: 'body',
			helper: "clone",
			cursor: "move",
			revert: function(valid) {
				if(!valid) {
					// удалить юзера, забрать права доступа
					var userID = this.data('user');
					var fileID = this.closest('.cloud-list_item').data('id');
					var table = this.closest('.cloud-list_item').data('table');
					sendShareData(false, userID, fileID, 'read', table);
					this.remove();
				}

				// return !valid;
			},
			start: function(event, ui) {
				ui.helper.addClass('share-item--draggable');
			}
		});

		$('.js_cloud-list_item').droppable({
			accept: ".share-item, .user-list-item",
			hoverClass: "cloud-list_item--drop-hover",
			drop: function(event, ui) {
				var el = ui.draggable;
				var container = $(this);

				dragUser(el, container);
			}
		});
	}

	initDrag();

	function dragUser(el, container) {
		var userID = el.data('user') || el.data('val-id');
		var fileID = container.data('id');
		var table = container.data('table');
		var flag = true;

		container.find('.share-item').each(function(index, el) {
			if($(el).data('user') == userID) {
				flag = false;
			}
		});

		if(flag) {
			if(el.hasClass('share-item')){
				el.clone().appendTo(container.find('.cloud-list_item-share'));
			} else if (el.hasClass('user-list-item')) {
				var img = el.find('img.avatar ').attr('src');
				var newItem = $('<div class="share-item" data-user="' + userID + '"><img class="rounded avatar" src="' + img + '" alt=""></div>');
				newItem.appendTo(container.find('.cloud-list_item-share'));
			}

			sendShareData(true, userID, fileID, 'read', table);
			initDrag();
		} else {
			infoPopup('У позьзователя уже есть права доступа к этому файлу');
		}
	}

	function sendShareData(action, userID, fileID, permission, table) {

		console.log(action + ' ' + userID + ' ' + fileID + ' ' + permission + ' ' + table);

		$.ajax({
			type: "POST",
			url: "/CloudAjax/shareDoc",
			dataType: "JSON",
			data: {action: action, user_id: userID, object_id: fileID, access: permission, table: table},
			success: function(response) {},
			error: function() {}
		});

		// permission - read, edit
		// если action == true добавить права доступа
		// если action == false удалить права доступа
		// ajax -> userID, fileID, action, permission
	}


	// поделиться -->
	var shareData;

	$('body').on('click', '.share-item_button', function(event){
		event.stopPropagation();

		var $item = $(this).closest('.js_cloud-list_item');
		var data = {};

		data[$item.data('id')] = {
			id: $item.data('id'),
			type: $item.data('type'),
			src: $item.data('url'),
			download: $item.data('download'),
			el: $item[0],
			ext: $item.data('ext'),
			table: $item.data('table')
		};

		cloudShare(data);
	});

	function initAccessDraggable(){
		$('#accessPopup .access-popup_list-item--read .access-list_users-item').draggable({
			cursor: "move",
			revert: function(valid) {
				if(!valid) {
					return !valid;
				}
			},
			start: function(event, ui) {}
		});

		$('#accessPopup .access-popup_list-item--edit .access-list_users-item').draggable({
			cursor: "move",
			revert: function(valid) {
				if(!valid) {
					return !valid;
				}
			},
			start: function(event, ui) {}
		});
	};

	function cloudShare(data) {
		for(key in data){shareData = data[key];}

		console.log(data);
		console.log(shareData);

		function setShareData(data){

			console.log(data);

			if(data.read){
				for(var i = 0; i < data.read.length; i++){
					var item = $('<div class="access-list_users-item" data-user="' + data.read[i].id + '"><img class="rounded avatar" src="' + data.read[i].photo + '" alt=""></div>');
					$('#accessPopup .access-popup_list-item--read .access-list_users').append(item);
				};
			}

			if(data.edit){
				for(var i = 0; i < data.edit.length; i++) {
					var item = $('<div class="access-list_users-item" data-user="' + data.edit[i].id + '"><img class="rounded avatar" src="' + data.edit[i].photo + '" alt=""></div>');
					$('#accessPopup .access-popup_list-item--edit .access-list_users').append(item);
				};
			}

			initAccessDraggable();

			// drag and drop из read -> edit
			$('#accessPopup .access-popup_list-item--edit .access-list_users').droppable({
				accept: ".access-popup_list-item--read .access-list_users-item",
				hoverClass: "",
				activeClass: "access-list_users--active",
				drop: function(event, ui) {
					var el = ui.draggable;
					var container = $(this);
					var userID = el.data('user');

					container.append(el.css({top: 0, left: 0}));
					initAccessDraggable();
					sendShareData(true, userID, shareData.id, 'edit', shareData.table);
				}
			});

			// drag and drop из edit -> read
			$('#accessPopup .access-popup_list-item--read .access-list_users').droppable({
				accept: ".access-popup_list-item--edit .access-list_users-item",
				hoverClass: "",
				activeClass: "access-list_users--active",
				drop: function(event, ui) {
					var el = ui.draggable;
					var container = $(this);
					var userID = el.data('user');

					container.append(el.css({top: 0, left: 0}));
					initAccessDraggable();
					sendShareData(true, userID, shareData.id, 'read', shareData.table);
				}
			});
		};

		$.magnificPopup.open({
			items: {
				src: '#accessPopup',
				type: 'inline'
			},
			removalDelay: 300,
			mainClass: 'zoom-in',
			callbacks: {
				beforeOpen: function () {
					if(shareData.type == 'file'){
						var fileName = getCurrName($(shareData.el));
						$('#accessPopup .access-popup_name').addClass('access-popup_name--file').html('<span>' + shareData.ext + '</span>' + fileName + '.' + shareData.ext);
					} else if (shareData.type == 'folder') {
						var fileName = $(shareData.el).find('.cloud-list_item-title .title').text();
						$('#accessPopup .access-popup_name').addClass('access-popup_name--folder').html(fileName);
					}

					var linkForShare = shareData.src;
					var linkShareId = linkForShare.split('/');
					linkShareId = linkShareId[linkShareId.length-1];
					linkForShare = linkForShare.replace(/\d*$/, '');
					if (shareData.type == 'folder') {
						linkForShare += 'shared/' + btoa(linkShareId);
					} else {
						linkForShare += btoa(linkShareId);
					}
					$('#accessPopup .access-popup_link-field').val(linkForShare);

					// ajax -> id файла -> shareData.id
					//var response = {
					//	"read": [
					//		{id: 2, photo: "/img/cloud/access.png"},
					//		{id: 4, photo: "/img/cloud/access.png"}
					//	],
					//	"edit": [
					//		{id: 5, photo: "/img/cloud/access.png"}
					//	]
					//};

					$.ajax({
						type: "POST",
						url: "/CloudAjax/getSharedUsers",
						dataType: "JSON",
						data: {object_id: shareData.id},
						success: function(response) {
							setShareData(response);
						},
						error: function() {console.log('Error');}
					});

					//setShareData(response);
					//	ajax <-
				},
				afterClose: function () {
					shareData = {};
					$('#accessPopup .access-list_users-item').remove();
					$('#accessPopup .access-popup_name').removeClass('access-popup_name--file access-popup_name--folder');

					// инитим drag&drop
					initDrag();
				}
			}
		});
	};


	// add user popup
	var addUserTmp = '<div class="add-user-popup add-user-popup--hide">'+
		'<div class="add-user-popup_search">'+
		'<input type="text" placeholder="Напишите имя или Email" class="add-user-popup_search-field">'+
		'</div>'+

		'<div class="add-user-popup_search-result">'+
		'<div class="add-user-popup_search-result-title">Результаты поиска</div>'+
		'</div>'+
		'</div>';

	var addUserAccess;
	var userTmpFlag = false;

	function setAddUserData(popup, data){
		if(data.favorite.length) {
			var favoriteWrap = $('<div class="add-user-popup_favorite"><div class="add-user-popup_favorite-title">Добавить всех избранных</div></div>');

			for(var i = 0; i < data.favorite.length; i++) {
				var selectedClass = '';
				if(addUserAccess == data.favorite[i].access) {
					selectedClass = ' add-user-popup_user-item--selected ';
				}

				var favoriteItem = $('<div class="add-user-popup_user-item' + selectedClass + '" data-user="' + data.favorite[i].userID + '">' +
					'<img class="rounded avatar" src="' + data.favorite[i].photo + '" />' + data.favorite[i].name +
					'</div>');

				favoriteItem.appendTo(favoriteWrap);
			}

			favoriteWrap.insertBefore(popup.find('.add-user-popup_search-result'));
		}

		if(data.group.length) {
			for (var i = 0; i < data.group.length; i++) {
				var group = $('<div class="add-user-popup_group-wrap"><div class="add-user-popup_group-item"><span><img class="rounded avatar" src="' + data.group[i].photo + '" /></span> ' + data.group[i].title + '</div><div class="add-user-popup_group-list"></div></div>');

				for (var j = 0; j < data.group[i].users.length; j++) {
					var selectedClass = '';
					if(addUserAccess == data.group[i].users[j].access) {
						selectedClass = ' add-user-popup_user-item--selected ';
					}

					var groupItem = $('<div class="add-user-popup_user-item' + selectedClass + '" data-user="' + data.group[i].users[j].userID + '">' +
						'<img class="rounded avatar" src="' + data.group[i].users[j].photo + '" />' + data.group[i].users[j].name +
						'</div>');

					groupItem.appendTo(group.find('.add-user-popup_group-list'));
				}

				group.insertAfter(popup.find('.add-user-popup_search'));
			}
		}
	}

	$('body').on('click', '.access-list_users-button', function(){
		if($(this).siblings('.add-user-popup').length){
			var addUserWindow = $(this).siblings('.add-user-popup');
		} else {
			var addUserWindow = $(addUserTmp);
		}

		var it = $(this);

		addUserAccess = $(this).data('access');

		if(!userTmpFlag) {
			userTmpFlag = true;
			addUserWindow.insertAfter($(this));

			window.setTimeout(function(){
				addUserWindow.removeClass('add-user-popup--hide')
			}, 50);

			$.ajax({
				type: "POST",
				url: "/CloudAjax/getFavouritesAndGroups",
				dataType: "JSON",
				data: {object_id: shareData.id, access: it.attr('data-access')},
				success: function(response) {
					setAddUserData(addUserWindow, response);
				},
				error: function() {console.log('Error');}
			});

			// -> ajax
			// избранные пользователи
			// 5. Выводятся те сообщества, в которых пользователь администратор либо участник команды
			// 6. Откроется список участников сообщества (именно участников, не подписчиков)
			//var response = {
			//	favorite: [
			//		{userID: 2, name: 'Jonh Doe', photo: '/img/cloud/access.png', access: 'read'},
			//		{userID: 5, name: 'Jonh Doe', photo: '/img/cloud/access.png', access: 'edit'},
			//		{userID: 57, name: 'Jonh Doe', photo: '/img/cloud/access.png', access: false}
			//	],
			//	group: [
			//		{
			//			photo: "/img/cloud/group.png",
			//			title: "KONSTRUKTOR 2",
			//			users: [
			//				{userID: 62, name: 'Jonh Doe', photo: '/img/cloud/access.png', access: false}
			//			]
			//		}
			//	]
			//};
			//
			//setAddUserData(addUserWindow, response);
			// ajax <-
		} else {
			userTmpFlag = false;
			addUserWindow.addClass('add-user-popup--hide');

			window.setTimeout(function(){
				addUserWindow.remove();
			}, 300);
		}
	});

	$('body').on('click', function(event){
		if(userTmpFlag){

			var addUserWindow = $('.add-user-popup');

			var target = $(event.target);
			var targetPopup = !target.hasClass('add-user-popup');
			var targetClosestPopup = !target.closest('.add-user-popup').length;
			var targetButton = target.hasClass('access-list_users-button');

			if(targetPopup && targetClosestPopup && targetButton === false) {
				userTmpFlag = false;
				addUserWindow.addClass('add-user-popup--hide');

				window.setTimeout(function(){
					addUserWindow.remove();
				}, 300);
			}
		}
	});

	function setSearchResult(data){
		var resultHolder = $('#accessPopup .add-user-popup_search-result');
		resultHolder.find('.add-user-popup_user-item').remove();

		for(var i = 0; i < data.length; i++){
			var selectedClass = '';
			if(addUserAccess == data[i].access) {
				selectedClass = ' add-user-popup_user-item--selected ';
			}

			var item = $('<div class="add-user-popup_user-item' + selectedClass + '" data-user="'+data[i].id+'"><img class="rounded avatar" src="'+data[i].photo+'" /> '+data[i].name+'</div>')
			item.appendTo(resultHolder);
		}
	}

	var searchQueryTimeout;

	$('body').on('keyup', '.add-user-popup_search-field', function(){
		if($(this).val().length > 1){

			var it = $(this);

			if(typeof searchQueryTimeout != 'undefined' || !searchQueryTimeout) {
				clearTimeout(searchQueryTimeout);
			}

			searchQueryTimeout = setTimeout(function(){
				$.ajax({
					type: "POST",
					url: "/CloudAjax/getUsersByNameEmail",
					dataType: "JSON",
					data: {query: it.val(), object_id: shareData.id, access: it.closest('.access-list_users').find('.access-list_users-button').attr('data-access')},
					success: function(response) {
						setSearchResult(response);
					},
					error: function() {console.log('Error');}
				});
			}, 200);

			// ajax -> $(this).val()
			//var response = [
			//	{id: 2, name: 'Александра Иванова', photo: '/img/cloud/access.png', access: 'read'},
			//	{id: 13, name: 'Yaroslav Eroshenko', photo: '/img/cloud/access.png', access: false},
			//	{id: 14, name: 'Iana Kain', photo: '/img/cloud/access.png', access: false},
			//	{id: 15, name: 'Jonh Doe', photo: '/img/cloud/access.png', access: false}
			//];
			//
			//setSearchResult(response);
			// ajax <-
		} else {
			var resultHolder = $('#accessPopup .add-user-popup_search-result');
			resultHolder.find('.add-user-popup_user-item').remove();
		}
	});

	$('body').on('click', '.add-user-popup_group-item', function(){
		$(this).next().slideToggle(200);
	});

	// функция для добавления пользователя
	function setUserAccess(action, userID, fileID, permission, photo, table){
		sendShareData(action, userID, fileID, permission, table);

		var list = $(shareData.el).find('.cloud-list_item-share');

		if(action){
			var item = $('<div class="access-list_users-item" data-user="' + userID + '"><img class="rounded avatar" src="' + photo + '" alt=""></div>');

			if(permission == 'read'){
				$('#accessPopup .access-popup_list-item--edit .access-list_users').find('.access-list_users-item[data-user="'+userID+'"]').remove();
				$('#accessPopup .access-popup_list-item--read .access-list_users').append(item);
			} else if(permission == 'edit'){
				$('#accessPopup .access-popup_list-item--read .access-list_users').find('.access-list_users-item[data-user="'+userID+'"]').remove();
				$('#accessPopup .access-popup_list-item--edit .access-list_users').append(item);
			}

			// добавить пользователя в списке файлов
			if(!list.find('.share-item[data-user="'+userID+'"]').length){
				list.append('<div class="share-item rounded avatar" data-user="'+userID+'"><img src="'+photo+'" alt=""></div>');
			}
		} else {
			if(permission == 'read'){
				$('#accessPopup .access-popup_list-item--read .access-list_users').find('.access-list_users-item[data-user="'+userID+'"]').remove();
			} else if(permission == 'edit'){
				$('#accessPopup .access-popup_list-item--edit .access-list_users').find('.access-list_users-item[data-user="'+userID+'"]').remove();
			}

			// удалить пользователя из списка файлов
			list.find('.share-item[data-user="'+userID+'"]').remove();
		}

		initAccessDraggable();
	}

	// выделить и добавить пользователя
	$('body').on('click', '.add-user-popup_user-item', function(){
		var userID = $(this).data('user');
		var photo = $(this).find('img').attr('src');

		if($(this).hasClass('add-user-popup_user-item--selected')){
			$(this).removeClass('add-user-popup_user-item--selected');
			setUserAccess(false, userID, shareData.id, addUserAccess, photo, shareData.table);
		} else {
			$(this).addClass('add-user-popup_user-item--selected');
			setUserAccess(true, userID, shareData.id, addUserAccess, photo, shareData.table);
		}
	});

	// выделить и добавить всех избранных
	$('body').on('click', '.add-user-popup_favorite-title', function(){
		if($(this).hasClass('add-user-popup_favorite-title--selected')){
			$(this).removeClass('add-user-popup_favorite-title--selected');

			$('#accessPopup .add-user-popup_favorite .add-user-popup_user-item').each(function(index, element){
				var userID = $(element).data('user');
				var photo = $(element).find('img').attr('src');

				$(element).removeClass('add-user-popup_user-item--selected');
				setUserAccess(false, userID, shareData.id, addUserAccess, photo, shareData.table);
			});
		} else {
			$(this).addClass('add-user-popup_favorite-title--selected');

			$('#accessPopup .add-user-popup_favorite .add-user-popup_user-item').each(function(index, element){
				var userID = $(element).data('user');
				var photo = $(element).find('img').attr('src');

				$(element).addClass('add-user-popup_user-item--selected');
				setUserAccess(true, userID, shareData.id, addUserAccess, photo, shareData.table);
			});
		}
	});

	// удалить права доступа у пользователей
	$('body').on('click', '.access-list_delete span', function(){
		var accessItem = $(this).closest('.access-popup_list-item');
		var permission;

		if(accessItem.hasClass('access-popup_list-item--read')){
			permission = 'read';
		} else if(accessItem.hasClass('access-popup_list-item--edit')){
			permission = 'edit';
		}

		accessItem.find('.access-list_users-item').each(function(index, element){
			var userID = $(element).data('user');
			sendShareData(false, userID, shareData.id, permission, shareData.table);
			$(element).remove();

			// удалить пользователей из списка файлов
			$(shareData.el).find('.share-item[data-user="'+userID+'"]').remove();
		});
	});

	//
	$('body').on('click', function(event){
		$('.access-list_delete').removeClass('access-list_delete--active');
		var self = $(event.target);

		if(self.hasClass('.access-list_users-item') || self.closest('.access-list_users-item').length){
			self.closest('.access-popup_list-item').find('.access-list_delete').addClass('access-list_delete--active');
		}
	});
	// <-- поделиться


	// info Popup -->
	function infoPopup(msg) {
		$.magnificPopup.open({
			items: {
				src: '<div class="info-popup">' + msg + '</div>',
				type: 'inline'
			},
			removalDelay: 300,
			mainClass: 'zoom-in'
		});
	}

	// Сортировка
	$('body').on('click', '.cloud-nav_sort-list-item', function(){
		var sort = $(this).data('sort');

		var files = [];
		var folder = [];

		$('.js_cloud-list_item.cloud-list_item-file').each(function(index, el) {
			files.push(el);
		});

		$('.js_cloud-list_item.cloud-list_item-folder').each(function(index, el) {
			folder.push(el);
		});

		// сортировка файлов
		if(sort == 'size'){
			files.sort(function(a, b){
				if ($(a).data('size') < $(b).data('size')) return -1;
				if ($(a).data('size') > $(b).data('size')) return 1;
			});
		} else if(sort == 'time'){
			files.sort(function(a, b){
				if ($(a).data('created') < $(b).data('created')) return -1;
				if ($(a).data('created') > $(b).data('created')) return 1;
			});
		} else if(sort == 'name') {
			files.sort(function(a, b){
				if ($(a).data('name').toString() < $(b).data('name').toString()) return 1;
				if ($(a).data('name').toString() > $(b).data('name').toString()) return -1;
			});
		}

		for(var i=0; i<files.length; i++){
			$(files[i]).insertAfter('.cloud-list_item--clear');
		}

		// сортировка папок
		if(sort == 'size'){
			folder.sort(function(a, b){
				if ($(a).data('size') > $(b).data('size')) return -1;
				if ($(a).data('size') < $(b).data('size')) return 1;
			});
		} else if(sort == 'time'){
			folder.sort(function(a, b){
				if ($(a).data('created') > $(b).data('created')) return -1;
				if ($(a).data('created') < $(b).data('created')) return 1;
			});
		} else if(sort == 'name') {
			folder.sort(function(a, b){
				if ($(a).data('name').toString() > $(b).data('name').toString()) return 1;
				if ($(a).data('name').toString() < $(b).data('name').toString()) return -1;
			});
		}

		for(var i=0; i<folder.length; i++){
			$(folder[i]).insertBefore('.cloud-list_item--clear');
		}
	});

	// context nav on touch device
	var tapHold;

	function touchOpenContextNav(event, el){
		clearTimeout(tapHold);

		if(el){
			tapHold = window.setTimeout(function(){
				event.preventDefault();
				toggleContextMenuOn(el);
				setContextMenuPosition(event);
			}, 600);
		}
	}

	$('body').on('touchstart', '.js_cloud-list_item', function(event) {
		//event.preventDefault();
		var self = this;
		touchOpenContextNav(event, self);
	});

	$('body').on('touchmove', '.js_cloud-list_item', function(event) {
		touchOpenContextNav(event, false);
	});

	$('body').on('touchend', '.js_cloud-list_item', function() {
		clearTimeout(tapHold);
	});

	$('body').on('touchstart contextmenu', 'img', function(event){
		event.preventDefault();
	});
	// context nav on touch device <--

});

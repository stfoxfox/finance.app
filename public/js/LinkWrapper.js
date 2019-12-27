var LinkWrapper = {

    // Функция удаления дубликатов из массива
    removeDuplicateElement: function(arrayName) {
        var newArray=new Array();
		if(arrayName.length != 0) {
			label:for(var i=0; i<arrayName.length;i++ ){
				for(var j=0; j<newArray.length;j++ ){
					if(newArray[j]==arrayName[i])
						continue label;
				}
				newArray[newArray.length] = arrayName[i];
			}
		}
        return newArray;
    },

    wrap: function(element) {

        var txt = $(element).text();

        // регулярка для поиска полного URL
        var regUri = /(((http|ftp|https):\/\/)|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#!]*[\w\-\@?^=%&/~\+#])?/g;

        // регулярка для поиска домена
        var regDomain = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/gi;
        var foundUrisAll = txt.match(regUri);
		if(foundUrisAll == null) {
			return false;
		}
        foundUris = LinkWrapper.removeDuplicateElement(foundUrisAll); // удаляем дубликаты

        // Заменяем найденные URL, обрамляя тэгами
        var newTxt = '';
        for(var i = 0; i < foundUris.length; i++) {

            var domain = foundUris[i].match(regDomain);
			if( foundUris[i].indexOf('www') == 0 ) {
            	newTxt = txt.replace(new RegExp(foundUris[i],'g'),'<a href="' + foundUris[i].replace('www.', 'http://') + '" target="_blank">' + domain[0].replace('www.', '') + '</a>');
			} else {
            	newTxt = txt.replace(new RegExp(foundUris[i],'g'),'<a href="' + foundUris[i] + '" target="_blank">' + domain[0] + '</a>');
			}
            txt = newTxt;
        }

        // Изменяем текст блока
        $(element).html(newTxt);
    }
};

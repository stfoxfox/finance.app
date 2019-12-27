var Youtube = {
    isValidLink: function (link) {
        var p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
        var isValid = (link.match(p)) ? RegExp.$1 : false;
        if (!isValid) {
            return false;
        }
        return true;
    }
};
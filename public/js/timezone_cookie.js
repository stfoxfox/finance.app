function setcookie(name, value, expires, path, domain, secure) {
    expires instanceof Date ? expires = expires.toGMTString() : typeof(expires) == 'number' && (expires = (new Date(+(new Date) + expires * 1e3)).toGMTString());
    var r = [name + "=" + escape(value)], s, i;
    for(i in s = {expires: expires, path: path, domain: domain}){
        s[i] && r.push(i + "=" + s[i]);
    }
    return secure && r.push("secure"), document.cookie = r.join(";"), true;
}

var now = new Date();
var later = new Date();
later.setTime(now.getTime() + 365 * 24 * 60 * 60 * 1000);
setcookie('tzo', now.getTimezoneOffset(), later, '/');
var d1 = new Date();
var d2 = new Date();
d1.setDate(1);
d1.setMonth(1);
d2.setDate(1);
d2.setMonth(7);
if(parseInt(d1.getTimezoneOffset()) == parseInt(d2.getTimezoneOffset())) {
    setcookie('tzd', '0', later, '/');
} else {
    var hemisphere = parseInt(d1.getTimezoneOffset()) - parseInt(d2.getTimezoneOffset());
    if((hemisphere > 0 && parseInt(d1.getTimezoneOffset()) == parseInt(now.getTimezoneOffset())) || (hemisphere < 0 && parseInt(d2.getTimezoneOffset()) == parseInt(now.getTimezoneOffset()))) {
        setcookie('tzd', '0', later, '/');
    } else {
        setcookie('tzd', '1', later, '/');
    }
}

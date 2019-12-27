Date.timeDays = function(days) {
	return 86400 * 1000 * days;
}

Date.fromSqlDate = function(mysql_string) { 
	if(typeof mysql_string === 'string')    {
		var t = mysql_string.split(/[- :]/);
		return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
	}
	return null;   
}
Date.prototype.toSqlDate = function() { 
	return this.getFullYear() + '-' + zeroFormat(this.getMonth() + 1) + '-' + zeroFormat(this.getDate());
}
Date.prototype.toSqlDateTime = function() { 
	return this.getFullYear() + '-' + zeroFormat(this.getMonth() + 1) + '-' + zeroFormat(this.getDate()) + ' ' + 
		this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
}
Date.HoursMinutes = function(jsdate, locale) {
	var hours = jsdate.getHours();
	if (locale && locale == 'rus') {
		return zeroFormat(hours) + ':' + zeroFormat(jsdate.getMinutes());
	}
	return zeroFormat((hours > 12) ? hours - 12 : hours) + ':' + zeroFormat(jsdate.getMinutes()) + ((hours >= 12) ? 'pm' : 'am');
}
Date.fullDate = function(js_date, locale) {
	if (locale && locale == 'rus') {
		return zeroFormat(js_date.getDate()) + '.' + zeroFormat(js_date.getMonth() + 1) + '.' + js_date.getFullYear();
	}
	return zeroFormat(js_date.getMonth() + 1) + '/' + zeroFormat(js_date.getDate()) + '/' + js_date.getFullYear();
}
Date.prototype.addDays = function(days) {
	this.setTime(this.getTime() + Date.timeDays(days));
	return this;
}
Date.local2sql = function(localDate) {
	if (localDate.indexOf('.') > 0) {
		var d = localDate.split('.');
		return d[2] + '-' + d[1] + '-' + d[0];
	}
	var d = localDate.split('/');
	return d[2] + '-' + d[0] + '-' + d[1];
}
function zeroFormat(n) {
	n = parseInt(n);
	return (n >= 10) ? '' + n : '0' + n;
}
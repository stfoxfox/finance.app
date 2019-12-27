Array.prototype.in_array = function(value) { 
	for(var n = 0; n < this.length; n++) {
		if (value == this[n]) {
			return true;
		}
	}
	return false;
}



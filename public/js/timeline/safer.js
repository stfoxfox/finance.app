function Safer(jsonObj, defaultResult){
    this.origObject = jsonObj;
    this.defaultResult = defaultResult != undefined ? defaultResult : false;
}

Safer.prototype.get = function(key){
    if(!key && key != "") return this.origObject;
    return this.origObject ? hasOwnProperty.call(this.origObject, key) ? this.origObject[key]: this.defaultResult : this.defaultResult;
};

Safer.prototype.chain = function(){
    if(this.origObject && !arguments.length) return this.defaultResult;

    var result = this.get(arguments[0]);
    for(var i = 1; i < arguments.length; i++){
        result = this.get.apply(new Safer(result, this.defaultResult), [arguments[i]]);
        if(!result) return this.defaultResult;
    }

    return result;
};
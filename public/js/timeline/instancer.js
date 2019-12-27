var mResolverArray = {};
var mRegisteredClasses = {};
var mInstanceIterator = 1;

RegisterClass = function(key, className){
    mRegisteredClasses[key] = className;
    className.prototype.callAny = function(funcName){
        if(this[funcName]){
            this[funcName].apply(this, Array.prototype.slice.call( arguments, 1 ));
        }
    }
}

UnregisterClass = function(key){
    delete mRegisteredClasses[key];
}

$.fn.Instancer = function(funcName, funcArgs) {
    var key = $(this).attr("instance-key");

    if(!key && mRegisteredClasses[funcName]){
        key = mInstanceIterator++;
        $(this).attr("instance-key", key);
        key = $(this).attr("instance-key");
    }

    var classObject = mResolverArray[key];
    if(arguments.length == 0 && classObject) {return classObject;}

    else if(classObject){
        return classObject.callAny.apply(classObject, arguments);
    }
    else if(mRegisteredClasses[funcName]) {
            var obj = new mRegisteredClasses[funcName]($(this), funcArgs);
            mResolverArray[key]  = obj;
            return obj;
        }
};

$.fn.DestroyInstance = function(){
    console.log($(this))
    var key = $(this).attr("instance-key");

    if(key){
        var classObject = mResolverArray[key];
        if(!classObject) return;
        classObject.callAny("destroy");
        delete mResolverArray[key];
        $(this).removeAttr("instance-key");
    }

    if(mResolverArray.length == 0){
        mInstanceIterator = 1;
    }
}

function getResolver(){
    return mResolverArray;
}

function Anonymizer(func){
    var args = Array.prototype.slice.call(arguments, 1);

    return function(){
        func.apply(this, args);
    }
}
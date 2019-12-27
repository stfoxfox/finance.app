function kAsyncWorker(){
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    this.Init();
}

kAsyncWorker.prototype.Init = function(index){
    this.queue = [];
    this.maxID = 1;
    this.index = -1;
    this.processLock = false;
    this.actionLock = false;
    this.retry = 0;
    this.timeout = 0;
    this.tickTimeout = 1;
    this.tickRetry = 100;
    this.noActionTimeout = 2000;
};

kAsyncWorker.prototype.Push = function(buffer, processFunc, callback) {
    var id = this.maxID++;

    this.queue.push({
        status : "wait",
        buffer : buffer,
        process : processFunc,
        callback : callback,
        id : id
    });

    return id;
};

kAsyncWorker.prototype.GetIndexById = function(id){
    for(var i = 0; i < this.queue.length; i++){
        if(this.queue[i].id == id){
            return i;
        }
    }
    return -1;
};

kAsyncWorker.prototype.Start = function(id){
    //console.log("Try Start");
    if(!id) {
        if(this.index == -1) return;
        this.actionLock = true;
        this.queue[this.index].status = "process";
        this.actionLock = false;
    }else{
        this.actionLock = true;
        var ind = this.GetIndexById(id);
        if(ind != -1 && this.queue[ind].status != "process" && ind != this.index){
            this.queue[this.index].status = "wait";
            this.queue[ind].status = "process";
        }
        this.actionLock = false;
    }
};

kAsyncWorker.prototype.Drop = function(id){
    //console.log("Try Drop");
    if(!id) {
        if(this.index == -1){
            return;
        }

        this.actionLock = true;
        this.queue.remove(this.index);
        this.index = -1;
        this.actionLock = false;
    }else{
        this.actionLock = true;
        var ind = this.GetIndexById(id);
        if(ind != -1) {
            if (ind > this.index) {
                this.queue.remove(id);
            } else {
                this.queue.remove(id);

                if(this.queue.count > 0) {
                    if (this.index + 1 < this.queue.count)
                        this.index++;
                    else {
                        this.index--;
                    }
                }
                else{
                    this.index = -1;
                }
            }
        }

        this.actionLock = false;
    }
};

kAsyncWorker.prototype.Pause = function(id){
    //console.log("Try Pause");
    if(!id) {
        if(this.index == -1){
            return;
        }
        this.actionLock = true;
        this.queue[this.index].status = "wait";
        this.actionLock = false;
    }else{
        this.actionLock = true;
        var ind = this.GetIndexById(id);
        if(ind != -1 && this.queue[ind].status != "wait" && ind != this.index){
            this.queue[id].status = "wait";
        }
        this.actionLock = false;
    }
};

kAsyncWorker.prototype.Next = function(){
    //console.log("Try Next");
    if(this.index == -1){
        return;
    }
    this.actionLock = true;
    if(this.index + 1 < this.queue.length){
        this.Pause();
        this.index++;
        this.Start();
    }
    this.actionLock = false;
};

kAsyncWorker.prototype.Prev = function(){
    //console.log("Try Prev");
    if(this.index == -1){
        return;
    }
    this.actionLock = true;
    if(this.index - 1 >= 0){
        this.Pause();
        this.index--;
        this.Start();
    }
    this.actionLock = false;
};

kAsyncWorker.prototype.First = function(){
    //console.log("Try First");
    if(this.index == -1){
        return;
    }

    this.actionLock = true;
    if(this.index != 0){
        this.Pause();
        this.index = 0;
        this.Start();
    }
    this.actionLock = false;
};

kAsyncWorker.prototype.Last = function(){
    //console.log("Try Last");
    if(this.index == -1){
        return;
    }
    this.actionLock = true;
    if(this.index != this.queue.length - 1){
        this.Pause();
        this.index = this.queue.length - 1;
        this.Start();
    }
    this.actionLock = false;
};

kAsyncWorker.prototype.Count = function(){
    return this.queue.length;
};


kAsyncWorker.prototype._execute = function(){
    //console.log("Try Execute");
    var closure = this;
    clearTimeout(this.timeout);

    var nextTimeout = this.tickTimeout;

    if(this.index == -1){
        //console.log(this.index)
        if(this.queue.length > 0) {
            this.index = 0;
            this.Start();
        }
        else
        {
            nextTimeout = this.noActionTimeout;
        }
    }else {
        if(this.queue[this.index].status == "wait"){
            nextTimeout = this.noActionTimeout / 2.0;
        }

    }


    this.timeout = setTimeout(
        function(){
            if(closure.actionLock || closure.processLock || !(closure.index >= 0 && closure.queue[closure.index].status == "process")){
                //console.log("Retry");
                closure.retry = setTimeout(
                    function(){
                        closure._execute();
                    },closure.tickRetry
                )
            }else {
                closure.processLock = true;
                if(closure.queue[closure.index].process.apply(closure.queue[closure.index].buffer))
                {
                    //console.log("Callback");
                    if(closure.queue[closure.index].callback) {
                        closure.queue[closure.index].callback();
                    }
                    closure.Drop();

                    if(closure.IsExecute()){
                        closure.Start();
                        //console.log("Try StartNext");
                    }
                    else{
                        //console.log("Pure queue");
                        this.maxID = 1;
                    }
                }
                closure.processLock = false;

                clearTimeout(closure.timeout);
                closure.timeout = setTimeout(
                    function(){
                        closure._execute();
                    }, closure.tickTimeout
                )
            }
        }, nextTimeout
    );
};

kAsyncWorker.prototype.IsLocked = function(id){
    return this.locked;
};

kAsyncWorker.prototype.IsExecute = function(id){
    return this.index != -1 ? true : false;
};

kAsyncWorker.prototype.Lock = function(lock){
    this.actionLock = lock;
}

kAsyncWorker.prototype.Clear = function(){
    clearTimeout(this.timeout);
    clearTimeout(this.retry);
    this.Init();
}


AsyncWorker = new kAsyncWorker();
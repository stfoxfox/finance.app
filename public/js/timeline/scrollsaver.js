function ScrollSaver(scroll){
    this.init(scroll);
}

ScrollSaver.prototype.init = function(scroll){
    if(scroll) {
        this.scroll = scroll;
    }

    this.previousScrollHeightMinusTop = 0;
    this.readyFor = 'up';
    this.toReset = false;
};

ScrollSaver.prototype.prepareFor = function(direction){
    this.toReset = true;
    this.readyFor = direction || 'up';
    this.previousScrollHeightMinusTop = this.scroll.scrollHeight - this.scroll.scrollTop;
};

ScrollSaver.prototype.restore = function(){
   if(this.toReset) {
       if(this.readyFor === 'up'){
          this.scroll.scrollTop = this.scroll.scrollHeight - this.previousScrollHeightMinusTop;
       }
       this.toReset = false;
   }
};

ScrollSaver.prototype.add = function(val){
    this.previousScrollHeightMinusTop += val;
};


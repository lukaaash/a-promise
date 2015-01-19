class Promise{
  OnSuccess:Array;
  OnError:Array;
  constructor(callback:Function){
    this.OnSuccess = [];
    this.OnError = [];
    setTimeout(function(){
      try {
        callback(this.resolve.bind(this),this.reject.bind(this));
      } catch(error){
        console.error(error);
        this.reject(error);
      }
    }.bind(this),5); // An async like behaviour
  }
  then(OnSuccess,OnFailure):void{
    if(typeof OnSuccess === 'function'){
      this.OnSuccess.push(OnSuccess);
    }
    if(typeof OnFailure === 'function'){
      this.OnError.push(OnFailure);
    }
  }
  catch(OnFailure):void{
    if(typeof OnFailure === 'function'){
      this.OnError.push(OnFailure);
    }
  }
  resolve():void{
    var args = arguments;
    this.OnSuccess.forEach(function(c:Function){
      c.apply(null,args);
    });
  }
  reject():void{
    var args = arguments;
    this.OnError.forEach(function(c:Function){
      c.apply(null,args);
    });
  }
}
module.exports = Promise;
class Promise{
  OnSuccess:Array;
  OnError:Array;
  Status:Number;
  Result:Array;
  constructor(callback:Function, async:Boolean = true){
    this.OnSuccess = [];
    this.OnError = [];
    this.Result = [];
    this.Status = 0;
    if(async){
      setTimeout(function(){
        try {
          callback(this.resolve.bind(this),this.reject.bind(this));
        } catch(error){
          console.error(error);
          this.reject(error);
        }
      }.bind(this),5); // An async like behaviour
    } else {
      try {
        callback(this.resolve.bind(this),this.reject.bind(this));
      } catch(error){
        console.error(error);
        this.reject(error);
      }
    }
  }
  then(OnSuccess,OnFailure):void{
    if(typeof OnSuccess === 'function'){
      if(this.Status === 1){
        OnSuccess.apply(null,this.Result);
      } else if(this.Status === 0) {
        this.OnSuccess.push(OnSuccess);
      }
    }
    if(typeof OnFailure === 'function'){
      this.catch(OnFailure);
    }
  }
  catch(OnFailure):void{
    if(typeof OnFailure === 'function'){
      if(this.Status === 2){
        OnFailure.apply(null,this.Result);
      } else if(this.Status === 0) {
        this.OnError.push(OnFailure);
      }
    }
  }
  resolve():void{
    this.Status = 1;
    var args = arguments;
    this.Result = args;
    this.OnSuccess.forEach(function(c:Function){
      c.apply(null,args);
    });
  }
  reject():void{
    var args = arguments;
    this.Result = args;
    this.Status = 2;
    this.OnError.forEach(function(c:Function){
      c.apply(null,args);
    });
  }
  static resolve(LeArgs):Promise{
    return new Promise(function(resolve){
      resolve(LeArgs);
    });
  }
}
module.exports = Promise;
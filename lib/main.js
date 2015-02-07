class Promise{
  OnSuccess:Array;
  OnError:Array;
  Status:Number;
  Result:Array;
  constructor(callback:Function, async:Boolean = true){
    if(this === 'undefined'){
      throw new Error("No direct access, must be initialized like a class");
    }
    this.OnSuccess = [];
    this.OnError = [];
    this.Result = [];
    this.Status = 0;
    if(typeof callback === 'function'){
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
  }
  then(OnSuccess,OnFailure):Promise{
    return new Promise(function(resolve){
      if(typeof OnSuccess === 'function'){
        var LeSuccess = function(){
          var LeResult = OnSuccess.apply(null,arguments);
          if(LeResult instanceof Promise){
            LeResult.then(resolve);
          } else {
            resolve.apply(null,arguments);
          }
        };
        if(this.Status === 1){
          LeSuccess.apply(null,this.Result);
        } else if(this.Status === 0) {
          this.OnSuccess.push(LeSuccess);
        }
      }
      if(typeof OnFailure === 'function'){
        this.catch(OnFailure);
      }
    }.bind(this));
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
  static reject(LeArgs):Promise{
    return new Promise(function(resolve,reject){
      reject(LeArgs);
    });
  }
  static all(Promises):Promise{
    return new Promise(function(resolve,reject){
      var
        ValidPromises = [],
        Finished = false;
      Promises.forEach(function(Entry){
        if(Entry instanceof Promise){
          ValidPromises.push(Entry);
          Entry.then(function(){
            ValidPromises.splice(ValidPromises.indexOf(Entry),1);
            if(ValidPromises.length === 0 && !Finished){
              Finished = true;
              resolve();
            }
          }).catch(function(error){
            Finished = true;
            reject(error);
          });
        }
      });
      if(!ValidPromises.length){
        resolve();
      }
    });
  }
}
module.exports = Promise;
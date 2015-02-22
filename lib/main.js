

// @Compiler-Output "build/main.js"
// @Compiler-Compress "true"
class Promise{
  OnSuccess:Array;
  OnError:Array;
  Fulfilled:Number;
  Result:Array;
  constructor(callback:Function){
    if(this === 'undefined'){
      throw new Error("No direct access, must be initialized like a class");
    }
    this.OnSuccess = [];
    this.OnError = [];
    this.Result = [];
    this.Fulfilled = 0;
    if(typeof callback === 'function'){
      setTimeout(function(){
        try {
          callback.call(this,this.resolve.bind(this),this.reject.bind(this));
        } catch(error){
          if(this.OnError.length){
            this.reject(error);
          } else {
            throw error;
          }
        }
      }.bind(this),0); // An async like behaviour
    }
  }
  then(OnSuccess,OnFailure):Promise{
    if(typeof OnSuccess === 'function'){
      this.OnSuccess.push(OnSuccess);
    }
    if(typeof OnFailure === 'function'){
      this.OnError.push(OnFailure);
    }
    return this;
  }
  catch(OnFailure):Promise{
    if(typeof OnFailure === 'function'){
      if(this.Fulfilled === 2){
        OnFailure.apply(null,this.Result);
      } else if(this.Fulfilled === 0) {
        this.OnError.push(OnFailure);
      }
    }
    return this;
  }
  resolve():Promise{
    if(this.Fulfilled !== 0){
      return ;
    }
    this.Fulfilled = 1;
    var args = arguments;
    this.Result = args;
    this.OnSuccess.forEach(function(c:Function){
      c.apply(null,args);
    });
    return this;
  }
  reject():Promise{
    if(this.Fulfilled !== 0){
      return ;
    }
    var args = arguments;
    this.Result = args;
    this.Fulfilled = 2;
    this.OnError.forEach(function(c:Function){
      c.apply(null,args);
    });
    return this;
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
        Results = [],
        Finished = false;
      Promises.forEach(function(Entry){
        var ResultIndex;
        if(Entry instanceof Promise){
          ValidPromises.push(Entry);
          ResultIndex = ValidPromises.indexOf(Entry);
          Results.push(null);
          Entry.then(function(Result){
            Results[ResultIndex] = Result;
            ValidPromises.splice(ValidPromises.indexOf(Entry),1);
            if(ValidPromises.length === 0 && !Finished){
              Finished = true;
              resolve(Results);
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

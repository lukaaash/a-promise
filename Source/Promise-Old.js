

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
class Promise{
  static State = {PENDING: 0, FAILURE: 2, SUCCESS: 1};
  static ThrowErrors:Boolean = false;
  Result:Object;
  State:Number = Promise.State.PENDING;
  OnSuccess:Array = [];
  OnError:Array = [];
  constructor(Callback:Function){
    if(typeof Callback == 'function'){
      setTimeout(function(){
        Callback.call(null,this.resolve.bind(this),this.reject.bind(this));
      }.bind(this),10);
    }
  }
  resolve(Result){
    if(this.State !== Promise.State.PENDING){
      return ;
    }
    this.State = Promise.State.SUCCESS;
    this.Result = Result;
    this.OnSuccess.forEach(function(Callback:Function){
      Callback(Result);
    });
  }
  reject(ErrorMessage){
    if(this.State !== Promise.State.PENDING){
      return ;
    }
    this.State = Promise.State.FAILURE;
    this.Result = ErrorMessage;
    if(this.OnError.length){
      this.OnError.forEach(function(Callback:Function){
        Callback(ErrorMessage);
      });
    } else {
      if(Promise.ThrowErrors){
        throw new Error("Uncaught Promise Rejection",ErrorMessage);
      }
    }
  }
  catch(Callback:Function):Promise{
    if(typeof Callback !== 'function'){
      throw new Error("Callback for Promise.catch should be a function");
    }
    if(this.State === Promise.State.PENDING){
      this.OnError.push(Callback);
    } else if(this.State === Promise.State.FAILURE){
      Callback(this.Result);
    }
    return this;
  }
  then(Callback:Function,OnError:Function):Promise{
    if(typeof Callback !== 'function' || (OnError && typeof OnError !== 'function')){
      throw new Error("Callback(s) for Promise.then should be a function");
    }
    if(this.State === Promise.State.PENDING){
      this.OnSuccess.push(Callback);
    } else if(this.State === Promise.State.SUCCESS){
      Callback(this.Result);
    }
    if(OnError){
      this.catch(OnError);
    }
    return this;
  }
  static resolve(Result):Promise{
    return new Promise(function(resolve){
      resolve(Result);
    });
  }
  static reject(Result):Promise{
    return new Promise(function(resolve,reject){
      reject(Result);
    });
  }
  static all(Promises:Array):Promise{
    return new Promise(function(resolve,reject){
      var
        ValidPromises = [],
        Status = Promise.State.PENDING,
        ProcessedPromises = 0,
        Results = [];
      Promises.forEach(function(PromiseInst){
        if(PromiseInst instanceof Promise){
          ValidPromises.push(PromiseInst);
        }
      });
      if(!ValidPromises.length){
        return resolve(Results);
      }
      ValidPromises.forEach(function(PromiseInst:Promise,Index:Number){
        PromiseInst.then(function(Result){
          ProcessedPromises++;
          Results[Index] = Result;
          if(ProcessedPromises === ValidPromises.length){
            resolve(Results);
          }
        },function(Error){
          Status = Promise.State.FAILURE;
          reject(Error);
        });
      });
    });
  }
}
module.exports = Promise;
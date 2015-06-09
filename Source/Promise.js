

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
class Promise{
  constructor(Callback, Ignore, ResolutionResult, ErrorResult){
    Ignore = Boolean(Ignore);
    this.OnError = null;
    this.OnSuccess = null;
    if(!Ignore && typeof Callback !== 'function') throw new Error("The Promise constructor requires a callback function");
    if(ResolutionResult){
      this.State = Promise.State.Success;
      this.Result = ResolutionResult;
    } else if(ErrorResult){
      this.State = Promise.State.Failure;
      this.Result = ErrorResult;
    } else {
      this.State = Promise.State.Pending;
      let Me = this;
      setTimeout(function(){
        try {
          Callback(function(Result){ Me.resolve(Result) }, function(Result){ Me.reject(Result) });
        } catch(err){
          Me.reject(err);
        }
      }, 0);
    }
  }
  resolve(Value){
    if(Value && Value.then && Value === this){
      throw new TypeError("You can not return self from Resolve");
    }
    if(this.State === Promise.State.Pending){
      this.Result = Value;
      this.State = Promise.State.Success;
      if(this.OnSuccess) this.OnSuccess(Value);
    }
  }
  reject(Value){
    if(Value && Value.then && Value === this){
      throw new TypeError("You can not return self from Reject");
    }
    if (this.State === Promise.State.Pending) {
      this.Result = Value;
      this.State = Promise.State.Failure;
      if (this.OnError) {
        this.OnError(Value);
      } else {
        console.log(Value.stack);
        throw new Error("Uncaught Promise Rejection");
      }
    }
  }
  onSuccess(Callback){
    if(this.State === Promise.State.Pending)
      this.OnSuccess = Callback;
    else if(this.State === Promise.State.Success)
      Callback(this.Result);
  }
  onError(Callback){
    if(this.State === Promise.State.Pending)
      this.OnSuccess = Callback;
    else if(this.State === Promise.State.Failure)
      Callback(this.Result);
  }
  then(CallbackSuccess, CallbackError){
    let Inst = new Promise(null, true);
    this.onSuccess(function(Value){
      if(typeof CallbackSuccess === 'function'){
        try {
          Inst.resolve(CallbackSuccess(Value));
        } catch(err){
          Inst.reject(err)
        }
      } else Inst.resolve(Value)
    });
    this.onError(function(Value){
      if(typeof CallbackError === 'function'){
        try {
          Inst.resolve(CallbackError(Value));
        } catch(err){
          Inst.reject(err);
        }
      } else Inst.reject(Value);
    });
    return Inst;
  }
  catch(CallbackError){
    if(typeof CallbackError !== 'function') throw new Error("Promise.catch expects first parameter to be a function");
    let Inst = new Promise(null, true);
    this.OnSuccess = function(Value){
      Inst.resolve(Value)
    };
    this.OnError = function(Value){
      Inst.resolve(CallbackError(Value))
    };
    return Inst;
  }
  static defer(){
    let Inst = new Promise(null, true);
    return {
      promise: Inst,
      reject: function(Value){
        Inst.reject(Value);
      },
      resolve: function(Value){
        Inst.resolve(Value);
      }
    };
  }
  static resolve(Value){
    return new Promise(null, true, Value);
  }
  static reject(Value){
    return new Promise(null, true, null, Value);
  }
}
Promise.State = {Pending: 0, Success: 1, Failure: 2};
module.exports = Promise;
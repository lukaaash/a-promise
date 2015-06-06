

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
class Promise{
  constructor(Callback){
    this.OnError = null;
    this.OnSuccess = null;
    this.State = Promise.State.Pending;
    if(typeof Callback !== 'function') throw new Error("The Promise constructor requires a callback function");
    let Me = this;
    setImmediate(function(){
      try {
        Callback(Me.resolve.bind(Me), Me.reject.bind(Me));
      } catch(err){
        Me.reject(err);
      }
    });
  }
  onError(Callback){
    if(this.State === Promise.State.Pending){
      this.OnError = Callback;
    } else if(this.State === Promise.State.Failure) {
      Callback(this.Result);
    }
  }
  onSuccess(Callback){
    if(this.State === Promise.State.Pending){
      this.OnSuccess = Callback;
    } else if(this.State === Promise.State.Success) {
      Callback(this.Result);
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
  then(CallbackSuccess, CallbackError){
    let Inst = new Promise(function(){});
    this.OnSuccess = function(Value){
      if(typeof CallbackSuccess === 'function'){
        try {
          Inst.resolve(CallbackSuccess(Value));
        } catch(err){
          Inst.reject(err)
        }
      } else Inst.resolve(Value)
    };
    this.OnError = function(Value){
      if(typeof CallbackError === 'function'){
        try {
          Inst.resolve(CallbackError(Value));
        } catch(err){
          Inst.reject(err);
        }
      } else Inst.reject(Value);
    };
    return Inst;
  }
  catch(CallbackError){
    if(typeof CallbackError !== 'function') throw new Error("Promise.catch expects first parameter to be a function");
    let Me = this;
    return new Promise(function(Resolve){
      Me.onSuccess(Resolve);
      Me.onError(function(Value){
        Resolve(CallbackError(Value));
      });
    });
  }
  static defer(){
    let Inst = new Promise(function(){});
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
    return new Promise(function(Resolve){
      Resolve(Value);
    });
  }
  static reject(Value){
    return new Promise(function(_, Reject){
      Reject(Value);
    });
  }
}
Promise.State = {Pending: 0, Success: 1, Failure: 2};
module.exports = Promise;
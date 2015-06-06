

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
let Assert = require('assert');
class Promise{
  constructor(Callback){
    this.OnError = null;
    this.OnSuccess = null;
    this.State = Promise.State.Pending;
    Assert(typeof Callback === 'function', "The Promise constructor requires a callback function");
    let Me = this;
    process.nextTick(function(){
      try {
        Callback.call(Me.resolve.bind(Me), Me.reject.bind(Me));
      } catch(err){
        Me.reject(err);
      }
    });
  }
  resolve(Value){
    if(this.State === Promise.State.Pending){
      this.State = Promise.State.Success;
      if(this.OnSuccess) this.OnSuccess(Value);
    }
  }
  reject(Value){
    if(this.State === Promise.State.Pending){
      this.State = Promise.State.Failure;
      if(this.OnError){
        this.OnError(Value);
      } else {
        throw new Error("Uncaught Promise Rejection", Value);
      }
    }
  }
  then(CallbackSuccess, CallbackError){
    var CallbackSuccessValid = typeof CallbackSuccess === 'function';
    if(CallbackError){
      Assert(typeof CallbackError === 'function', "Promise.then expects second parameter to be a function");
    }
    let Inst = Promise.defer();
    this.OnError = function(Value){
      if(CallbackError){
        try {
          Inst.resolve(CallbackError(Value));
        } catch(err){
          Inst.reject(err);
        }
      } Inst.reject(Value);
    };
    this.OnSuccess = function(Value){
      if(CallbackSuccessValid){
        try {
          Inst.resolve(CallbackSuccess(Value));
        } catch(err){
          Inst.reject(err);
        }
      } else Inst.resolve(Value);
    };
    return Inst.promise;
  }
  catch(CallbackError){
    Assert(typeof CallbackError === 'function', "Promise.catch expects first parameter to be a function");
    let Inst = Promise.defer();
    this.OnSuccess = function(Value){
      Inst.resolve(Value);
    };
    this.OnError = function(Value){
      Inst.resolve(CallbackError(Value));
    };
    return Inst.promise;
  }
  static defer(){
    let Inst = new Promise(function(){});
    return {promise: Inst, reject: Inst.reject.bind(Inst), resolve: Inst.resolve.bind(Inst)};
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
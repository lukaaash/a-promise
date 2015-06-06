

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
        Callback(Me.resolve.bind(Me), Me.reject.bind(Me));
      } catch(err){
        Me.reject(err);
      }
    });
  }
  resolve(Value){
    let Me = this;
    process.nextTick(function(){
      if(Me.State === Promise.State.Pending){
        Me.State = Promise.State.Success;
        if(Me.OnSuccess) Me.OnSuccess(Value);
      }
    });
  }
  reject(Value){
    let Me = this;
    process.nextTick(function() {
      if (Me.State === Promise.State.Pending) {
        Me.State = Promise.State.Failure;
        if (Me.OnError) {
          Me.OnError(Value);
        } else {
          throw new Error("Uncaught Promise Rejection", Value);
        }
      }
    });
  }
  then(CallbackSuccess, CallbackError){
    let CallbackSuccessValid = typeof CallbackSuccess === 'function';
    let CallbackErrorValid = typeof CallbackError === 'function';
    let Inst = Promise.defer();
    this.OnError = function(Value){
      if(CallbackErrorValid){
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
      } else Inst.resolve(CallbackSuccess);
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


// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
let Assert = require('assert');
class Promise{
  constructor(Callback){
    this.OnError = [];
    this.OnSuccess = [];
    this.State = Promise.State.Pending;
    Assert(typeof Callback === 'function', "The Promise constructor requires a callback function");
    let Me = this;
    setImmediate(function(){
      try {
        Callback(Me.resolve.bind(Me), Me.reject.bind(Me));
      } catch(err){
        Me.reject(err);
      }
    });
  }
  resolve(Value){
    let Me = this;
    function PromiseCommenceResolve(){
      if(Me.State === Promise.State.Pending){
        Me.Result = Value;
        Me.State = Promise.State.Success;
        if(Me.OnSuccess.length) Me.OnSuccess.forEach(function(OnSuccess){ OnSuccess(Value) });
      }
    }
    if(Value && Value.then){
      if(Value === this){
        throw new TypeError("You can not return self from Resolve");
      }
      Value.then(PromiseCommenceResolve, PromiseCommenceResolve);
    } else {
      setImmediate(PromiseCommenceResolve);
    }
  }
  reject(Value){
    let Me = this;
    function PromiseCommenceReject() {
      if (Me.State === Promise.State.Pending) {
        Me.Result = Value;
        Me.State = Promise.State.Failure;
        if (Me.OnError.length) {
          Me.OnError.forEach(function(OnError){ OnError(Value) });
        } else {
          throw new Error("Uncaught Promise Rejection", Value);
        }
      }
    }
    if(Value && Value.then){
      if(Value === this){
        throw new TypeError("You can not return self from Reject");
      }
      Value.then(PromiseCommenceReject);
    } else {
      setImmediate(PromiseCommenceReject);
    }
  }
  then(CallbackSuccess, CallbackError){
    let CallbackSuccessValid = typeof CallbackSuccess === 'function';
    let CallbackErrorValid = typeof CallbackError === 'function';
    let Inst = Promise.defer();
    let Me = this;
    function PromiseThenOnSuccess(Value){
      if(CallbackSuccessValid){
        try {
          Inst.resolve(CallbackSuccess(Value));
        } catch(err){
          Inst.reject(err);
        }
      } else Inst.resolve(Value);
    }
    function PromiseThenOnError(Value){
      if(CallbackErrorValid){
        try {
          Inst.resolve(CallbackError(Value));
        } catch(err){
          Inst.reject(err);
        }
      } Inst.reject(Value);
    }
    if(this.State === Promise.State.Pending){
      this.OnSuccess.push(PromiseThenOnSuccess);
      this.OnError.push(PromiseThenOnError);
    } else {
      setImmediate(function(){
        if(Me.State === Promise.State.Failure){
          PromiseThenOnError(Me.Result);
        } else if(Me.State === Promise.State.Success){
          PromiseThenOnSuccess(Me.Result);
        }
      });
    }
    return Inst.promise;
  }
  catch(CallbackError){
    Assert(typeof CallbackError === 'function', "Promise.catch expects first parameter to be a function");
    let Inst = Promise.defer();
    let Me = this;
    if(this.State === Promise.State.Pending){
      this.OnSuccess.push(function(Value){
        Me.Result = Value;
        Inst.resolve(Value);
      });
      this.OnError.push(function(Value){
        Me.Result = Value;
        Inst.resolve(CallbackError(Value));
      });
    } else if(this.State === Promise.State.Success) {
      Inst.resolve(Me.Result);
    } else if(this.State == Promise.State.Failure){
      Inst.reject(Me.Result);
    }
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
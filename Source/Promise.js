

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
let Assert = require('assert');
class Promise{
  constructor(Callback){
    this.State = Promise.State.Pending;
    Assert(Callback.constructor.name === 'Function', "The Promise constructor requires a callback function");
    let Me = this;
    process.nextTick(function(){
      Callback.call(Me.resolve.bind(Me), Me.reject.bind(Me));
    });
  }
  resolve(){
    
  }
  reject(){

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
Promise.defer().resolve();
module.exports = Promise;
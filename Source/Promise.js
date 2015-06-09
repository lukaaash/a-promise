

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict";
// State:Pending = 0
// State:Success = 1
// State:Failure = 2
class Promise{
  constructor(Callback){
    this.State = 0;
    let Me = this;
    setTimeout(function(){
      Callback(function(Result){Me.resolve(Result)}, function(Result){Me.reject(Result)});
    }, 0);
  }
  resolve(){

  }
  reject(){

  }
  static defer(){

  }
  static all(){

  }
  static resolve(){

  }
  static reject(){

  }
}
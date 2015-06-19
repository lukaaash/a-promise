

// @Compiler-Output "../Dist/Promise.js"
// @Compiler-Transpile "true"
"use strict"
// State:Pending = 0
// State:Success = 1
// State:Failure = 2
class Promise{
  constructor(Callback, Skip){
    this.State = 0
    this.OnError = null
    this.OnSuccess = null
    this.Result = null
    if(!Skip){
      let Me = this
      Callback(function(Result){Me.resolve(Result)}, function(Result){Me.reject(Result)})
    }
  }
  onError(Callback){
    if(this.State === 0){
      this.OnError = this.OnError || []
      this.OnError.push(Callback)
    }
    else if(this.State === 2)
      Callback(this.Result)
  }
  onSuccess(Callback){
    if(this.State === 0){
      this.OnSuccess = this.OnSuccess || []
      this.OnSuccess.push(Callback)
    }
    else if(this.State === 1)
      Callback(this.Result)
  }
  resolve(Value){
    if(this.State === 0){
      this.State = 1
      let Me = this
      if(Value && Value.then){
        Value.then(function(Value){ Me.resolve(Value) })
      } else {
        setTimeout(function(){
          Me.Result = Value
          if(Me.OnSuccess) Me.OnSuccess.forEach(function(OnSuccess){ OnSuccess(Value) })
        }, 0)
      }
    }
  }
  reject(Value){
    if(this.State === 0){
      this.State = 2
      let Me = this
      if(Value && Value.then){
        Value.then(function(Value){ Me.reject(Value) })
      } else {
        setTimeout(function(){
          Me.Result = Value
          if(Me.OnError) Me.OnError.forEach(function(OnSuccess){ OnSuccess(Value) })
        }, 0)
      }
    }
  }
  then(CallbackS, CallbackE){
    let Instance = new Promise(null, true)
    this.onSuccess(function(Value){
      if(typeof CallbackS === 'function') Instance.resolve(CallbackS(Value))
      else Instance.resolve(Value)
    })
    this.onError(function(Value){
      if(typeof CallbackE === 'function') Instance.resolve(CallbackE(Value))
      else Instance.reject(Value)
    })
    return Instance
  }
  catch(CallbackE){
    let Instance = new Promise(null, true)
    this.onSuccess(function(Value){
      Instance.resolve(Value)
    })
    this.onError(function(Value){
      if(typeof CallbackE === 'function') Instance.resolve(CallbackE(Value))
      else Instance.reject(Value)
    })
    return Instance
  }
  static all(Iterable){
    if(typeof Iterable === 'undefined') throw new Error("Promise.all expects parameter one to be an iterable")
    let Instance = new Promise(null, true)
    let Promises = []
    let ToReturn = []
    let Number = 0
    for(var Index in Iterable){
      let Val = Iterable[Index]
      if(Val && Val.then) Promises[Number] = Val
      else ToReturn[Number] = Val
      ++Number
    }
    if(Number === ToReturn.length) Instance.resolve(ToReturn)
    Promises.forEach(function(Value, Index){
      Value.then(function(TheVal){
        ToReturn[Index] = TheVal
        if(Number === ToReturn.length) Instance.resolve(ToReturn)
      });
    })
    return Instance
  }
  static defer(){
    let Instance = new Promise(null, true)
    return {
      promise: Instance,
      resolve: function(Value){ Instance.resolve(Value) },
      reject: function(Value){ Instance.reject(Value) }
    }
  }
  static resolve(Value){
    let Instance = new Promise(null, true)
    Instance.State = 1
    Instance.Result = Value
    return Instance
  }
  static reject(Value){
    let Instance = new Promise(null, true)
    Instance.State = 2
    Instance.Result = Value
    return Instance
  }
}

module.exports = Promise
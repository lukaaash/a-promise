function requireUncached(module){
  delete require.cache[require.resolve(module)]
  return require(module)
}
var Promise = requireUncached('../lib/build/main.js');

function GenPromise(time){
  return new Promise(function(resolve){setTimeout(resolve,time);});
}
function GenFailingPromise(time){
  return new Promise(function(resolve,reject){setTimeout(function(){
    reject("ads");
  },time);});
}
console.time("Time");

Promise.all([
  GenPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),
  GenPromise(1000),GenFailingPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),
  GenPromise(2000),GenPromise(2000),GenPromise(2000),GenPromise(2000),GenPromise(2000),
  GenPromise(3000),GenPromise(3000),GenPromise(3000),GenPromise(3000),GenPromise(3000)]).then(function(){
  console.timeEnd("Time");
},function(){
  console.log("It failed");
});

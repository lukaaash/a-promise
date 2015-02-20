var Promise = require('../lib/build/main.js');

function GenPromise(time){
  return new Promise(function(resolve){setTimeout(resolve,time);});
}
console.time("Time");

Promise.all([
  GenPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),
  GenPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),GenPromise(1000),
  GenPromise(2000),GenPromise(2000),GenPromise(2000),GenPromise(2000),GenPromise(2000),
  GenPromise(3000),GenPromise(3000),GenPromise(3000),GenPromise(3000),GenPromise(3000)]).then(function(){
  console.timeEnd("Time");
});

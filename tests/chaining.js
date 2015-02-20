var Promise = require('../lib/build/main.js');
function FFirst(){
  console.log("First");
}
function FSecond(){
  console.log("Second");
}
function FThird(){
  console.log("Third");
}
(new Promise(function(resolve){resolve()})).then(FFirst).then(FSecond).then(FThird);
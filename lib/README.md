A Promise
=========

An extremely lightweight Promise Polyfill for NodeJS. It doesn't support all the features yet, but It supports what a normal person needs to keep the code clean.
If you need something added, just open an issue.

### Installation
```
npm install a-promise
```

### Example

In case you don't know what Promises are, then this example should give you a basic intro.
```js
// Without Promises
myFunction(arg1,arg2,arg3,function(){
  myOtherFunction(arg1,arg2,arg3,function(){
  
  })
});
// With Promises
myFunction(arg1,arg2,arg3).then(function(){
  myOtherFunction(arg1,arg2,arg3).then(function(){
  
  });
});
```
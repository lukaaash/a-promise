A Promise
=========

An extremely lightweight Promise Polyfill for Node and Browsers. It doesn't support all the features yet, but It supports what a normal person needs to keep the code clean.
If you need something added, just open an issue.

### Installation
```
npm install a-promise
```

### Example

In case you don't know what Promises are, then this example should give you a basic intro.
```js
function MyFunction(Num){
  return new Promise(function(Resolve, Reject){
    // Do something asyncly
    Resolve(Num * 100);
  });
}
MyFunction(5).then(function(Result){
  console.log(Result); // Outputs 500
});
```
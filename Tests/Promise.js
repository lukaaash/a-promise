var
  assert = require('assert'),
  Promise = require('../Built/Main.js');

describe('Promise', function(){
  describe('Promise.prototype.resolve', function(){
    it('works',function(){
      (new Promise(function(resolve){
        resolve(true);
      })).then(function(RetVal){
          assert.strictEqual(RetVal, true);
      });
    });
  });
  describe('Promise.prototype.reject', function(){
    it('works',function(){
      (new Promise(function(_,reject){
        reject(true);
      })).then(null, function(ErrVal){
          assert.strictEqual(ErrVal, true);
      });
    });
  });
});
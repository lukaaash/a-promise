var
  Promise = require('../Built/Main.js'),
  assert = require('assert');
describe('Promise', function(){
  describe('Promise.prototype.resolve | Promise.prototype.then', function(){
    it('works',function(){
      (new Promise(function(resolve){
        resolve(true);
      })).then(function(RetVal){
          assert(RetVal,true);
      });
    });
  });
  describe('Error Handling', function(){
    it('Cries when you don\'t catch rejection', function(){
      try {
        new Promise(function(){
          throw new Error();
        });
      } catch(Err){
        assert.strictEqual(Err.constructor.name, 'Error');
      }
    });
  });
});
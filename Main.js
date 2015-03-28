

if(typeof Promise == 'undefined'){
  module.exports = require('./Dist/Promise.js');
} else {
  module.exports = Promise;
}
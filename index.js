var Promise = require('bluebird');

module.exports = function finalizeEach(suite, wrapper) {
  suite.on('suite', childSuite => {
    finalizeEach(childSuite, wrapper);
  })
  
  suite.on('test', test => {
    var originalFn = test.fn;
    
    if(originalFn.length > 0) {
      test.fn = function(done) {
        return wrapper(Promise.fromCallback(done => {
          return originalFn.call(this, done);
        })).asCallback(done);
      };
    } else {
      test.fn = function() {
        return wrapper(Promise.try(() => originalFn.call(this)));
      };
    }
  });
};

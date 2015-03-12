"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Promise = (function () {
  function Promise(Callback) {
    var async = arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Promise);

    this.OnSuccess = [];
    this.OnError = [];
    this.Result = [];
    this.Status = 0;
    if (typeof Callback !== "function") {
      return;
    }
    try {
      if (async) {
        setTimeout(Callback.call(this, this.resolve.bind(this), this.reject.bind(this)), 0);
      } else {
        Callback.call(this, this.resolve.bind(this), this.reject.bind(this));
      }
    } catch (Err) {
      this.reject(Err);
    }
  }

  _prototypeProperties(Promise, {
    resolve: {
      value: function resolve(LeArgs) {
        return new Promise(function (resolve) {
          resolve(LeArgs);
        });
      },
      writable: true,
      configurable: true
    },
    reject: {
      value: function reject(LeArgs) {
        return new Promise(function (resolve, reject) {
          reject(LeArgs);
        });
      },
      writable: true,
      configurable: true
    },
    all: {
      value: function all(Promises) {
        return new Promise(function (resolve, reject) {
          var ValidPromises = [],
              Results = [],
              Finished = false;
          Promises.forEach(function (Entry) {
            var ResultIndex;
            if (Entry instanceof Promise) {
              ValidPromises.push(Entry);
              ResultIndex = ValidPromises.indexOf(Entry);
              Results.push(null);
              Entry.then(function (Result) {
                Results[ResultIndex] = Result;
                ValidPromises.splice(ValidPromises.indexOf(Entry), 1);
                if (ValidPromises.length === 0 && !Finished) {
                  Finished = true;
                  resolve(Results);
                }
              })["catch"](function (error) {
                if (!Finished) {
                  Finished = true;
                  reject(error);
                }
              });
            }
          });
          if (!ValidPromises.length) {
            resolve();
          }
        });
      },
      writable: true,
      configurable: true
    }
  }, {
    then: {
      value: function then(OnSuccess, OnFailure) {
        return new Promise((function (resolve) {
          if (typeof OnSuccess === "function") {
            var LeSuccess = function LeSuccess() {
              var LeResult = OnSuccess.apply(null, arguments);
              if (LeResult instanceof Promise) {
                LeResult.then(resolve);
              } else {
                resolve.apply(null, arguments);
              }
            };
            if (this.Status === 1) {
              LeSuccess.apply(null, this.Result);
            } else if (this.Status === 0) {
              this.OnSuccess.push(LeSuccess);
            }
          }
          if (typeof OnFailure === "function") {
            this["catch"](OnFailure);
          }
        }).bind(this));
      },
      writable: true,
      configurable: true
    },
    "catch": {
      value: function _catch(OnFailure) {
        if (typeof OnFailure === "function") {
          if (this.Status === 2) {
            OnFailure.apply(null, this.Result);
          } else if (this.Status === 0) {
            this.OnError.push(OnFailure);
          }
        }
      },
      writable: true,
      configurable: true
    },
    resolve: {
      value: function resolve() {
        this.Status = 1;
        var args = arguments;
        this.Result = args;
        this.OnSuccess.forEach(function (c) {
          c.apply(null, args);
        });
      },
      writable: true,
      configurable: true
    },
    reject: {
      value: function reject() {
        var args = arguments;
        this.Result = args;
        this.Status = 2;
        if (this.OnError.length) {
          this.OnError.forEach(function (c) {
            c.apply(null, args);
          });
        } else {
          throw new Error("Uncaught Promise Rejection");
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Promise;
})();

module.exports = Promise;
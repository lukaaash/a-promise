"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Promise = (function () {
  function Promise(Callback) {
    this.OnError = [];
    this.OnSuccess = [];
    this.State = Promise.State.PENDING;

    _classCallCheck(this, Promise);

    if (typeof Callback == "function") {
      setTimeout((function () {
        Callback.call(null, this.resolve.bind(this), this.reject.bind(this));
      }).bind(this), 10);
    }
  }

  Promise.State = { PENDING: 0, FAILURE: 2, SUCCESS: 1 };

  _prototypeProperties(Promise, {
    resolve: {
      value: function resolve(Result) {
        return new Promise(function (resolve) {
          resolve(Result);
        });
      },
      writable: true,
      configurable: true
    },
    reject: {
      value: function reject(Result) {
        return new Promise(function (resolve, reject) {
          reject(Result);
        });
      },
      writable: true,
      configurable: true
    },
    all: {
      value: function all(Promises) {
        return new Promise(function (resolve, reject) {
          var ValidPromises = [],
              Status = Promise.State.PENDING,
              ProcessedPromises = 0,
              Results = [];
          Promises.forEach(function (PromiseInst) {
            if (PromiseInst instanceof Promise) {
              ValidPromises.push(PromiseInst);
            }
          });
          if (!ValidPromises.length) {
            return resolve(Results);
          }
          ValidPromises.forEach(function (PromiseInst, Index) {
            PromiseInst.then(function (Result) {
              ProcessedPromises++;
              Results[Index] = Result;
              if (ProcessedPromises === ValidPromises.length) {
                resolve(Results);
              }
            }, function (Error) {
              Status = Promise.State.FAILURE;
              reject(Error);
            });
          });
        });
      },
      writable: true,
      configurable: true
    }
  }, {
    resolve: {
      value: function resolve(Result) {
        if (this.State !== Promise.State.PENDING) {
          return;
        }
        this.State = Promise.State.SUCCESS;
        this.Result = Result;
        this.OnSuccess.forEach(function (Callback) {
          Callback(Result);
        });
      },
      writable: true,
      configurable: true
    },
    reject: {
      value: function reject(ErrorMessage) {
        if (this.State !== Promise.State.PENDING) {
          return;
        }
        this.State = Promise.State.FAILURE;
        this.Result = ErrorMessage;
        if (this.OnError.length) {
          this.OnError.forEach(function (Callback) {
            Callback(ErrorMessage);
          });
        } else {
          throw new Error("Uncaught Promise Rejection", ErrorMessage);
        }
      },
      writable: true,
      configurable: true
    },
    "catch": {
      value: function _catch(Callback) {
        if (typeof Callback !== "function") {
          throw new Error("Callback for Promise.catch should be a function");
        }
        if (this.State === Promise.State.PENDING) {
          this.OnError.push(Callback);
        } else if (this.State === Promise.State.FAILURE) {
          Callback(this.Result);
        }
        return this;
      },
      writable: true,
      configurable: true
    },
    then: {
      value: function then(Callback, OnError) {
        if (typeof Callback !== "function" || OnError && typeof OnError !== "function") {
          throw new Error("Callback(s) for Promise.then should be a function");
        }
        if (this.State === Promise.State.PENDING) {
          this.OnSuccess.push(Callback);
        } else if (this.State === Promise.State.SUCCESS) {
          Callback(this.Result);
        }
        if (OnError) {
          this["catch"](OnError);
        }
        return this;
      },
      writable: true,
      configurable: true
    }
  });

  return Promise;
})();

module.exports = Promise;
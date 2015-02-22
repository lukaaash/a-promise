"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Promise = (function () {
  function Promise(callback) {
    _classCallCheck(this, Promise);

    if (this === "undefined") {
      throw new Error("No direct access, must be initialized like a class");
    }
    this.OnSuccess = [];
    this.OnError = [];
    this.Result = [];
    this.Fulfilled = 0;
    if (typeof callback === "function") {
      setTimeout((function () {
        try {
          callback.call(this, this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
          if (this.OnError.length) {
            this.reject(error);
          } else {
            throw error;
          }
        }
      }).bind(this), 0); // An async like behaviour
    }
  }

  _prototypeProperties(Promise, {
    resolve: {
      value: function (LeArgs) {
        return new Promise(function (resolve) {
          resolve(LeArgs);
        });
      },
      writable: true,
      configurable: true
    },
    reject: {
      value: function (LeArgs) {
        return new Promise(function (resolve, reject) {
          reject(LeArgs);
        });
      },
      writable: true,
      configurable: true
    },
    all: {
      value: function (Promises) {
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
                Finished = true;
                reject(error);
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
      value: function (OnSuccess, OnFailure) {
        if (typeof OnSuccess === "function") {
          this.OnSuccess.push(OnSuccess);
        }
        if (typeof OnFailure === "function") {
          this.OnError.push(OnFailure);
        }
        return this;
      },
      writable: true,
      configurable: true
    },
    "catch": {
      value: function (OnFailure) {
        if (typeof OnFailure === "function") {
          if (this.Fulfilled === 2) {
            OnFailure.apply(null, this.Result);
          } else if (this.Fulfilled === 0) {
            this.OnError.push(OnFailure);
          }
        }
        return this;
      },
      writable: true,
      configurable: true
    },
    resolve: {
      value: function () {
        if (this.Fulfilled !== 0) {
          return;
        }
        this.Fulfilled = 1;
        var args = arguments;
        this.Result = args;
        this.OnSuccess.forEach(function (c) {
          c.apply(null, args);
        });
        return this;
      },
      writable: true,
      configurable: true
    },
    reject: {
      value: function () {
        if (this.Fulfilled !== 0) {
          return;
        }
        var args = arguments;
        this.Result = args;
        this.Fulfilled = 2;
        this.OnError.forEach(function (c) {
          c.apply(null, args);
        });
        return this;
      },
      writable: true,
      configurable: true
    }
  });

  return Promise;
})();

module.exports = Promise;
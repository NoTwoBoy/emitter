"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * @Description: 订阅发布器
 * @Date: 2021-11-16 15:31:17
 * @LastEditTime: 2021-11-17 16:28:08
 * @FilePath: \emitter\emitter.js
 */
var Emitter = /*#__PURE__*/function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    this.events = new Map();
  }

  _createClass(Emitter, [{
    key: "once",
    value: function once(name, callback, context) {
      var self = this;

      if (!this.events.get(name)) {
        this.events.set(name, []);
      }

      var listener = function listener() {
        self.off(name, listener, context);
        callback.apply(context, arguments);
      };

      return this.on(name, listener, context);
    }
  }, {
    key: "on",
    value: function on(name, callback, context) {
      if (!this.events.has(name)) {
        this.events.set(name, []);
      }

      this.events.get(name).push({
        callback: callback,
        context: context
      });
      return this;
    }
  }, {
    key: "emit",
    value: function emit(name) {
      var args = [].slice.call(arguments, 1);

      if (this.events.has(name)) {
        var eventsArray = this.events.get(name).slice();
        eventsArray.forEach(function (event) {
          event.callback.apply(event.context, args);
        });
      }

      return this;
    }
  }, {
    key: "off",
    value: function off(name, callback) {
      var liveEvents = [];

      if (this.events.has(name)) {
        var currentEvents = this.events.get(name);

        if (currentEvents.length && callback) {
          currentEvents.forEach(function (event) {
            if (event.callback !== callback && event.callback._ !== callback) liveEvents.push(callback);
          });
        }
      }

      liveEvents.length ? this.events.set(name, liveEvents) : this.events["delete"](name);
      return this;
    }
  }]);

  return Emitter;
}();

var emitter = new Emitter();
var _default = emitter;
exports["default"] = _default;
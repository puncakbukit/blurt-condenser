"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _immutable = _interopRequireDefault(require("immutable"));
var _GlobalReducer = _interopRequireWildcard(require("../GlobalReducer"));
var globalActions = _GlobalReducer;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
/* global describe, it, before, beforeEach, after, afterEach */

describe('global reducer', function () {
  it('should return empty state', function () {
    var reduced = (0, _GlobalReducer["default"])(undefined, {});
    expect(reduced.toJS()).toEqual({
      status: {}
    });
  });
  it('should apply new global state', function () {
    var state = _immutable["default"].fromJS(require('./global.json'));
    var reduced = (0, _GlobalReducer["default"])(undefined, globalActions.receiveState(state));
    // const action = {type: 'global/RECEIVE_STATE', payload: state};
    expect(reduced.toJS()).toEqual(state.toJS());
  });
});
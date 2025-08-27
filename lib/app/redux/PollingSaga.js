"use strict";

var _regeneratorRuntime2 = require("@babel/runtime/regenerator");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopPolling = exports.startPolling = void 0;
exports.watchPollingTasks = watchPollingTasks;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _effects = require("redux-saga/effects");
var _reduxSaga = require("redux-saga");
var _marked = /*#__PURE__*/_regeneratorRuntime2.mark(poll),
  _marked2 = /*#__PURE__*/_regeneratorRuntime2.mark(watchPollingTasks);
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var START_POLLING = 'START_POLLING';
var STOP_POLLING = 'STOP_POLLING';
function poll(action) {
  var params, _t;
  return _regenerator["default"].wrap(function (_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        params = _objectSpread({}, action.payload);
      case 1:
        if (!true) {
          _context.next = 7;
          break;
        }
        _context.prev = 2;
        _context.next = 3;
        return (0, _effects.put)(params.pollAction(params.pollPayload));
      case 3:
        _context.next = 4;
        return (0, _effects.call)(_reduxSaga.delay, params.delay);
      case 4:
        _context.next = 6;
        break;
      case 5:
        _context.prev = 5;
        _t = _context["catch"](2);
        _context.next = 6;
        return (0, _effects.put)(stopPolling());
      case 6:
        _context.next = 1;
        break;
      case 7:
      case "end":
        return _context.stop();
    }
  }, _marked, null, [[2, 5]]);
}
function watchPollingTasks() {
  var action;
  return _regenerator["default"].wrap(function (_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        if (!true) {
          _context2.next = 3;
          break;
        }
        _context2.next = 1;
        return (0, _effects.take)(START_POLLING);
      case 1:
        action = _context2.sent;
        _context2.next = 2;
        return (0, _effects.race)([(0, _effects.call)(poll, action), (0, _effects.take)(STOP_POLLING)]);
      case 2:
        _context2.next = 0;
        break;
      case 3:
      case "end":
        return _context2.stop();
    }
  }, _marked2);
}
var startPolling = exports.startPolling = function startPolling(payload) {
  return {
    type: START_POLLING,
    payload: payload
  };
};
var stopPolling = exports.stopPolling = function stopPolling(payload) {
  return {
    type: STOP_POLLING,
    payload: payload
  };
};
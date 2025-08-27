"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var _regeneratorRuntime2 = require("@babel/runtime/regenerator");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccount = getAccount;
exports.getContent = getContent;
exports.getState = getState;
exports.sharedWatches = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _immutable = require("immutable");
var _effects = require("redux-saga/effects");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _blurtjs = require("@blurtfoundation/blurtjs");
var globalActions = _interopRequireWildcard(require("./GlobalReducer"));
var appActions = _interopRequireWildcard(require("./AppReducer"));
var transactionActions = _interopRequireWildcard(require("./TransactionReducer"));
var _ServerApiClient = require("app/utils/ServerApiClient");
var _steemApi = require("app/utils/steemApi");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
var _marked = /*#__PURE__*/_regeneratorRuntime2.mark(showTransactionErrorNotification);
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var wait = function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      return resolve();
    }, ms);
  });
};
var sharedWatches = exports.sharedWatches = [(0, _effects.takeEvery)(globalActions.GET_STATE, getState), (0, _effects.takeLatest)([appActions.SET_USER_PREFERENCES, appActions.TOGGLE_NIGHTMODE, appActions.TOGGLE_BLOGMODE], saveUserPreferences), (0, _effects.takeEvery)('transaction/ERROR', showTransactionErrorNotification)];
function getAccount(username) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var account, isLite, _yield$call, _yield$call2;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 1;
          return (0, _effects.select)(function (state) {
            return state.global.get('accounts').get(username);
          });
        case 1:
          account = _context.sent;
          // hive never serves `owner` prop (among others)
          isLite = !!account && !account.get('owner');
          if (!(!account || force || isLite)) {
            _context.next = 3;
            break;
          }
          console.log('getAccount: loading', username, 'force?', force, 'lite?', isLite);
          _context.next = 2;
          return (0, _effects.call)([_blurtjs.api, _blurtjs.api.getAccountsAsync], [username]);
        case 2:
          _yield$call = _context.sent;
          _yield$call2 = (0, _slicedToArray2["default"])(_yield$call, 1);
          account = _yield$call2[0];
          if (!account) {
            _context.next = 3;
            break;
          }
          account = (0, _immutable.fromJS)(account);
          _context.next = 3;
          return (0, _effects.put)(globalActions.receiveAccount({
            account: account
          }));
        case 3:
          return _context.abrupt("return", account);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })();
}

/** Manual refreshes.  The router is in FetchDataSaga. */
function getState(_ref) {
  var url = _ref.payload.url;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var state, _t;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return (0, _effects.call)(_steemApi.getStateAsync, url);
        case 1:
          state = _context2.sent;
          _context2.next = 2;
          return (0, _effects.put)(globalActions.receiveState(state));
        case 2:
          _context2.next = 4;
          break;
        case 3:
          _context2.prev = 3;
          _t = _context2["catch"](0);
          console.error('~~ Saga getState error ~~>', url, _t);
          _context2.next = 4;
          return (0, _effects.put)(appActions.steemApiError(_t.message));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 3]]);
  })();
}
function showTransactionErrorNotification() {
  var errors, _iterator, _step, _step$value, key, message, _t2;
  return _regenerator["default"].wrap(function (_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        _context3.next = 1;
        return (0, _effects.select)(function (state) {
          return state.transaction.get('errors');
        });
      case 1:
        errors = _context3.sent;
        _iterator = _createForOfIteratorHelper(errors);
        _context3.prev = 2;
        _iterator.s();
      case 3:
        if ((_step = _iterator.n()).done) {
          _context3.next = 7;
          break;
        }
        _step$value = (0, _slicedToArray2["default"])(_step.value, 2), key = _step$value[0], message = _step$value[1];
        if (!(key === 'bandwidthError' || key === 'transactionFeeError')) {
          _context3.next = 4;
          break;
        }
        _context3.next = 6;
        break;
      case 4:
        _context3.next = 5;
        return (0, _effects.put)(appActions.addNotification({
          key: key,
          message: message
        }));
      case 5:
        _context3.next = 6;
        return (0, _effects.put)(transactionActions.deleteError({
          key: key
        }));
      case 6:
        _context3.next = 3;
        break;
      case 7:
        _context3.next = 9;
        break;
      case 8:
        _context3.prev = 8;
        _t2 = _context3["catch"](2);
        _iterator.e(_t2);
      case 9:
        _context3.prev = 9;
        _iterator.f();
        return _context3.finish(9);
      case 10:
      case "end":
        return _context3.stop();
    }
  }, _marked, null, [[2, 8, 9, 10]]);
}
function getContent(_ref2) {
  var author = _ref2.author,
    permlink = _ref2.permlink,
    resolve = _ref2.resolve,
    reject = _ref2.reject;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var content;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (content) {
            _context4.next = 3;
            break;
          }
          _context4.next = 1;
          return (0, _effects.call)([_blurtjs.api, _blurtjs.api.getContentAsync], author, permlink);
        case 1:
          content = _context4.sent;
          if (!(content.author == '')) {
            _context4.next = 2;
            break;
          }
          // retry if content not found. #1870
          content = null;
          _context4.next = 2;
          return (0, _effects.call)(wait, 3000);
        case 2:
          _context4.next = 0;
          break;
        case 3:
          _context4.next = 4;
          return (0, _effects.put)(globalActions.receiveContent({
            content: content
          }));
        case 4:
          if (resolve && content) {
            resolve(content);
          } else if (reject && !content) {
            reject();
          }
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee3);
  })();
}

/**
 * Save this user's preferences, either directly from the submitted payload or from whatever's saved in the store currently.
 *
 * @param {Object?} params.payload
 */
function saveUserPreferences(_ref3) {
  var payload = _ref3.payload;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var prefs;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (!payload) {
            _context5.next = 1;
            break;
          }
          _context5.next = 1;
          return (0, _ServerApiClient.setUserPreferences)(payload);
        case 1:
          _context5.next = 2;
          return (0, _effects.select)(function (state) {
            return state.app.get('user_preferences');
          });
        case 2:
          prefs = _context5.sent;
          _context5.next = 3;
          return (0, _ServerApiClient.setUserPreferences)(prefs.toJS());
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee4);
  })();
}
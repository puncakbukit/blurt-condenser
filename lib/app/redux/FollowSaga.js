"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFollowCount = fetchFollowCount;
exports.loadFollows = loadFollows;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _immutable = require("immutable");
var _effects = require("redux-saga/effects");
var _blurtjs = require("@blurtfoundation/blurtjs");
var globalActions = _interopRequireWildcard(require("app/redux/GlobalReducer"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
var _marked = /*#__PURE__*/_regenerator["default"].mark(fetchFollowCount);
/**
    This loadFollows both 'blog' and 'ignore'
*/

// fetch for follow/following count
function fetchFollowCount(account) {
  var counts;
  return _regenerator["default"].wrap(function (_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 1;
        return (0, _effects.call)([_blurtjs.api, _blurtjs.api.getFollowCountAsync], account);
      case 1:
        counts = _context.sent;
        _context.next = 2;
        return (0, _effects.put)(globalActions.update({
          key: ['follow_count', account],
          updater: function updater(m) {
            return m.mergeDeep({
              follower_count: counts.follower_count,
              following_count: counts.following_count
            });
          }
        }));
      case 2:
      case "end":
        return _context.stop();
    }
  }, _marked);
}

// Test limit with 2 (not 1, infinate looping)
function loadFollows(method, account, type) {
  var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var hasResult;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 1;
          return (0, _effects.select)(function (state) {
            return state.global.getIn(['follow', method, account, type + '_loading']);
          });
        case 1:
          if (!_context2.sent) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return");
        case 2:
          if (force) {
            _context2.next = 4;
            break;
          }
          _context2.next = 3;
          return (0, _effects.select)(function (state) {
            return state.global.hasIn(['follow', method, account, type + '_result']);
          });
        case 3:
          hasResult = _context2.sent;
          if (!hasResult) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return");
        case 4:
          _context2.next = 5;
          return (0, _effects.put)(globalActions.update({
            key: ['follow', method, account],
            notSet: (0, _immutable.Map)(),
            updater: function updater(m) {
              return m.set(type + '_loading', true);
            }
          }));
        case 5:
          _context2.next = 6;
          return loadFollowsLoop(method, account, type);
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee);
  })();
}
function loadFollowsLoop(method, account, type) {
  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1000;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var res, cnt, lastAccountName, _t;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _t = _immutable.fromJS;
          _context3.next = 1;
          return _blurtjs.api[method](account, start, type, limit);
        case 1:
          res = _t(_context3.sent);
          // console.log('res.toJS()', res.toJS())
          cnt = 0;
          lastAccountName = null;
          _context3.next = 2;
          return (0, _effects.put)(globalActions.update({
            key: ['follow_inprogress', method, account],
            notSet: (0, _immutable.Map)(),
            updater: function updater(m) {
              m = m.asMutable();
              res.forEach(function (value) {
                cnt += 1;
                var whatList = value.get('what');
                var accountNameKey = method === 'getFollowingAsync' ? 'following' : 'follower';
                var accountName = lastAccountName = value.get(accountNameKey);
                whatList.forEach(function (what) {
                  // currently this is always true: what === type
                  m.update(what, (0, _immutable.OrderedSet)(), function (s) {
                    return s.add(accountName);
                  });
                });
              });
              return m.asImmutable();
            }
          }));
        case 2:
          if (!(cnt === limit)) {
            _context3.next = 4;
            break;
          }
          _context3.next = 3;
          return (0, _effects.call)(loadFollowsLoop, method, account, type, lastAccountName);
        case 3:
          _context3.next = 5;
          break;
        case 4:
          _context3.next = 5;
          return (0, _effects.put)(globalActions.update({
            key: [],
            updater: function updater(m) {
              m = m.asMutable();
              var result = m.getIn(['follow_inprogress', method, account, type], (0, _immutable.OrderedSet)());
              m.deleteIn(['follow_inprogress', method, account, type]);
              m.updateIn(['follow', method, account], (0, _immutable.Map)(), function (mm) {
                return mm.merge((0, _defineProperty2["default"])((0, _defineProperty2["default"])((0, _defineProperty2["default"])({}, type + '_count', result.size), type + '_result', result.reverse()), type + '_loading', false));
              });
              return m.asImmutable();
            }
          }));
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  })();
}
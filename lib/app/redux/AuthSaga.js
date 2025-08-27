"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accountAuthLookup = accountAuthLookup;
exports.authWatches = void 0;
exports.findSigningKey = findSigningKey;
exports.postingOps = void 0;
exports.threshold = threshold;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _effects = require("redux-saga/effects");
var _immutable = require("immutable");
var _blurtjs = require("@blurtfoundation/blurtjs");
var _ecc = require("@blurtfoundation/blurtjs/lib/auth/ecc");
var _SagaShared = require("app/redux/SagaShared");
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t9 in e) "default" !== _t9 && {}.hasOwnProperty.call(e, _t9) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t9)) && (i.get || i.set) ? o(f, _t9, i) : f[_t9] = e[_t9]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// operations that require only posting authority
var postingOps = exports.postingOps = (0, _immutable.Set)('vote, comment, delete_comment, custom_json, claim_reward_balance'.trim().split(/,\s*/));
var authWatches = exports.authWatches = [(0, _effects.takeEvery)('user/ACCOUNT_AUTH_LOOKUP', accountAuthLookup)];
function accountAuthLookup(_ref) {
  var _ref$payload = _ref.payload,
    account = _ref$payload.account,
    private_keys = _ref$payload.private_keys,
    login_owner_pubkey = _ref$payload.login_owner_pubkey;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var stateUser, keys, toPub, posting, active, owner, memo, auth, accountName, pub_keys_used, _t, _t2, _t3, _t4, _t5, _t6, _t7;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          account = (0, _immutable.fromJS)(account);
          private_keys = (0, _immutable.fromJS)(private_keys);
          // console.log('accountAuthLookup', account.name)
          _context.next = 1;
          return (0, _effects.select)(function (state) {
            return state.user;
          });
        case 1:
          stateUser = _context.sent;
          if (private_keys) keys = private_keys;else keys = stateUser.getIn(['current', 'private_keys']);
          if (!(!keys || !keys.has('posting_private'))) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return");
        case 2:
          toPub = function toPub(k) {
            return k ? k.toPublicKey().toString() : '-';
          };
          posting = keys.get('posting_private');
          active = keys.get('active_private');
          owner = keys.get('active_private');
          memo = keys.get('memo_private');
          if (!posting) {
            _context.next = 4;
            break;
          }
          _context.next = 3;
          return authorityLookup({
            pubkeys: (0, _immutable.Set)([toPub(posting)]),
            authority: account.get('posting'),
            authType: 'posting'
          });
        case 3:
          _t = _context.sent;
          _context.next = 5;
          break;
        case 4:
          _t = 'none';
        case 5:
          _t2 = _t;
          if (!active) {
            _context.next = 7;
            break;
          }
          _context.next = 6;
          return authorityLookup({
            pubkeys: (0, _immutable.Set)([toPub(active)]),
            authority: account.get('active'),
            authType: 'active'
          });
        case 6:
          _t3 = _context.sent;
          _context.next = 8;
          break;
        case 7:
          _t3 = 'none';
        case 8:
          _t4 = _t3;
          if (!owner) {
            _context.next = 10;
            break;
          }
          _context.next = 9;
          return authorityLookup({
            pubkeys: (0, _immutable.Set)([toPub(active)]),
            authority: account.get('owner'),
            authType: 'owner'
          });
        case 9:
          _t5 = _context.sent;
          _context.next = 11;
          break;
        case 10:
          _t5 = 'none';
        case 11:
          _t6 = _t5;
          _t7 = account.get('memo_key') === toPub(memo) ? 'full' : 'none';
          auth = {
            posting: _t2,
            active: _t4,
            owner: _t6,
            memo: _t7
          };
          accountName = account.get('name');
          pub_keys_used = {
            posting: toPub(posting),
            active: toPub(active),
            owner: login_owner_pubkey
          };
          _context.next = 12;
          return (0, _effects.put)(userActions.setAuthority({
            accountName: accountName,
            auth: auth,
            pub_keys_used: pub_keys_used
          }));
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })();
}

/**
    @arg {object} data
    @arg {object} data.authority Immutable Map blockchain authority
    @arg {object} data.pubkeys Immutable Set public key strings
    @return {string} full, partial, none
*/
function authorityLookup(_ref2) {
  var pubkeys = _ref2.pubkeys,
    authority = _ref2.authority,
    authType = _ref2.authType;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 1;
          return (0, _effects.call)(authStr, {
            pubkeys: pubkeys,
            authority: authority,
            authType: authType
          });
        case 1:
          return _context2.abrupt("return", _context2.sent);
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })();
}
function authStr(_ref3) {
  var pubkeys = _ref3.pubkeys,
    authority = _ref3.authority,
    authType = _ref3.authType,
    _ref3$recurse = _ref3.recurse,
    recurse = _ref3$recurse === void 0 ? 1 : _ref3$recurse;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var t, r;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return (0, _effects.call)(threshold, {
            pubkeys: pubkeys,
            authority: authority,
            authType: authType,
            recurse: recurse
          });
        case 1:
          t = _context3.sent;
          r = authority.get('weight_threshold');
          return _context3.abrupt("return", t >= r ? 'full' : t > 0 ? 'partial' : 'none');
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })();
}
function threshold(_ref4) {
  var pubkeys = _ref4.pubkeys,
    authority = _ref4.authority,
    authType = _ref4.authType,
    _ref4$recurse = _ref4.recurse,
    recurse = _ref4$recurse === void 0 ? 1 : _ref4$recurse;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var t, account_auths, aaNames, aaAccounts, aaThreshes, i, aaAccount, auth, aaThresh;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (pubkeys.size) {
            _context4.next = 1;
            break;
          }
          return _context4.abrupt("return", 0);
        case 1:
          t = pubkeyThreshold({
            pubkeys: pubkeys,
            authority: authority
          });
          account_auths = authority.get('account_auths');
          aaNames = account_auths.map(function (v) {
            return v.get(0);
          }, (0, _immutable.List)());
          if (!aaNames.size) {
            _context4.next = 6;
            break;
          }
          _context4.next = 2;
          return _blurtjs.api.getAccountsAsync(aaNames);
        case 2:
          aaAccounts = _context4.sent;
          aaThreshes = account_auths.map(function (v) {
            return v.get(1);
          }, (0, _immutable.List)());
          i = 0;
        case 3:
          if (!(i < aaAccounts.size)) {
            _context4.next = 6;
            break;
          }
          aaAccount = aaAccounts.get(i);
          t += pubkeyThreshold({
            authority: aaAccount.get(authType),
            pubkeys: pubkeys
          });
          if (!(recurse <= 2)) {
            _context4.next = 5;
            break;
          }
          _context4.next = 4;
          return (0, _effects.call)(authStr, {
            authority: aaAccount,
            pubkeys: pubkeys,
            recurse: ++recurse
          });
        case 4:
          auth = _context4.sent;
          if (auth === 'full') {
            aaThresh = aaThreshes.get(i);
            t += aaThresh;
          }
        case 5:
          i++;
          _context4.next = 3;
          break;
        case 6:
          return _context4.abrupt("return", t);
        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })();
}
function pubkeyThreshold(_ref5) {
  var pubkeys = _ref5.pubkeys,
    authority = _ref5.authority;
  var available = 0;
  var key_auths = authority.get('key_auths');
  key_auths.forEach(function (k) {
    if (pubkeys.has(k.get(0))) {
      available += k.get(1);
    }
  });
  return available;
}
function findSigningKey(_ref6) {
  var opType = _ref6.opType,
    username = _ref6.username,
    password = _ref6.password;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var authTypes, currentUser, currentUsername, private_keys, account, _iterator, _step, authType, private_key, pubkey, pubkeys, authority, auth, _t8;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (postingOps.has(opType)) authTypes = 'posting, active';else authTypes = 'active, owner';
          authTypes = authTypes.split(', ');
          _context5.next = 1;
          return (0, _effects.select)(function (state) {
            return state.user.get('current');
          });
        case 1:
          currentUser = _context5.sent;
          currentUsername = currentUser && currentUser.get('username');
          username = username || currentUsername;
          if (username) {
            _context5.next = 2;
            break;
          }
          return _context5.abrupt("return", null);
        case 2:
          if (username.indexOf('/') > -1) {
            // "alice/active" will login only with Alices active key
            username = username.split('/')[0];
          }
          private_keys = currentUsername === username ? currentUser.get('private_keys') : (0, _immutable.Map)();
          _context5.next = 3;
          return (0, _effects.call)(_SagaShared.getAccount, username);
        case 3:
          account = _context5.sent;
          if (account) {
            _context5.next = 4;
            break;
          }
          throw new Error('Account not found');
        case 4:
          _iterator = _createForOfIteratorHelper(authTypes);
          _context5.prev = 5;
          _iterator.s();
        case 6:
          if ((_step = _iterator.n()).done) {
            _context5.next = 9;
            break;
          }
          authType = _step.value;
          private_key = void 0;
          if (password) {
            try {
              private_key = _ecc.PrivateKey.fromWif(password);
            } catch (e) {
              private_key = _ecc.PrivateKey.fromSeed(username + authType + password);
            }
          } else {
            if (private_keys) {
              private_key = private_keys.get(authType + '_private');
            }
          }
          if (!private_key) {
            _context5.next = 8;
            break;
          }
          pubkey = private_key.toPublicKey().toString();
          pubkeys = (0, _immutable.Set)([pubkey]);
          authority = account.get(authType);
          _context5.next = 7;
          return (0, _effects.call)(authorityLookup, {
            pubkeys: pubkeys,
            authority: authority,
            authType: authType
          });
        case 7:
          auth = _context5.sent;
          if (!(auth === 'full')) {
            _context5.next = 8;
            break;
          }
          return _context5.abrupt("return", private_key);
        case 8:
          _context5.next = 6;
          break;
        case 9:
          _context5.next = 11;
          break;
        case 10:
          _context5.prev = 10;
          _t8 = _context5["catch"](5);
          _iterator.e(_t8);
        case 11:
          _context5.prev = 11;
          _iterator.f();
          return _context5.finish(11);
        case 12:
          return _context5.abrupt("return", null);
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[5, 10, 11, 12]]);
  })();
}

// function isPostingOnlyKey(pubkey, account) {
//     // TODO Support account auths
//     // yield put(g.actions.authLookup({account, pubkeys: pubkey})
//     // authorityLookup({pubkeys, authority: Map(account.posting), authType: 'posting'})
//     for (const p of account.posting.key_auths) {
//         if (pubkey === p[0]) {
//             if (account.active.account_auths.length || account.owner.account_auths.length) {
//                 console.log('UserSaga, skipping save password, account_auths are not yet supported.')
//                 return false
//             }
//             for (const a of account.active.key_auths)
//                 if (pubkey === a[0]) return false
//             for (const a of account.owner.key_auths)
//                 if (pubkey === a[0]) return false
//             return true
//         }
//     }
//     return false
// }
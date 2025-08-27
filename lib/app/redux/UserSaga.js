"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var _regeneratorRuntime2 = require("@babel/runtime/regenerator");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userWatches = void 0;
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _effects = require("redux-saga/effects");
var _blurtjs = require("@blurtfoundation/blurtjs");
var _ecc = require("@blurtfoundation/blurtjs/lib/auth/ecc");
var _AuthSaga = require("app/redux/AuthSaga");
var _SagaShared = require("app/redux/SagaShared");
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var _SteemKeychain = require("app/utils/SteemKeychain");
var _UserUtil = require("app/utils/UserUtil");
var _reactRouter = require("react-router");
var _ServerApiClient = require("app/utils/ServerApiClient");
var _FollowSaga = require("app/redux/FollowSaga");
var _Translator = require("app/Translator");
var _DMCAUserList = _interopRequireDefault(require("app/utils/DMCAUserList"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t5 in e) "default" !== _t5 && {}.hasOwnProperty.call(e, _t5) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t5)) && (i.get || i.set) ? o(f, _t5, i) : f[_t5] = e[_t5]); return f; })(e, t); }
var _marked = /*#__PURE__*/_regeneratorRuntime2.mark(checkKeyType),
  _marked2 = /*#__PURE__*/_regeneratorRuntime2.mark(usernamePasswordLogin),
  _marked3 = /*#__PURE__*/_regeneratorRuntime2.mark(saveLogin_localStorage),
  _marked4 = /*#__PURE__*/_regeneratorRuntime2.mark(logout); //import { fromJS, Set, List } from 'immutable';
var userWatches = exports.userWatches = [(0, _effects.takeLatest)('user/lookupPreviousOwnerAuthority', lookupPreviousOwnerAuthority), (0, _effects.takeLatest)(userActions.CHECK_KEY_TYPE, checkKeyType), (0, _effects.takeLatest)(userActions.USERNAME_PASSWORD_LOGIN, usernamePasswordLogin), (0, _effects.takeLatest)(userActions.SAVE_LOGIN, saveLogin_localStorage), (0, _effects.takeLatest)(userActions.LOGOUT, logout), (0, _effects.takeLatest)(userActions.LOGIN_ERROR, loginError), (0, _effects.takeLatest)(userActions.UPLOAD_IMAGE, uploadImage), (0, _effects.takeLatest)(userActions.ACCEPT_TERMS, /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var _t;
  return _regenerator["default"].wrap(function (_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.prev = 0;
        _context.next = 1;
        return (0, _effects.call)(_ServerApiClient.acceptTos);
      case 1:
        _context.next = 3;
        break;
      case 2:
        _context.prev = 2;
        _t = _context["catch"](0);
      case 3:
      case "end":
        return _context.stop();
    }
  }, _callee, null, [[0, 2]]);
})), /*#__PURE__*/_regenerator["default"].mark(function getLatestFeedPrice() {
  return _regenerator["default"].wrap(function (_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
      case "end":
        return _context2.stop();
    }
  }, getLatestFeedPrice);
})];
function shouldShowLoginWarning(_ref) {
  var username = _ref.username,
    password = _ref.password;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var account, pubKey, postingPubKeys;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (_blurtjs.auth.isWif(password)) {
            _context3.next = 2;
            break;
          }
          _context3.next = 1;
          return _blurtjs.api.getAccountsAsync([username]);
        case 1:
          account = _context3.sent[0];
          pubKey = _ecc.PrivateKey.fromSeed(username + 'posting' + password).toPublicKey().toString();
          postingPubKeys = account.posting.key_auths[0];
          return _context3.abrupt("return", postingPubKeys.includes(pubKey));
        case 2:
          return _context3.abrupt("return", false);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee2);
  })();
}

/**
    @arg {object} action.username - Unless a WIF is provided, this is hashed
        with the password and key_type to create private keys.
    @arg {object} action.password - Password or WIF private key. A WIF becomes
        the posting key, a password can create all three key_types: active,
        owner, posting keys.
*/
function checkKeyType(action) {
  return _regenerator["default"].wrap(function (_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        _context4.next = 1;
        return (0, _effects.call)(shouldShowLoginWarning, action.payload);
      case 1:
        if (!_context4.sent) {
          _context4.next = 3;
          break;
        }
        _context4.next = 2;
        return (0, _effects.put)(userActions.showLoginWarning(action.payload));
      case 2:
        _context4.next = 4;
        break;
      case 3:
        _context4.next = 4;
        return (0, _effects.put)(userActions.usernamePasswordLogin(action.payload));
      case 4:
      case "end":
        return _context4.stop();
    }
  }, _marked);
}

/**
    @arg {object} action.username - Unless a WIF is provided, this is hashed
        with the password and key_type to create private keys.
    @arg {object} action.password - Password or WIF private key. A WIF becomes
        the posting key, a password can create all three key_types: active,
        owner, posting keys.
*/
function usernamePasswordLogin(action) {
  var current, username;
  return _regenerator["default"].wrap(function (_context5) {
    while (1) switch (_context5.prev = _context5.next) {
      case 0:
        // This is a great place to mess with session-related user state (:
        // If the user hasn't previously hidden the announcement in this session,
        // or if the user's browser does not support session storage,
        // show the announcement.
        if (typeof sessionStorage === 'undefined' || typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hideAnnouncement') !== 'true') {
          // Uncomment to re-enable announcment
          // TODO: use config to enable/disable
          // yield put(userActions.showAnnouncement());
        }

        // Sets 'loading' while the login is taking place. The key generation can
        // take a while on slow computers.
        _context5.next = 1;
        return (0, _effects.call)(usernamePasswordLogin2, action.payload);
      case 1:
        _context5.next = 2;
        return (0, _effects.select)(function (state) {
          return state.user.get('current');
        });
      case 2:
        current = _context5.sent;
        if (!current) {
          _context5.next = 4;
          break;
        }
        username = current.get('username');
        _context5.next = 3;
        return (0, _effects.fork)(_FollowSaga.loadFollows, 'getFollowingAsync', username, 'blog');
      case 3:
        _context5.next = 4;
        return (0, _effects.fork)(_FollowSaga.loadFollows, 'getFollowingAsync', username, 'ignore');
      case 4:
      case "end":
        return _context5.stop();
    }
  }, _marked2);
}
var clean = function clean(value) {
  return value == null || value === '' || /null|undefined/.test(value) ? undefined : value;
};
function usernamePasswordLogin2(_ref2) {
  var username = _ref2.username,
    password = _ref2.password,
    useKeychain = _ref2.useKeychain,
    saveLogin = _ref2.saveLogin,
    operationType = _ref2.operationType,
    afterLoginRedirectToWelcome = _ref2.afterLoginRedirectToWelcome;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var user, loginType, justLoggedIn, feedURL, autopost, memoWif, login_owner_pubkey, login_wif_owner_pubkey, login_with_keychain, data, _extractLoginData, _extractLoginData2, offchain_account, userProvidedRole, _username$split, _username$split2, pathname, isRole, account, private_keys, private_key, authority, hasActiveAuth, hasOwnerAuth, accountName, fullAuths, owner_pub_key, generated_type, owner_pubkey, active_pubkey, posting_pubkey, memo_pubkey, offchainData, serverAccount, challengeString, signatures, challenge, buf, bufSha, _response, sign, response, body, _t2;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return (0, _effects.select)(function (state) {
            return state.user;
          });
        case 1:
          user = _context6.sent;
          loginType = user.get('login_type');
          justLoggedIn = loginType === 'basic';
          console.log('Login type:', loginType, 'Just logged in?', justLoggedIn, 'username:', username);

          // login, using saved password
          feedURL = false;
          if (!username && !password) {
            data = localStorage.getItem('autopost2');
            if (data) {
              // auto-login with a low security key (like a posting key)
              autopost = true; // must use semi-colon
              // The 'password' in this case must be the posting private wif .. See setItme('autopost')
              _extractLoginData = (0, _UserUtil.extractLoginData)(data);
              _extractLoginData2 = (0, _slicedToArray2["default"])(_extractLoginData, 5);
              username = _extractLoginData2[0];
              password = _extractLoginData2[1];
              memoWif = _extractLoginData2[2];
              login_owner_pubkey = _extractLoginData2[3];
              login_with_keychain = _extractLoginData2[4];
              memoWif = clean(memoWif);
              login_owner_pubkey = clean(login_owner_pubkey);
            }
          }
          // no saved password
          if (!(!username || !(password || useKeychain || login_with_keychain))) {
            _context6.next = 3;
            break;
          }
          console.log('No saved password');
          _context6.next = 2;
          return (0, _effects.select)(function (state) {
            return state.offchain.get('account');
          });
        case 2:
          offchain_account = _context6.sent;
          if (offchain_account) (0, _ServerApiClient.serverApiLogout)();
          return _context6.abrupt("return");
        case 3:
          // login via:  username/owner
          if (username.indexOf('/') > -1) {
            // "alice/active" will login only with Alices active key
            _username$split = username.split('/');
            _username$split2 = (0, _slicedToArray2["default"])(_username$split, 2);
            username = _username$split2[0];
            userProvidedRole = _username$split2[1];
          }
          _context6.next = 4;
          return (0, _effects.select)(function (state) {
            return state.global.get('pathname');
          });
        case 4:
          pathname = _context6.sent;
          isRole = function isRole(role, fn) {
            return !userProvidedRole || role === userProvidedRole ? fn() : undefined;
          };
          _context6.next = 5;
          return (0, _effects.call)(_SagaShared.getAccount, username);
        case 5:
          account = _context6.sent;
          if (account) {
            _context6.next = 7;
            break;
          }
          console.log('No account');
          _context6.next = 6;
          return (0, _effects.put)(userActions.loginError({
            error: 'Username does not exist'
          }));
        case 6:
          return _context6.abrupt("return");
        case 7:
          if (!(username && _DMCAUserList["default"].includes(username))) {
            _context6.next = 9;
            break;
          }
          console.log('DMCA list');
          _context6.next = 8;
          return (0, _effects.put)(userActions.loginError({
            error: (0, _Translator.translate)('terms_violation')
          }));
        case 8:
          return _context6.abrupt("return");
        case 9:
          if (!login_with_keychain) {
            _context6.next = 11;
            break;
          }
          console.log('Logged in using steem keychain');
          _context6.next = 10;
          return (0, _effects.put)(userActions.setUser({
            username: username,
            login_with_keychain: true,
            vesting_shares: account.get('vesting_shares'),
            received_vesting_shares: account.get('received_vesting_shares'),
            delegated_vesting_shares: account.get('delegated_vesting_shares'),
            vesting_withdraw_rate: account.get('vesting_withdraw_rate'),
            voting_manabar: account.get('voting_manabar')
          }));
        case 10:
          return _context6.abrupt("return");
        case 11:
          if (useKeychain) {
            _context6.next = 30;
            break;
          }
          try {
            private_key = _ecc.PrivateKey.fromWif(password);
            login_wif_owner_pubkey = private_key.toPublicKey().toString();
            private_keys = fromJS({
              owner_private: isRole('owner', function () {
                return private_key;
              }),
              posting_private: isRole('posting', function () {
                return private_key;
              }),
              active_private: isRole('active', function () {
                return private_key;
              }),
              memo_private: private_key
            });
          } catch (e) {
            // Password (non wif)
            login_owner_pubkey = _ecc.PrivateKey.fromSeed(username + 'owner' + password).toPublicKey().toString();
            private_keys = fromJS({
              posting_private: isRole('posting', function () {
                return _ecc.PrivateKey.fromSeed(username + 'posting' + password);
              }),
              active_private: isRole('active', function () {
                return _ecc.PrivateKey.fromSeed(username + 'active' + password);
              }),
              memo_private: _ecc.PrivateKey.fromSeed(username + 'memo' + password)
            });
          }
          if (memoWif) {
            private_keys = private_keys.set('memo_private', _ecc.PrivateKey.fromWif(memoWif));
          }
          _context6.next = 12;
          return (0, _effects.call)(_AuthSaga.accountAuthLookup, {
            payload: {
              account: account,
              private_keys: private_keys,
              login_owner_pubkey: login_owner_pubkey
            }
          });
        case 12:
          _context6.next = 13;
          return (0, _effects.select)(function (state) {
            return state.user.getIn(['authority', username]);
          });
        case 13:
          authority = _context6.sent;
          hasActiveAuth = authority.get('active') === 'full';
          if (!hasActiveAuth) {
            _context6.next = 15;
            break;
          }
          console.log('Rejecting due to detected active auth');
          _context6.next = 14;
          return (0, _effects.put)(userActions.loginError({
            error: 'active_login_blocked'
          }));
        case 14:
          return _context6.abrupt("return");
        case 15:
          hasOwnerAuth = authority.get('owner') === 'full';
          if (!hasOwnerAuth) {
            _context6.next = 17;
            break;
          }
          console.log('Rejecting due to detected owner auth');
          _context6.next = 16;
          return (0, _effects.put)(userActions.loginError({
            error: 'owner_login_blocked'
          }));
        case 16:
          return _context6.abrupt("return");
        case 17:
          accountName = account.get('name');
          authority = authority.set('active', 'none');
          _context6.next = 18;
          return (0, _effects.put)(userActions.setAuthority({
            accountName: accountName,
            auth: authority
          }));
        case 18:
          fullAuths = authority.reduce(function (r, auth, type) {
            return auth === 'full' ? r.add(type) : r;
          }, Set());
          if (fullAuths.size) {
            _context6.next = 25;
            break;
          }
          console.log('No full auths');
          _context6.next = 19;
          return (0, _effects.put)(userActions.hideLoginWarning());
        case 19:
          localStorage.removeItem('autopost2');
          owner_pub_key = account.getIn(['owner', 'key_auths', 0, 0]);
          if (!(login_owner_pubkey === owner_pub_key || login_wif_owner_pubkey === owner_pub_key)) {
            _context6.next = 21;
            break;
          }
          _context6.next = 20;
          return (0, _effects.put)(userActions.loginError({
            error: 'owner_login_blocked'
          }));
        case 20:
          return _context6.abrupt("return");
        case 21:
          if (!hasActiveAuth) {
            _context6.next = 23;
            break;
          }
          _context6.next = 22;
          return (0, _effects.put)(userActions.loginError({
            error: 'active_login_blocked'
          }));
        case 22:
          return _context6.abrupt("return");
        case 23:
          generated_type = password[0] === 'P' && password.length > 40;
          (0, _ServerApiClient.serverApiRecordEvent)('login_attempt', JSON.stringify({
            name: username,
            login_owner_pubkey: login_owner_pubkey,
            owner_pub_key: owner_pub_key,
            generated_type: generated_type
          }));
          _context6.next = 24;
          return (0, _effects.put)(userActions.loginError({
            error: 'Incorrect Password'
          }));
        case 24:
          return _context6.abrupt("return");
        case 25:
          if (authority.get('posting') !== 'full') {
            private_keys = private_keys.remove('posting_private');
          }
          if (authority.get('active') !== 'full') {
            private_keys = private_keys.remove('active_private');
          }
          owner_pubkey = account.getIn(['owner', 'key_auths', 0, 0]);
          active_pubkey = account.getIn(['active', 'key_auths', 0, 0]);
          posting_pubkey = account.getIn(['posting', 'key_auths', 0, 0]);
          memo_pubkey = private_keys.has('memo_private') ? private_keys.get('memo_private').toPublicKey().toString() : null;
          if (account.get('memo_key') !== memo_pubkey || memo_pubkey === owner_pubkey || memo_pubkey === active_pubkey) {
            // provided password did not yield memo key, or matched active/owner
            private_keys = private_keys.remove('memo_private');
          }
          if (!(posting_pubkey === owner_pubkey || posting_pubkey === active_pubkey)) {
            _context6.next = 27;
            break;
          }
          _context6.next = 26;
          return (0, _effects.put)(userActions.loginError({
            error: 'This login gives owner or active permissions and should not be used here.  Please provide a posting only login.'
          }));
        case 26:
          localStorage.removeItem('autopost2');
          return _context6.abrupt("return");
        case 27:
          if (!(!operationType || saveLogin)) {
            _context6.next = 29;
            break;
          }
          if (username) feedURL = '/@' + username + '/feed';
          // Keep the posting key in RAM but only when not signing an operation.
          // No operation or the user has checked: Keep me logged in...
          _context6.next = 28;
          return (0, _effects.put)(userActions.setUser({
            username: username,
            private_keys: private_keys,
            login_owner_pubkey: login_owner_pubkey,
            vesting_shares: account.get('vesting_shares'),
            received_vesting_shares: account.get('received_vesting_shares'),
            delegated_vesting_shares: account.get('delegated_vesting_shares'),
            vesting_withdraw_rate: account.get('vesting_withdraw_rate'),
            voting_manabar: account.get('voting_manabar')
          }));
        case 28:
          _context6.next = 30;
          break;
        case 29:
          if (username) feedURL = '/@' + username + '/feed';
          _context6.next = 30;
          return (0, _effects.put)(userActions.setUser({
            username: username,
            vesting_shares: account.get('vesting_shares'),
            received_vesting_shares: account.get('received_vesting_shares'),
            delegated_vesting_shares: account.get('delegated_vesting_shares'),
            vesting_withdraw_rate: account.get('vesting_withdraw_rate'),
            voting_manabar: account.get('voting_manabar')
          }));
        case 30:
          _context6.prev = 30;
          _context6.next = 31;
          return (0, _effects.select)(function (state) {
            return state.offchain;
          });
        case 31:
          offchainData = _context6.sent;
          serverAccount = offchainData.get('account');
          challengeString = offchainData.get('login_challenge');
          if (!(!serverAccount && challengeString)) {
            _context6.next = 41;
            break;
          }
          console.log('No server account, but challenge string');
          signatures = {};
          challenge = {
            token: challengeString
          };
          buf = JSON.stringify(challenge, null, 0);
          bufSha = _ecc.hash.sha256(buf);
          if (!useKeychain) {
            _context6.next = 37;
            break;
          }
          _context6.next = 32;
          return new Promise(function (resolve) {
            window.blurt_keychain.requestSignBuffer(username, buf, 'Posting', function (response) {
              resolve(response);
            });
          });
        case 32:
          _response = _context6.sent;
          if (!_response.success) {
            _context6.next = 33;
            break;
          }
          signatures.posting = _response.result;
          _context6.next = 35;
          break;
        case 33:
          _context6.next = 34;
          return (0, _effects.put)(userActions.loginError({
            error: _response.message
          }));
        case 34:
          return _context6.abrupt("return");
        case 35:
          feedURL = '/@' + username + '/feed';
          _context6.next = 36;
          return (0, _effects.put)(userActions.setUser({
            username: username,
            login_with_keychain: true,
            vesting_shares: account.get('vesting_shares'),
            received_vesting_shares: account.get('received_vesting_shares'),
            delegated_vesting_shares: account.get('delegated_vesting_shares'),
            vesting_withdraw_rate: account.get('vesting_withdraw_rate'),
            voting_manabar: account.get('voting_manabar')
          }));
        case 36:
          _context6.next = 38;
          break;
        case 37:
          sign = function sign(role, d) {
            console.log('Sign before');
            if (!d) return;
            console.log('Sign after');
            var sig = _ecc.Signature.signBufferSha256(bufSha, d);
            signatures[role] = sig.toHex();
          };
          sign('posting', private_keys.get('posting_private'));
          // sign('active', private_keys.get('active_private'))
        case 38:
          console.log('Logging in as', username);
          _context6.next = 39;
          return (0, _ServerApiClient.serverApiLogin)(username, signatures);
        case 39:
          response = _context6.sent;
          _context6.next = 40;
          return response.json();
        case 40:
          body = _context6.sent;
        case 41:
          _context6.next = 43;
          break;
        case 42:
          _context6.prev = 42;
          _t2 = _context6["catch"](30);
          // Does not need to be fatal
          console.error('Server Login Error', _t2);
        case 43:
          if (!(!autopost && saveLogin)) {
            _context6.next = 44;
            break;
          }
          _context6.next = 44;
          return (0, _effects.put)(userActions.saveLogin());
        case 44:
          // Feature Flags
          if (useKeychain || private_keys.get('posting_private')) {
            // yield fork(
            //     getFeatureFlags,
            //     username,
            //     useKeychain ? null : private_keys.get('posting_private').toString()
            // );
          }
          // TOS acceptance

          // Redirect user to the appropriate page after login.
          if (afterLoginRedirectToWelcome) {
            console.log('Redirecting to welcome page');
            _reactRouter.browserHistory.push('/welcome');
          } else if (feedURL && document.location.pathname === '/') {
            console.log('Redirecting to feed page', feedURL);
            _reactRouter.browserHistory.push(feedURL);
          }
        case 45:
        case "end":
          return _context6.stop();
      }
    }, _callee3, null, [[30, 42]]);
  })();
}
function saveLogin_localStorage() {
  var _yield$select, _yield$select2, username, private_keys, login_owner_pubkey, login_with_keychain, posting_private, account, postingPubkey, memoKey, memoWif, postingPrivateWif, data, _t3;
  return _regenerator["default"].wrap(function (_context7) {
    while (1) switch (_context7.prev = _context7.next) {
      case 0:
        if (process.env.BROWSER) {
          _context7.next = 1;
          break;
        }
        console.error('Non-browser environment, skipping localstorage');
        return _context7.abrupt("return");
      case 1:
        localStorage.removeItem('autopost2');
        _context7.next = 2;
        return (0, _effects.select)(function (state) {
          return [state.user.getIn(['current', 'username']), state.user.getIn(['current', 'private_keys']), state.user.getIn(['current', 'login_owner_pubkey']), state.user.getIn(['current', 'login_with_keychain'])];
        });
      case 2:
        _yield$select = _context7.sent;
        _yield$select2 = (0, _slicedToArray2["default"])(_yield$select, 4);
        username = _yield$select2[0];
        private_keys = _yield$select2[1];
        login_owner_pubkey = _yield$select2[2];
        login_with_keychain = _yield$select2[3];
        if (username) {
          _context7.next = 3;
          break;
        }
        console.error('Not logged in');
        return _context7.abrupt("return");
      case 3:
        // Save the lowest security key
        posting_private = private_keys && private_keys.get('posting_private');
        if (!(!login_with_keychain && !posting_private)) {
          _context7.next = 4;
          break;
        }
        console.error('No posting key to save?');
        return _context7.abrupt("return");
      case 4:
        _context7.next = 5;
        return (0, _effects.select)(function (state) {
          return state.global.getIn(['accounts', username]);
        });
      case 5:
        account = _context7.sent;
        if (account) {
          _context7.next = 6;
          break;
        }
        console.error('Missing global.accounts[' + username + ']');
        return _context7.abrupt("return");
      case 6:
        postingPubkey = posting_private ? posting_private.toPublicKey().toString() : 'none';
        _context7.prev = 7;
        account.getIn(['active', 'key_auths']).forEach(function (auth) {
          if (auth.get(0) === postingPubkey) {
            throw 'Login will not be saved, posting key is the same as active key';
          }
        });
        account.getIn(['owner', 'key_auths']).forEach(function (auth) {
          if (auth.get(0) === postingPubkey) {
            throw 'Login will not be saved, posting key is the same as owner key';
          }
        });
        _context7.next = 9;
        break;
      case 8:
        _context7.prev = 8;
        _t3 = _context7["catch"](7);
        console.error(_t3);
        return _context7.abrupt("return");
      case 9:
        memoKey = private_keys ? private_keys.get('memo_private') : null;
        memoWif = memoKey && memoKey.toWif();
        postingPrivateWif = posting_private ? posting_private.toWif() : 'none';
        data = (0, _UserUtil.packLoginData)(username, postingPrivateWif, memoWif, login_owner_pubkey, login_with_keychain); // autopost is a auto login for a low security key (like the posting key)
        localStorage.setItem('autopost2', data);
      case 10:
      case "end":
        return _context7.stop();
    }
  }, _marked3, null, [[7, 8]]);
}
function logout(action) {
  var payload,
    logoutType,
    _args8 = arguments;
  return _regenerator["default"].wrap(function (_context8) {
    while (1) switch (_context8.prev = _context8.next) {
      case 0:
        payload = (action || {}).payload || {};
        logoutType = payload.type || 'default';
        console.log('Logging out', _args8, 'logout type', logoutType);

        // Just in case it is still showing
        _context8.next = 1;
        return (0, _effects.put)(userActions.saveLoginConfirm(false));
      case 1:
        if (process.env.BROWSER) {
          localStorage.removeItem('autopost2');
        }
        _context8.next = 2;
        return (0, _ServerApiClient.serverApiLogout)();
      case 2:
      case "end":
        return _context8.stop();
    }
  }, _marked4);
}
function loginError(_ref3) {
  (0, _objectDestructuringEmpty2["default"])(_ref3.payload);
  return /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function (_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          (0, _ServerApiClient.serverApiLogout)();
        case 1:
        case "end":
          return _context9.stop();
      }
    }, _callee4);
  })();
}

/**
    If the owner key was changed after the login owner key, this function will
    find the next owner key history record after the change and store it under
    user.previous_owner_authority.
*/
function lookupPreviousOwnerAuthority(_ref4) {
  (0, _objectDestructuringEmpty2["default"])(_ref4.payload);
  return /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var current, login_owner_pubkey, username, key_auths, owner_history, previous_owner_authority, _t4;
    return _regenerator["default"].wrap(function (_context0) {
      while (1) switch (_context0.prev = _context0.next) {
        case 0:
          _context0.next = 1;
          return (0, _effects.select)(function (state) {
            return state.user.getIn(['current']);
          });
        case 1:
          current = _context0.sent;
          if (current) {
            _context0.next = 2;
            break;
          }
          return _context0.abrupt("return");
        case 2:
          login_owner_pubkey = current.get('login_owner_pubkey');
          if (login_owner_pubkey) {
            _context0.next = 3;
            break;
          }
          return _context0.abrupt("return");
        case 3:
          username = current.get('username');
          _context0.next = 4;
          return (0, _effects.select)(function (state) {
            return state.global.getIn(['accounts', username, 'owner', 'key_auths']);
          });
        case 4:
          key_auths = _context0.sent;
          if (!(key_auths && key_auths.find(function (key) {
            return key.get(0) === login_owner_pubkey;
          }))) {
            _context0.next = 5;
            break;
          }
          return _context0.abrupt("return");
        case 5:
          _t4 = fromJS;
          _context0.next = 6;
          return (0, _effects.call)([_blurtjs.api, _blurtjs.api.getOwnerHistoryAsync], username);
        case 6:
          owner_history = _t4(_context0.sent);
          if (!(owner_history.count() === 0)) {
            _context0.next = 7;
            break;
          }
          return _context0.abrupt("return");
        case 7:
          owner_history = owner_history.sort(function (b, a) {
            // Sort decending
            var aa = a.get('last_valid_time');
            var bb = b.get('last_valid_time');
            return aa < bb ? -1 : aa > bb ? 1 : 0;
          });
          previous_owner_authority = owner_history.find(function (o) {
            var auth = o.get('previous_owner_authority');
            var weight_threshold = auth.get('weight_threshold');
            var key3 = auth.get('key_auths').find(function (key2) {
              return key2.get(0) === login_owner_pubkey && key2.get(1) >= weight_threshold;
            });
            return key3 ? auth : null;
          });
          if (previous_owner_authority) {
            _context0.next = 8;
            break;
          }
          console.log('UserSaga ---> Login owner does not match owner history');
          return _context0.abrupt("return");
        case 8:
          _context0.next = 9;
          return (0, _effects.put)(userActions.setUser({
            previous_owner_authority: previous_owner_authority
          }));
        case 9:
        case "end":
          return _context0.stop();
      }
    }, _callee5);
  })();
}
function uploadImage(_ref5) {
  var _ref5$payload = _ref5.payload,
    file = _ref5$payload.file,
    dataUrl = _ref5$payload.dataUrl,
    _ref5$payload$filenam = _ref5$payload.filename,
    filename = _ref5$payload$filenam === void 0 ? 'image.txt' : _ref5$payload$filenam,
    progress = _ref5$payload.progress;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var _progress, stateUser, username, keychainLogin, d, data, dataBs64, reader, commaIdx, prefix, buf, bufSha, formData, sig, response, postUrl, xhr;
    return _regenerator["default"].wrap(function (_context1) {
      while (1) switch (_context1.prev = _context1.next) {
        case 0:
          _progress = progress;
          progress = function progress(msg) {
            _progress(msg);
          };
          _context1.next = 1;
          return (0, _effects.select)(function (state) {
            return state.user;
          });
        case 1:
          stateUser = _context1.sent;
          username = stateUser.getIn(['current', 'username']);
          keychainLogin = (0, _SteemKeychain.isLoggedInWithKeychain)();
          d = stateUser.getIn(['current', 'private_keys', 'posting_private']);
          if (username) {
            _context1.next = 2;
            break;
          }
          progress({
            error: 'Please login first.'
          });
          return _context1.abrupt("return");
        case 2:
          if (keychainLogin || d) {
            _context1.next = 3;
            break;
          }
          progress({
            error: 'Login with your posting key'
          });
          return _context1.abrupt("return");
        case 3:
          if (!(!file && !dataUrl)) {
            _context1.next = 4;
            break;
          }
          console.error('uploadImage required: file or dataUrl');
          return _context1.abrupt("return");
        case 4:
          if (!file) {
            _context1.next = 6;
            break;
          }
          // drag and drop
          reader = new FileReader();
          _context1.next = 5;
          return new Promise(function (resolve) {
            reader.addEventListener('load', function () {
              var result = new Buffer(reader.result, 'binary');
              resolve(result);
            });
            reader.readAsBinaryString(file);
          });
        case 5:
          data = _context1.sent;
          _context1.next = 7;
          break;
        case 6:
          // recover from preview
          commaIdx = dataUrl.indexOf(',');
          dataBs64 = dataUrl.substring(commaIdx + 1);
          data = new Buffer(dataBs64, 'base64');
        case 7:
          // The challenge needs to be prefixed with a constant (both on the server and checked on the client) to make sure the server can't easily make the client sign a transaction doing something else.
          prefix = new Buffer('ImageSigningChallenge');
          buf = Buffer.concat([prefix, data]);
          bufSha = _ecc.hash.sha256(buf);
          formData = new FormData();
          if (file) {
            formData.append('file', file);
          } else {
            // formData.append('file', file, filename) <- Failed to add filename=xxx to Content-Disposition
            // Can't easily make this look like a file so this relies on the server supporting: filename and filebinary
            formData.append('filename', filename);
            formData.append('filebase64', dataBs64);
          }
          if (!keychainLogin) {
            _context1.next = 11;
            break;
          }
          _context1.next = 8;
          return new Promise(function (resolve) {
            window.blurt_keychain.requestSignBuffer(username, JSON.stringify(buf), 'Posting', function (response) {
              resolve(response);
            });
          });
        case 8:
          response = _context1.sent;
          if (!response.success) {
            _context1.next = 9;
            break;
          }
          sig = response.result;
          _context1.next = 10;
          break;
        case 9:
          progress({
            error: response.message
          });
          return _context1.abrupt("return");
        case 10:
          _context1.next = 12;
          break;
        case 11:
          sig = _ecc.Signature.signBufferSha256(bufSha, d).toHex();
        case 12:
          postUrl = "".concat($STM_Config.upload_image, "/").concat(username, "/").concat(sig);
          xhr = new XMLHttpRequest();
          xhr.open('POST', postUrl);
          xhr.onload = function () {
            console.log(xhr.status, xhr.responseText);
            var res = JSON.parse(xhr.responseText);
            var error = res.error;
            if (error) {
              progress({
                error: 'Error: ' + error
              });
              return;
            }
            var url = res.url;
            progress({
              url: url
            });
          };
          xhr.onerror = function (error) {
            console.error(filename, error);
            progress({
              error: 'Unable to contact the server.'
            });
          };
          xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              var percent = Math.round(event.loaded / event.total * 100);
              progress({
                message: "Uploading ".concat(percent, "%")
              });
            }
          };
          xhr.send(formData);
        case 13:
        case "end":
          return _context1.stop();
      }
    }, _callee6);
  })();
}
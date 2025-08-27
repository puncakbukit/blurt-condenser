"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useGeneralApi;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var _koaBody = _interopRequireDefault(require("koa-body"));
var _config = _interopRequireDefault(require("config"));
var _misc = require("server/utils/misc");
var _coBody = _interopRequireDefault(require("co-body"));
var _ecc = require("@blurtfoundation/blurtjs/lib/auth/ecc");
var _blurtjs = require("@blurtfoundation/blurtjs");
/* global $STM_Config */

var ACCEPTED_TOS_TAG = 'accepted_tos_20180614';
var _stringval = function _stringval(v) {
  return typeof v === 'string' ? v : JSON.stringify(v);
};
var _parse = function _parse(params) {
  if (typeof params === 'string') {
    try {
      return JSON.parse(params);
    } catch (error) {
      console.error('json_parse', error, params);
      return {};
    }
  } else {
    return params;
  }
};
function logRequest(path, ctx, extra) {
  var d = {
    ip: (0, _misc.getRemoteIp)(ctx.req)
  };
  if (ctx.session) {
    if (ctx.session.user) {
      d.user = ctx.session.user;
    }
    if (ctx.session.uid) {
      d.uid = ctx.session.uid;
    }
    if (ctx.session.a) {
      d.account = ctx.session.a;
    }
  }
  if (extra) {
    Object.keys(extra).forEach(function (k) {
      var nk = d[k] ? '_' + k : k;
      d[nk] = extra[k];
    });
  }
  var info = Object.keys(d).map(function (k) {
    return "".concat(k, "=").concat(_stringval(d[k]));
  }).join(' ');
  console.log("-- /".concat(path, " --> ").concat(info));
}
function useGeneralApi(app) {
  var router = (0, _koaRouter["default"])({
    prefix: '/api/v1'
  });
  app.use(router.routes());
  var koaBody = (0, _koaBody["default"])();
  router.post('/login_account', koaBody, /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _this = this;
    var params, _ref, csrf, account, signatures, _yield$api$getAccount, _yield$api$getAccount2, chainAccount, auth, bufSha, verify, _chainAccount$posting, _chainAccount$posting2, _chainAccount$posting3, posting_pubkey, weight, weight_threshold, remote_ip, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // if (rateLimitReq(this, this.req)) return;
          params = this.request.body;
          _ref = typeof params === 'string' ? JSON.parse(params) : params, csrf = _ref.csrf, account = _ref.account, signatures = _ref.signatures;
          if ((0, _misc.checkCSRF)(this, csrf)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return");
        case 1:
          logRequest('login_account', this, {
            account: account
          });
          _context.prev = 2;
          if (!signatures) {
            _context.next = 5;
            break;
          }
          if (this.session.login_challenge) {
            _context.next = 3;
            break;
          }
          console.error('/login_account missing this.session.login_challenge');
          _context.next = 5;
          break;
        case 3:
          _context.next = 4;
          return _blurtjs.api.getAccountsAsync([account]);
        case 4:
          _yield$api$getAccount = _context.sent;
          _yield$api$getAccount2 = (0, _slicedToArray2["default"])(_yield$api$getAccount, 1);
          chainAccount = _yield$api$getAccount2[0];
          if (!chainAccount) {
            console.error('/login_account missing blockchain account', account);
          } else {
            auth = {
              posting: false
            };
            bufSha = _ecc.hash.sha256(JSON.stringify({
              token: this.session.login_challenge
            }, null, 0));
            verify = function verify(type, sigHex, pubkey, weight, weight_threshold) {
              if (!sigHex) return;
              if (weight !== 1 || weight_threshold !== 1) {
                console.error("/login_account login_challenge unsupported ".concat(type, " auth configuration: ").concat(account));
              } else {
                var sig = parseSig(sigHex);
                var public_key = _ecc.PublicKey.fromString(pubkey);
                var verified = sig.verifyHash(bufSha, public_key);
                if (!verified) {
                  console.error('/login_account verification failed', _this.session.uid, account, pubkey);
                }
                auth[type] = verified;
              }
            };
            _chainAccount$posting = chainAccount.posting, _chainAccount$posting2 = (0, _slicedToArray2["default"])(_chainAccount$posting.key_auths, 1), _chainAccount$posting3 = (0, _slicedToArray2["default"])(_chainAccount$posting2[0], 2), posting_pubkey = _chainAccount$posting3[0], weight = _chainAccount$posting3[1], weight_threshold = _chainAccount$posting.weight_threshold;
            verify('posting', signatures.posting, posting_pubkey, weight, weight_threshold);
            if (auth.posting) this.session.a = account;
          }
        case 5:
          this.body = JSON.stringify({
            status: 'ok'
          });
          remote_ip = (0, _misc.getRemoteIp)(this.req);
          _context.next = 7;
          break;
        case 6:
          _context.prev = 6;
          _t = _context["catch"](2);
          console.error('Error in /login_account api call', this.session.uid, _t.message);
          this.body = JSON.stringify({
            error: _t.message
          });
          this.status = 500;
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee, this, [[2, 6]]);
  }));
  router.post('/logout_account', koaBody, /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var params, _ref2, csrf;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          // if (rateLimitReq(this, this.req)) return; - logout maybe immediately followed with login_attempt event
          params = this.request.body;
          _ref2 = typeof params === 'string' ? JSON.parse(params) : params, csrf = _ref2.csrf;
          if ((0, _misc.checkCSRF)(this, csrf)) {
            _context2.next = 1;
            break;
          }
          return _context2.abrupt("return");
        case 1:
          logRequest('logout_account', this);
          try {
            this.session.a = null;
            this.body = JSON.stringify({
              status: 'ok'
            });
          } catch (error) {
            console.error('Error in /logout_account api call', this.session.uid, error);
            this.body = JSON.stringify({
              error: error.message
            });
            this.status = 500;
          }
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  }));
  router.post('/csp_violation', /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var params, csp_report, value, _t2;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(0, _misc.rateLimitReq)(this, this.req)) {
            _context3.next = 1;
            break;
          }
          return _context3.abrupt("return");
        case 1:
          _context3.prev = 1;
          _context3.next = 2;
          return (0, _coBody["default"])(this);
        case 2:
          params = _context3.sent;
          _context3.next = 4;
          break;
        case 3:
          _context3.prev = 3;
          _t2 = _context3["catch"](1);
          console.log('-- /csp_violation error -->', _t2);
        case 4:
          if (params && params['csp-report']) {
            csp_report = params['csp-report'];
            value = "".concat(csp_report['document-uri'], " : ").concat(csp_report['blocked-uri']);
            console.log('-- /csp_violation -->', value, '--', this.req.headers['user-agent']);
          } else {
            console.log('-- /csp_violation [no csp-report] -->', params, '--', this.req.headers['user-agent']);
          }
          this.body = '';
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this, [[1, 3]]);
  }));
  router.post('/setUserPreferences', koaBody, /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var params, _ref3, csrf, payload, json, _t3;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          params = this.request.body;
          _ref3 = typeof params === 'string' ? JSON.parse(params) : params, csrf = _ref3.csrf, payload = _ref3.payload;
          if ((0, _misc.checkCSRF)(this, csrf)) {
            _context4.next = 1;
            break;
          }
          return _context4.abrupt("return");
        case 1:
          console.log('-- /setUserPreferences -->', this.session.user, this.session.uid, payload);
          if (this.session.a) {
            _context4.next = 2;
            break;
          }
          this.body = 'missing logged in account';
          this.status = 500;
          return _context4.abrupt("return");
        case 2:
          _context4.prev = 2;
          json = JSON.stringify(payload);
          if (!(json.length > 1024)) {
            _context4.next = 3;
            break;
          }
          throw new Error('the data is too long');
        case 3:
          this.session.user_prefs = json;
          this.body = JSON.stringify({
            status: 'ok'
          });
          _context4.next = 5;
          break;
        case 4:
          _context4.prev = 4;
          _t3 = _context4["catch"](2);
          console.error('Error in /setUserPreferences api call', this.session.uid, _t3);
          this.body = JSON.stringify({
            error: _t3.message
          });
          this.status = 500;
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4, this, [[2, 4]]);
  }));
  router.post('/isTosAccepted', koaBody, /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var params, _parse2, csrf, res, _t4;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          params = this.request.body;
          _parse2 = _parse(params), csrf = _parse2.csrf;
          if ((0, _misc.checkCSRF)(this, csrf)) {
            _context5.next = 1;
            break;
          }
          return _context5.abrupt("return");
        case 1:
          this.body = '{}';
          this.status = 200;
          if (this.session.a) {
            _context5.next = 2;
            break;
          }
          this.body = 'missing username';
          this.status = 500;
          return _context5.abrupt("return");
        case 2:
          _context5.prev = 2;
          _context5.next = 3;
          return _blurtjs.api.signedCallAsync('conveyor.get_tags_for_user', [this.session.a], _config["default"].get('conveyor_username'), _config["default"].get('conveyor_posting_wif'));
        case 3:
          res = _context5.sent;
          this.body = JSON.stringify(res.includes(ACCEPTED_TOS_TAG));
          _context5.next = 5;
          break;
        case 4:
          _context5.prev = 4;
          _t4 = _context5["catch"](2);
          console.error('Error in /isTosAccepted api call', this.session.a, _t4);
          this.body = JSON.stringify({
            error: _t4.message
          });
          this.status = 500;
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5, this, [[2, 4]]);
  }));
  router.post('/acceptTos', koaBody, /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var params, _ref4, csrf, _t5;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          params = this.request.body;
          _ref4 = typeof params === 'string' ? JSON.parse(params) : params, csrf = _ref4.csrf;
          if ((0, _misc.checkCSRF)(this, csrf)) {
            _context6.next = 1;
            break;
          }
          return _context6.abrupt("return");
        case 1:
          if (this.session.a) {
            _context6.next = 2;
            break;
          }
          this.body = 'missing logged in account';
          this.status = 500;
          return _context6.abrupt("return");
        case 2:
          _context6.prev = 2;
          _context6.next = 3;
          return _blurtjs.api.signedCallAsync('conveyor.assign_tag', {
            uid: this.session.a,
            tag: ACCEPTED_TOS_TAG
          }, _config["default"].get('conveyor_username'), _config["default"].get('conveyor_posting_wif'));
        case 3:
          _context6.next = 5;
          break;
        case 4:
          _context6.prev = 4;
          _t5 = _context6["catch"](2);
          console.error('Error in /acceptTos api call', this.session.uid, _t5);
          this.body = JSON.stringify({
            error: _t5.message
          });
          this.status = 500;
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6, this, [[2, 4]]);
  }));
}
var parseSig = function parseSig(hexSig) {
  try {
    return _ecc.Signature.fromHex(hexSig);
  } catch (e) {
    return null;
  }
};
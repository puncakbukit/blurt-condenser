"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _react = _interopRequireDefault(require("react"));
var _config = _interopRequireDefault(require("config"));
var _server = require("react-dom/server");
var _constants = require("../shared/constants");
var _serverHtml = _interopRequireDefault(require("./server-html"));
var _UniversalRender = require("../shared/UniversalRender");
var _secureRandom = _interopRequireDefault(require("secure-random"));
var _serverError = _interopRequireDefault(require("server/server-error"));
var _Links = require("../app/utils/Links");
var _misc = require("./utils/misc");
var path = require('path');
var ROOT = path.join(__dirname, '../..');
var DB_RECONNECT_TIMEOUT = process.env.NODE_ENV === 'development' ? 1000 * 60 * 60 : 1000 * 60 * 10;
var supportedLocales = (0, _misc.getSupportedLocales)();
function appRender(_x) {
  return _appRender.apply(this, arguments);
}
function _appRender() {
  _appRender = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(ctx) {
    var locales,
      resolvedAssets,
      store,
      userPreferences,
      locale,
      _supportedLocales,
      localeIsSupported,
      login_challenge,
      offchain,
      googleAds,
      cookieConsent,
      initial_state,
      _yield$serverRender,
      body,
      title,
      statusCode,
      meta,
      assets,
      assets_filename,
      props,
      error,
      redirect,
      pathname,
      search,
      _args = arguments,
      _t,
      _t2,
      _t3,
      _t4,
      _t5,
      _t6;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          locales = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
          resolvedAssets = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
          ctx.state.requestTimer.startTimer('appRender_ms');
          store = {}; // This is the part of SSR where we make session-specific changes:
          _context.prev = 1;
          userPreferences = {};
          if (ctx.session.user_prefs) {
            try {
              userPreferences = JSON.parse(ctx.session.user_prefs);
            } catch (err) {
              console.error('cannot parse user preferences:', ctx.session.uid, err);
            }
          }
          if (!userPreferences.locale) {
            locale = ctx.getLocaleFromHeader();
            if (locale) locale = locale.substring(0, 2);
            _supportedLocales = locales || (0, _misc.getSupportedLocales)();
            localeIsSupported = _supportedLocales.find(function (l) {
              return l === locale;
            });
            if (!localeIsSupported) locale = 'en';
            userPreferences.locale = locale;
          }
          login_challenge = ctx.session.login_challenge;
          if (!login_challenge) {
            login_challenge = _secureRandom["default"].randomBuffer(16).toString('hex');
            ctx.session.login_challenge = login_challenge;
          }
          _t = ctx.csrf;
          _t2 = ctx.session.new_visit;
          _t3 = $STM_Config;
          _context.next = 2;
          return ctx.app.specialPostsPromise;
        case 2:
          _t4 = _context.sent;
          _t5 = login_challenge;
          offchain = {
            csrf: _t,
            new_visit: _t2,
            config: _t3,
            special_posts: _t4,
            login_challenge: _t5
          };
          googleAds = {
            enabled: !!_config["default"].google_ad_enabled,
            test: !!_config["default"].google_ad_test,
            client: _config["default"].google_ad_client,
            adSlots: _config["default"].google_ad_slots,
            gptEnabled: !!_config["default"].gpt_enabled,
            gptBidding: _config["default"].gpt_bidding,
            gptBasicSlots: _config["default"].gpt_basic_slots,
            gptCategorySlots: _config["default"].gpt_category_slots,
            gptBiddingSlots: _config["default"].gpt_bidding_slots,
            gptBannedTags: _config["default"].gpt_banned_tags
          };
          cookieConsent = {
            enabled: !!_config["default"].cookie_consent_enabled,
            api_key: _config["default"].cookie_consent_api_key
          }; // ... and that's the end of user-session-related SSR
          initial_state = {
            app: {
              viewMode: (0, _Links.determineViewMode)(ctx.request.search),
              googleAds: googleAds,
              env: process.env.NODE_ENV,
              walletUrl: _config["default"].wallet_url,
              steemMarket: ctx.steemMarketData
            }
          };
          _context.next = 3;
          return (0, _UniversalRender.serverRender)(ctx.request.url, initial_state, _serverError["default"], userPreferences, offchain, ctx.state.requestTimer);
        case 3:
          _yield$serverRender = _context.sent;
          body = _yield$serverRender.body;
          title = _yield$serverRender.title;
          statusCode = _yield$serverRender.statusCode;
          meta = _yield$serverRender.meta;
          // If resolvedAssets argument parameter is falsey we infer that we are in
          // development mode and therefore resolve the assets on each render.
          if (!resolvedAssets) {
            // Assets name are found in `webpack-stats` file
            assets_filename = ROOT + '/tmp/webpack-stats-dev.json';
            assets = require(assets_filename);
            delete require.cache[require.resolve(assets_filename)];
          } else {
            assets = resolvedAssets;
          }
          props = {
            body: body,
            assets: assets,
            title: title,
            meta: meta,
            shouldSeeAds: googleAds.enabled,
            gptEnabled: googleAds.gptEnabled,
            adClient: googleAds.client,
            gptBidding: googleAds.gptBidding,
            shouldSeeCookieConsent: cookieConsent.enabled,
            cookieConsentApiKey: cookieConsent.api_key
          };
          ctx.status = statusCode;
          ctx.body = '<!DOCTYPE html>' + (0, _server.renderToString)(/*#__PURE__*/_react["default"].createElement(_serverHtml["default"], props));
          _context.next = 6;
          break;
        case 4:
          _context.prev = 4;
          _t6 = _context["catch"](1);
          // Render 500 error page from server
          error = _t6.error, redirect = _t6.redirect;
          if (!error) {
            _context.next = 5;
            break;
          }
          throw error;
        case 5:
          // Handle component `onEnter` transition
          if (redirect) {
            pathname = redirect.pathname, search = redirect.search;
            ctx.redirect(pathname + search);
          }
          throw _t6;
        case 6:
          ctx.state.requestTimer.stopTimer('appRender_ms');
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 4]]);
  }));
  return _appRender.apply(this, arguments);
}
appRender.dbStatus = {
  ok: true
};
module.exports = appRender;
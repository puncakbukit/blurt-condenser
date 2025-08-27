"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = void 0;
exports.fetchData = fetchData;
exports.fetchDataWatches = void 0;
exports.fetchState = fetchState;
exports.getAccountNotifications = getAccountNotifications;
exports.getAccountUnreadNotifications = getAccountUnreadNotifications;
exports.getContentCaller = getContentCaller;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _effects = require("redux-saga/effects");
var _blurtjs = require("@blurtfoundation/blurtjs");
var _FollowSaga = require("app/redux/FollowSaga");
var _SagaShared = require("app/redux/SagaShared");
var globalActions = _interopRequireWildcard(require("./GlobalReducer"));
var appActions = _interopRequireWildcard(require("./AppReducer"));
var _constants = _interopRequireDefault(require("./constants"));
var _immutable = require("immutable");
var _steemApi = require("app/utils/steemApi");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t6 in e) "default" !== _t6 && {}.hasOwnProperty.call(e, _t6) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t6)) && (i.get || i.set) ? o(f, _t6, i) : f[_t6] = e[_t6]); return f; })(e, t); }
var _marked = /*#__PURE__*/_regenerator["default"].mark(getContentCaller),
  _marked2 = /*#__PURE__*/_regenerator["default"].mark(fetchState),
  _marked3 = /*#__PURE__*/_regenerator["default"].mark(syncSpecialPosts),
  _marked4 = /*#__PURE__*/_regenerator["default"].mark(getAccounts),
  _marked5 = /*#__PURE__*/_regenerator["default"].mark(getAccountNotifications),
  _marked6 = /*#__PURE__*/_regenerator["default"].mark(getAccountUnreadNotifications),
  _marked7 = /*#__PURE__*/_regenerator["default"].mark(fetchData);
var REQUEST_DATA = 'fetchDataSaga/REQUEST_DATA';
var GET_CONTENT = 'fetchDataSaga/GET_CONTENT';
var FETCH_STATE = 'fetchDataSaga/FETCH_STATE';
var GET_ACCOUNT_NOTIFICATIONS = 'fetchDataSaga/GET_ACCOUNT_NOTIFICATIONS';
var GET_ACCOUNT_UNREAD_NOTIFICATIONS = 'fetchDataSaga/GET_ACCOUNT_UNREAD_NOTIFICATIONS';
var fetchDataWatches = exports.fetchDataWatches = [(0, _effects.takeLatest)(REQUEST_DATA, fetchData), (0, _effects.takeEvery)(GET_CONTENT, getContentCaller), (0, _effects.takeLatest)('@@router/LOCATION_CHANGE', fetchState), (0, _effects.takeLatest)(FETCH_STATE, fetchState), (0, _effects.takeEvery)('global/FETCH_JSON', fetchJson), (0, _effects.takeEvery)(GET_ACCOUNT_NOTIFICATIONS, getAccountNotifications), (0, _effects.takeEvery)(GET_ACCOUNT_UNREAD_NOTIFICATIONS, getAccountUnreadNotifications)];
function getContentCaller(action) {
  return _regenerator["default"].wrap(function (_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 1;
        return (0, _SagaShared.getContent)(action.payload);
      case 1:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
var is_initial_state = true;
function fetchState(location_change_action) {
  var pathname, m, username, server_location, ignore_fetch, url, state, _t;
  return _regenerator["default"].wrap(function (_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        pathname = location_change_action.payload.pathname;
        m = pathname.match(/^\/@([a-z0-9\.-]+)/);
        if (!(m && m.length === 2)) {
          _context2.next = 3;
          break;
        }
        username = m[1];
        _context2.next = 1;
        return (0, _effects.fork)(_FollowSaga.fetchFollowCount, username);
      case 1:
        _context2.next = 2;
        return (0, _effects.fork)(_FollowSaga.loadFollows, 'getFollowersAsync', username, 'blog');
      case 2:
        _context2.next = 3;
        return (0, _effects.fork)(_FollowSaga.loadFollows, 'getFollowingAsync', username, 'blog');
      case 3:
        _context2.next = 4;
        return (0, _effects.select)(function (state) {
          return state.offchain.get('server_location');
        });
      case 4:
        server_location = _context2.sent;
        ignore_fetch = pathname === server_location && is_initial_state;
        if (!ignore_fetch) {
          _context2.next = 5;
          break;
        }
        return _context2.abrupt("return");
      case 5:
        is_initial_state = false;
        if (process.env.BROWSER && window && window.optimize) {
          console.log('REFRESH ADS');
          window.optimize.refreshAll({
            refresh: false
          });
        }
        url = pathname;
        _context2.next = 6;
        return (0, _effects.put)(appActions.fetchDataBegin());
      case 6:
        _context2.prev = 6;
        _context2.next = 7;
        return (0, _effects.call)(_steemApi.getStateAsync, url);
      case 7:
        state = _context2.sent;
        _context2.next = 8;
        return (0, _effects.put)(globalActions.receiveState(state));
      case 8:
        _context2.next = 9;
        return (0, _effects.call)(syncSpecialPosts);
      case 9:
        _context2.next = 11;
        break;
      case 10:
        _context2.prev = 10;
        _t = _context2["catch"](6);
        console.error('~~ Saga fetchState error ~~>', url, _t);
        _context2.next = 11;
        return (0, _effects.put)(appActions.steemApiError(_t.message));
      case 11:
        _context2.next = 12;
        return (0, _effects.put)(appActions.fetchDataEnd());
      case 12:
      case "end":
        return _context2.stop();
    }
  }, _marked2, null, [[6, 10]]);
}
function syncSpecialPosts() {
  var specialPosts, seenFeaturedPosts, seenPromotedPosts;
  return _regenerator["default"].wrap(function (_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        if (process.env.BROWSER) {
          _context3.next = 1;
          break;
        }
        return _context3.abrupt("return", null);
      case 1:
        _context3.next = 2;
        return (0, _effects.select)(function (state) {
          return state.offchain.get('special_posts');
        });
      case 2:
        specialPosts = _context3.sent;
        // Mark seen featured posts.
        seenFeaturedPosts = specialPosts.get('featured_posts').map(function (post) {
          var id = "".concat(post.get('author'), "/").concat(post.get('permlink'));
          return post.set('seen', localStorage.getItem("featured-post-seen:".concat(id)) === 'true');
        }); // Mark seen promoted posts.
        seenPromotedPosts = specialPosts.get('promoted_posts').map(function (post) {
          var id = "".concat(post.get('author'), "/").concat(post.get('permlink'));
          return post.set('seen', localStorage.getItem("promoted-post-seen:".concat(id)) === 'true');
        }); // Look up seen post URLs.
        _context3.next = 3;
        return (0, _effects.put)(globalActions.syncSpecialPosts({
          featuredPosts: seenFeaturedPosts,
          promotedPosts: seenPromotedPosts
        }));
      case 3:
        // Mark all featured posts as seen.
        specialPosts.get('featured_posts').forEach(function (post) {
          var id = "".concat(post.get('author'), "/").concat(post.get('permlink'));
          localStorage.setItem("featured-post-seen:".concat(id), 'true');
        });

        // Mark all promoted posts as seen.
        specialPosts.get('promoted_posts').forEach(function (post) {
          var id = "".concat(post.get('author'), "/").concat(post.get('permlink'));
          localStorage.setItem("promoted-post-seen:".concat(id), 'true');
        });
      case 4:
      case "end":
        return _context3.stop();
    }
  }, _marked3);
}

/**
 * Request account data for a set of usernames.
 *
 * @todo batch the put()s
 *
 * @param {Iterable} usernames
 */
function getAccounts(usernames) {
  var accounts;
  return _regenerator["default"].wrap(function (_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        _context4.next = 1;
        return (0, _effects.call)([_blurtjs.api, _blurtjs.api.getAccountsAsync], usernames);
      case 1:
        accounts = _context4.sent;
        _context4.next = 2;
        return (0, _effects.put)(globalActions.receiveAccounts({
          accounts: accounts
        }));
      case 2:
      case "end":
        return _context4.stop();
    }
  }, _marked4);
}

/**
 * Request notifications for given account
 * @param {object} payload containing:
 *   - account (string)
 *   - last_id (string), optional, for pagination
 *   - limit (int), optional, defualt is 100
 */
function getAccountNotifications(action) {
  var notifications, _t2;
  return _regenerator["default"].wrap(function (_context5) {
    while (1) switch (_context5.prev = _context5.next) {
      case 0:
        if (action.payload) {
          _context5.next = 1;
          break;
        }
        throw 'no account specified';
      case 1:
        _context5.prev = 1;
        _context5.next = 2;
        return (0, _effects.call)(_steemApi.callNotificationsApi, action.payload.account);
      case 2:
        notifications = _context5.sent;
        if (!(notifications && notifications.error)) {
          _context5.next = 4;
          break;
        }
        console.error('~~ Saga getAccountNotifications error ~~>', notifications.error);
        _context5.next = 3;
        return (0, _effects.put)(appActions.steemApiError(notifications.error.message));
      case 3:
        _context5.next = 5;
        break;
      case 4:
        _context5.next = 5;
        return (0, _effects.put)(globalActions.receiveNotifications({
          name: action.payload.account,
          notifications: notifications
        }));
      case 5:
        _context5.next = 7;
        break;
      case 6:
        _context5.prev = 6;
        _t2 = _context5["catch"](1);
        console.error('~~ Saga getAccountNotifications error ~~>', _t2);
        _context5.next = 7;
        return (0, _effects.put)(appActions.steemApiError(_t2.message));
      case 7:
      case "end":
        return _context5.stop();
    }
  }, _marked5, null, [[1, 6]]);
}
function getAccountUnreadNotifications(action) {
  var notifications, _t3;
  return _regenerator["default"].wrap(function (_context6) {
    while (1) switch (_context6.prev = _context6.next) {
      case 0:
        if (action.payload) {
          _context6.next = 1;
          break;
        }
        throw 'no account specified';
      case 1:
        _context6.prev = 1;
        _context6.next = 2;
        return (0, _effects.call)(_steemApi.callNotificationsApi, action.payload.account);
      case 2:
        notifications = _context6.sent;
        if (!(notifications && notifications.error)) {
          _context6.next = 4;
          break;
        }
        console.error('~~ Saga getAccountUnreadNotifications error ~~>', notifications.error);
        _context6.next = 3;
        return (0, _effects.put)(appActions.steemApiError(notifications.error.message));
      case 3:
        _context6.next = 5;
        break;
      case 4:
        _context6.next = 5;
        return (0, _effects.put)(globalActions.receiveUnreadNotifications({
          name: action.payload.account,
          notifications: notifications
        }));
      case 5:
        _context6.next = 7;
        break;
      case 6:
        _context6.prev = 6;
        _t3 = _context6["catch"](1);
        console.error('~~ Saga getAccountUnreadNotifications error ~~>', _t3);
        _context6.next = 7;
        return (0, _effects.put)(appActions.steemApiError(_t3.message));
      case 7:
      case "end":
        return _context6.stop();
    }
  }, _marked6, null, [[1, 6]]);
}
function fetchData(action) {
  var _action$payload, order, author, permlink, accountname, postFilter, category, call_name, args, firstPermlink, fetched, endOfData, fetchLimitReached, fetchDone, batch, data, lastValue, _t4;
  return _regenerator["default"].wrap(function (_context7) {
    while (1) switch (_context7.prev = _context7.next) {
      case 0:
        _action$payload = action.payload, order = _action$payload.order, author = _action$payload.author, permlink = _action$payload.permlink, accountname = _action$payload.accountname, postFilter = _action$payload.postFilter;
        category = action.payload.category;
        if (!category) category = '';
        category = category.toLowerCase();
        _context7.next = 1;
        return (0, _effects.put)(globalActions.fetchingData({
          order: order,
          category: category
        }));
      case 1:
        if (order === 'trending') {
          call_name = 'getDiscussionsByTrendingAsync';
          args = [{
            tag: category,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'hot') {
          call_name = 'getDiscussionsByHotAsync';
          args = [{
            tag: category,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'promoted') {
          call_name = 'getDiscussionsByPromotedAsync';
          args = [{
            tag: category,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'payout') {
          call_name = 'getPostDiscussionsByPayoutAsync';
          args = [{
            tag: category,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'payout_comments') {
          call_name = 'getCommentDiscussionsByPayoutAsync';
          args = [{
            tag: category,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'created') {
          call_name = 'getDiscussionsByCreatedAsync';
          args = [{
            tag: category,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'by_replies') {
          call_name = 'getRepliesByLastUpdateAsync';
          args = [author, permlink, _constants["default"].FETCH_DATA_BATCH_SIZE];
        } else if (order === 'by_feed') {
          // https://github.com/steemit/steem/issues/249
          call_name = 'getDiscussionsByFeedAsync';
          args = [{
            tag: accountname,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'by_author') {
          call_name = 'getDiscussionsByBlogAsync';
          args = [{
            tag: accountname,
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else if (order === 'by_comments') {
          call_name = 'getDiscussionsByCommentsAsync';
          args = [{
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
            start_author: author,
            start_permlink: permlink
          }];
        } else {
          // this should never happen. undefined behavior
          call_name = 'getDiscussionsByTrendingAsync';
          args = [{
            limit: _constants["default"].FETCH_DATA_BATCH_SIZE
          }];
        }
        _context7.next = 2;
        return (0, _effects.put)(appActions.fetchDataBegin());
      case 2:
        _context7.prev = 2;
        firstPermlink = permlink;
        fetched = 0;
        endOfData = false;
        fetchLimitReached = false;
        fetchDone = false;
        batch = 0;
      case 3:
        if (fetchDone) {
          _context7.next = 6;
          break;
        }
        _context7.next = 4;
        return _effects.call.apply(void 0, [[_blurtjs.api, _blurtjs.api[call_name]]].concat((0, _toConsumableArray2["default"])(args)));
      case 4:
        data = _context7.sent;
        endOfData = data.length < _constants["default"].FETCH_DATA_BATCH_SIZE;
        batch++;
        fetchLimitReached = batch >= _constants["default"].MAX_BATCHES;

        // next arg. Note 'by_replies' does not use same structure.
        lastValue = data.length > 0 ? data[data.length - 1] : null;
        if (lastValue && order !== 'by_replies') {
          args[0].start_author = lastValue.author;
          args[0].start_permlink = lastValue.permlink;
        }

        // Still return all data but only count ones matching the filter.
        // Rely on UI to actually hide the posts.
        fetched += postFilter ? data.filter(postFilter).length : data.length;
        fetchDone = endOfData || fetchLimitReached || fetched >= _constants["default"].FETCH_DATA_BATCH_SIZE;
        _context7.next = 5;
        return (0, _effects.put)(globalActions.receiveData({
          data: data,
          order: order,
          category: category,
          author: author,
          firstPermlink: firstPermlink,
          accountname: accountname,
          fetching: !fetchDone,
          endOfData: endOfData
        }));
      case 5:
        _context7.next = 3;
        break;
      case 6:
        _context7.next = 8;
        break;
      case 7:
        _context7.prev = 7;
        _t4 = _context7["catch"](2);
        console.error('~~ Saga fetchData error ~~>', call_name, args, _t4);
        _context7.next = 8;
        return (0, _effects.put)(appActions.steemApiError(_t4.message));
      case 8:
        _context7.next = 9;
        return (0, _effects.put)(appActions.fetchDataEnd());
      case 9:
      case "end":
        return _context7.stop();
    }
  }, _marked7, null, [[2, 7]]);
}

/**
    @arg {string} id unique key for result global['fetchJson_' + id]
    @arg {string} url
    @arg {object} body (for JSON.stringify)
*/
function fetchJson(_ref) {
  var _ref$payload = _ref.payload,
    id = _ref$payload.id,
    url = _ref$payload.url,
    body = _ref$payload.body,
    successCallback = _ref$payload.successCallback,
    _ref$payload$skipLoad = _ref$payload.skipLoading,
    skipLoading = _ref$payload$skipLoad === void 0 ? false : _ref$payload$skipLoad;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var payload, result, _t5;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          payload = {
            method: body ? 'POST' : 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
          };
          _context8.next = 1;
          return skipLoading ? fetch(url, payload) : (0, _effects.call)(fetch, url, payload);
        case 1:
          result = _context8.sent;
          _context8.next = 2;
          return result.json();
        case 2:
          result = _context8.sent;
          if (successCallback) result = successCallback(result);
          _context8.next = 3;
          return (0, _effects.put)(globalActions.fetchJsonResult({
            id: id,
            result: result
          }));
        case 3:
          _context8.next = 5;
          break;
        case 4:
          _context8.prev = 4;
          _t5 = _context8["catch"](0);
          console.error('fetchJson', _t5);
          _context8.next = 5;
          return (0, _effects.put)(globalActions.fetchJsonResult({
            id: id,
            error: _t5
          }));
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee, null, [[0, 4]]);
  })();
}

// Action creators
var actions = exports.actions = {
  requestData: function requestData(payload) {
    return {
      type: REQUEST_DATA,
      payload: payload
    };
  },
  getContent: function getContent(payload) {
    return {
      type: GET_CONTENT,
      payload: payload
    };
  },
  fetchState: function fetchState(payload) {
    return {
      type: FETCH_STATE,
      payload: payload
    };
  },
  getAccountNotifications: function getAccountNotifications(payload) {
    return {
      type: GET_ACCOUNT_NOTIFICATIONS,
      payload: payload
    };
  },
  getAccountUnreadNotifications: function getAccountUnreadNotifications(payload) {
    return {
      type: GET_ACCOUNT_UNREAD_NOTIFICATIONS,
      payload: payload
    };
  }
};
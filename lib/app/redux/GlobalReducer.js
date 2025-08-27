"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_STATE = void 0;
exports["default"] = reducer;
exports.voted = exports.update = exports.syncSpecialPosts = exports.showDialog = exports.setCollapsed = exports.set = exports.remove = exports.receiveUnreadNotifications = exports.receiveState = exports.receiveNotifications = exports.receiveData = exports.receiveContent = exports.receiveAccounts = exports.receiveAccount = exports.linkReply = exports.hideDialog = exports.getState = exports.fetchingData = exports.fetchJsonResult = exports.fetchJson = exports.emptyContentMap = exports.deleteContent = exports.defaultState = void 0;
var _immutable = require("immutable");
var _ResolveRoute = _interopRequireDefault(require("app/ResolveRoute"));
var _EmptyState = require("app/redux/EmptyState");
var _StateFunctions = require("app/utils/StateFunctions");
var _constants = _interopRequireDefault(require("./constants"));
var emptyContentMap = exports.emptyContentMap = (0, _immutable.Map)(_EmptyState.emptyContent);
var defaultState = exports.defaultState = (0, _immutable.Map)({
  status: {}
});

// Action constants
var SET_COLLAPSED = 'global/SET_COLLAPSED';
var RECEIVE_STATE = 'global/RECEIVE_STATE';
var RECEIVE_ACCOUNT = 'global/RECEIVE_ACCOUNT';
var RECEIVE_ACCOUNTS = 'global/RECEIVE_ACCOUNTS';
var SYNC_SPECIAL_POSTS = 'global/SYNC_SPECIAL_POSTS';
var RECEIVE_CONTENT = 'global/RECEIVE_CONTENT';
var LINK_REPLY = 'global/LINK_REPLY';
var DELETE_CONTENT = 'global/DELETE_CONTENT';
var VOTED = 'global/VOTED';
var FETCHING_DATA = 'global/FETCHING_DATA';
var RECEIVE_DATA = 'global/RECEIVE_DATA';
var SET = 'global/SET';
var REMOVE = 'global/REMOVE';
var UPDATE = 'global/UPDATE';
var FETCH_JSON = 'global/FETCH_JSON';
var FETCH_JSON_RESULT = 'global/FETCH_JSON_RESULT';
var SHOW_DIALOG = 'global/SHOW_DIALOG';
var HIDE_DIALOG = 'global/HIDE_DIALOG';
// Saga-related:
var GET_STATE = exports.GET_STATE = 'global/GET_STATE';
var RECEIVE_NOTIFICATIONS = 'global/RECEIVE_NOTIFICATIONS';
var RECEIVE_UNREAD_NOTIFICATIONS = 'global/RECEIVE_UNREAD_NOTIFICATIONS';

/**
 * Transfrom nested JS object to appropriate immutable collection.
 *
 * @param {Object} account
 */

var transformAccount = function transformAccount(account) {
  return (0, _immutable.fromJS)(account, function (key, value) {
    if (key === 'witness_votes') return value.toSet();
    var isIndexed = _immutable.Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
  });
};

/**
 * Merging accounts: A get_state will provide a very full account but a get_accounts will provide a smaller version this makes sure we don't overwrite
 *
 * @param {Immutable.Map} state
 * @param {Immutable.Map} account
 *
 */

var mergeAccounts = function mergeAccounts(state, account) {
  return state.updateIn(['accounts', account.get('name')], (0, _immutable.Map)(), function (a) {
    return a.mergeDeep(account);
  });
};
function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var payload = action.payload;

  // Set post category
  var pathname = state.get('pathname');
  if (pathname) {
    var route = (0, _ResolveRoute["default"])(pathname);
    if (route.page === 'PostsIndex') {
      var postCategory = route.params[1];
      state = state.set('postCategory', postCategory);
    }
  }
  switch (action.type) {
    case SET_COLLAPSED:
      {
        return state.withMutations(function (map) {
          map.updateIn(['content', payload.post], function (value) {
            return value.merge((0, _immutable.Map)({
              collapsed: payload.collapsed
            }));
          });
        });
      }
    case RECEIVE_STATE:
      {
        var new_state = (0, _immutable.fromJS)(payload);
        if (new_state.has('content')) {
          var content = new_state.get('content').withMutations(function (c) {
            c.forEach(function (cc, key) {
              cc = emptyContentMap.mergeDeep(cc);
              var stats = (0, _immutable.fromJS)((0, _StateFunctions.contentStats)(cc));
              c.setIn([key, 'stats'], stats);
            });
          });
          new_state = new_state.set('content', content);
        }
        return state.mergeDeep(new_state);
      }
    case RECEIVE_NOTIFICATIONS:
      {
        // Need to figure out why two sets are not merged
        return state.updateIn(['notifications', payload.name], (0, _immutable.Map)(), function (n) {
          return n.withMutations(function (nmut) {
            return nmut.update('notifications', (0, _immutable.List)(), function (a) {
              return a.concat((0, _immutable.fromJS)(payload.notifications));
            });
          });
        });
      }
    case RECEIVE_UNREAD_NOTIFICATIONS:
      {
        console.log('Receive unread notifications', payload);
        return state.updateIn(['unread_notifications', payload.name], (0, _immutable.Map)(), function (n) {
          return n.withMutations(function (nmut) {
            return nmut.update('unread_notifications', (0, _immutable.List)(), function (a) {
              return a.concat((0, _immutable.fromJS)(payload.notifications));
            });
          });
        });
      }
    case RECEIVE_ACCOUNT:
      {
        var account = transformAccount(payload.account);
        return mergeAccounts(state, account);
      }
    case RECEIVE_ACCOUNTS:
      {
        return payload.accounts.reduce(function (acc, curr) {
          var transformed = transformAccount(curr);
          return mergeAccounts(acc, transformed);
        }, state);
      }

    // Interleave special posts into the map of posts.
    case SYNC_SPECIAL_POSTS:
      {
        return payload.featuredPosts.concat(payload.promotedPosts).reduce(function (acc, specialPost) {
          var author = specialPost.get('author');
          var permlink = specialPost.get('permlink');
          return acc.updateIn(['content', "".concat(author, "/").concat(permlink)], (0, _immutable.Map)(), function (p) {
            return p.mergeDeep(specialPost);
          });
        }, state);
      }
    case RECEIVE_CONTENT:
      {
        var _content = (0, _immutable.fromJS)(payload.content);
        var key = _content.get('author') + '/' + _content.get('permlink');
        return state.updateIn(['content', key], (0, _immutable.Map)(), function (c) {
          c = emptyContentMap.mergeDeep(c);
          c = c["delete"]('active_votes');
          c = c.mergeDeep(_content);
          c = c.set('stats', (0, _immutable.fromJS)((0, _StateFunctions.contentStats)(c)));
          return c;
        });
      }
    case LINK_REPLY:
      {
        var author = payload.author,
          permlink = payload.permlink,
          _payload$parent_autho = payload.parent_author,
          parent_author = _payload$parent_autho === void 0 ? '' : _payload$parent_autho,
          _payload$parent_perml = payload.parent_permlink,
          parent_permlink = _payload$parent_perml === void 0 ? '' : _payload$parent_perml;
        if (parent_author === '' || parent_permlink === '') return state;
        var _key = author + '/' + permlink;
        var parent_key = parent_author + '/' + parent_permlink;
        // Add key if not exist
        var updatedState = state.updateIn(['content', parent_key, 'replies'], (0, _immutable.List)(), function (l) {
          return l.findIndex(function (i) {
            return i === _key;
          }) === -1 ? l.push(_key) : l;
        });
        var children = updatedState.getIn(['content', parent_key, 'replies'], (0, _immutable.List)()).size;
        updatedState = updatedState.updateIn(['content', parent_key, 'children'], 0, function () {
          return children;
        });
        return updatedState;
      }
    case DELETE_CONTENT:
      {
        var _author = payload.author,
          _permlink = payload.permlink;
        var _key2 = _author + '/' + _permlink;
        var _content2 = state.getIn(['content', _key2]);
        var _parent_author = _content2.get('parent_author') || '';
        var _parent_permlink = _content2.get('parent_permlink') || '';
        var _updatedState = state.deleteIn(['content', _key2]);
        if (_parent_author !== '' && _parent_permlink !== '') {
          var _parent_key = _parent_author + '/' + _parent_permlink;
          _updatedState = _updatedState.updateIn(['content', _parent_key, 'replies'], (0, _immutable.List)(), function (r) {
            return r.filter(function (i) {
              return i !== _key2;
            });
          });
        }
        return _updatedState;
      }
    case VOTED:
      {
        var username = payload.username,
          _author2 = payload.author,
          _permlink2 = payload.permlink,
          weight = payload.weight;
        var _key3 = ['content', _author2 + '/' + _permlink2, 'active_votes'];
        var active_votes = state.getIn(_key3, (0, _immutable.List)());
        var idx = active_votes.findIndex(function (v) {
          return v.get('voter') === username;
        });
        // steemd flips weight into percent
        if (idx === -1) {
          active_votes = active_votes.push((0, _immutable.Map)({
            voter: username,
            percent: weight
          }));
        } else {
          active_votes = active_votes.set(idx, (0, _immutable.Map)({
            voter: username,
            percent: weight
          }));
        }
        state.setIn(_key3, active_votes);
        return state;
      }
    case FETCHING_DATA:
      {
        var order = payload.order,
          category = payload.category;
        var _new_state = state.updateIn(['status', category || '', order], function () {
          return {
            fetching: true
          };
        });
        return _new_state;
      }
    case RECEIVE_DATA:
      {
        var data = payload.data,
          _order = payload.order,
          _category = payload.category,
          accountname = payload.accountname,
          fetching = payload.fetching,
          endOfData = payload.endOfData;
        var _new_state2;

        // append incoming post keys to proper content list
        if (_order === 'by_author' || _order === 'by_feed' || _order === 'by_comments' || _order === 'by_replies') {
          // category is either "blog", "feed", "comments", or "recent_replies" (respectively) -- and all posts are keyed under current profile
          var _key4 = ['accounts', accountname, _category];
          _new_state2 = state.updateIn(_key4, (0, _immutable.List)(), function (list) {
            return list.withMutations(function (posts) {
              data.forEach(function (value) {
                var key = "".concat(value.author, "/").concat(value.permlink);
                if (!posts.includes(key)) posts.push(key);
              });
            });
          });
        } else {
          _new_state2 = state.updateIn(['discussion_idx', _category || '', _order], function (list) {
            return list.withMutations(function (posts) {
              data.forEach(function (value) {
                var key = "".concat(value.author, "/").concat(value.permlink);
                if (!posts.includes(key)) posts.push(key);
              });
            });
          });
        }

        // append content stats data to each post
        _new_state2 = _new_state2.updateIn(['content'], function (content) {
          return content.withMutations(function (map) {
            data.forEach(function (value) {
              var key = "".concat(value.author, "/").concat(value.permlink);
              value = (0, _immutable.fromJS)(value);
              value = value.set('stats', (0, _immutable.fromJS)((0, _StateFunctions.contentStats)(value)));
              map.set(key, value);
            });
          });
        });
        _new_state2 = _new_state2.updateIn(['status', _category || '', _order], function () {
          if (endOfData) {
            return {
              fetching: fetching,
              last_fetch: new Date()
            };
          }
          return {
            fetching: fetching
          };
        });
        return _new_state2;
      }
    case SET:
      {
        var _key5 = payload.key,
          value = payload.value;
        var key_array = Array.isArray(_key5) ? _key5 : [_key5];
        return state.setIn(key_array, (0, _immutable.fromJS)(value));
      }
    case REMOVE:
      {
        var _key6 = Array.isArray(payload.key) ? payload.key : [payload.key];
        return state.removeIn(_key6);
      }
    case UPDATE:
      {
        var _key7 = payload.key,
          _payload$notSet = payload.notSet,
          notSet = _payload$notSet === void 0 ? (0, _immutable.Map)() : _payload$notSet,
          updater = payload.updater;
        return state.updateIn(_key7, notSet, updater);
      }
    case FETCH_JSON:
      {
        return state;
      }
    case FETCH_JSON_RESULT:
      {
        var id = payload.id,
          result = payload.result,
          error = payload.error;
        return state.set(id, (0, _immutable.fromJS)({
          result: result,
          error: error
        }));
      }
    case SHOW_DIALOG:
      {
        var name = payload.name,
          _payload$params = payload.params,
          params = _payload$params === void 0 ? {} : _payload$params;
        return state.update('active_dialogs', (0, _immutable.Map)(), function (d) {
          return d.set(name, (0, _immutable.fromJS)({
            params: params
          }));
        });
      }
    case HIDE_DIALOG:
      {
        return state.update('active_dialogs', function (d) {
          return d["delete"](payload.name);
        });
      }
    default:
      return state;
  }
}

// Action creators

var setCollapsed = exports.setCollapsed = function setCollapsed(payload) {
  return {
    type: SET_COLLAPSED,
    payload: payload
  };
};
var receiveState = exports.receiveState = function receiveState(payload) {
  return {
    type: RECEIVE_STATE,
    payload: payload
  };
};
var receiveAccount = exports.receiveAccount = function receiveAccount(payload) {
  return {
    type: RECEIVE_ACCOUNT,
    payload: payload
  };
};
var receiveAccounts = exports.receiveAccounts = function receiveAccounts(payload) {
  return {
    type: RECEIVE_ACCOUNTS,
    payload: payload
  };
};
var syncSpecialPosts = exports.syncSpecialPosts = function syncSpecialPosts(payload) {
  return {
    type: SYNC_SPECIAL_POSTS,
    payload: payload
  };
};
var receiveContent = exports.receiveContent = function receiveContent(payload) {
  return {
    type: RECEIVE_CONTENT,
    payload: payload
  };
};
var linkReply = exports.linkReply = function linkReply(payload) {
  return {
    type: LINK_REPLY,
    payload: payload
  };
};
var deleteContent = exports.deleteContent = function deleteContent(payload) {
  return {
    type: DELETE_CONTENT,
    payload: payload
  };
};
var voted = exports.voted = function voted(payload) {
  return {
    type: VOTED,
    payload: payload
  };
};
var fetchingData = exports.fetchingData = function fetchingData(payload) {
  return {
    type: FETCHING_DATA,
    payload: payload
  };
};
var receiveData = exports.receiveData = function receiveData(payload) {
  return {
    type: RECEIVE_DATA,
    payload: payload
  };
};

// TODO: Find a better name for this
var set = exports.set = function set(payload) {
  return {
    type: SET,
    payload: payload
  };
};
var remove = exports.remove = function remove(payload) {
  return {
    type: REMOVE,
    payload: payload
  };
};
var update = exports.update = function update(payload) {
  return {
    type: UPDATE,
    payload: payload
  };
};
var fetchJson = exports.fetchJson = function fetchJson(payload) {
  return {
    type: FETCH_JSON,
    payload: payload
  };
};
var fetchJsonResult = exports.fetchJsonResult = function fetchJsonResult(payload) {
  return {
    type: FETCH_JSON_RESULT,
    payload: payload
  };
};
var showDialog = exports.showDialog = function showDialog(payload) {
  return {
    type: SHOW_DIALOG,
    payload: payload
  };
};
var hideDialog = exports.hideDialog = function hideDialog(payload) {
  return {
    type: HIDE_DIALOG,
    payload: payload
  };
};
var getState = exports.getState = function getState(payload) {
  return {
    type: GET_STATE,
    payload: payload
  };
};
var receiveNotifications = exports.receiveNotifications = function receiveNotifications(payload) {
  return {
    type: RECEIVE_NOTIFICATIONS,
    payload: payload
  };
};
var receiveUnreadNotifications = exports.receiveUnreadNotifications = function receiveUnreadNotifications(payload) {
  return {
    type: RECEIVE_UNREAD_NOTIFICATIONS,
    payload: payload
  };
};
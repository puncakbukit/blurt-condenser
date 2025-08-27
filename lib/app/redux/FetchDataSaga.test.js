"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _effects = require("redux-saga/effects");
var _blurtjs = require("@blurtfoundation/blurtjs");
var appActions = _interopRequireWildcard(require("./AppReducer"));
var globalActions = _interopRequireWildcard(require("./GlobalReducer"));
var _constants = _interopRequireDefault(require("./constants"));
var _FetchDataSaga = require("./FetchDataSaga");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
describe('FetchDataSaga', function () {
  describe('should fetch multiple and filter', function () {
    var payload = {
      order: 'by_author',
      author: 'alice',
      permlink: 'hair',
      accountname: 'bob',
      postFilter: function postFilter(value) {
        return value.author === 'bob';
      }
    };
    var action = {
      category: '',
      payload: payload
    };
    _constants["default"].FETCH_DATA_BATCH_SIZE = 2;
    var gen = (0, _FetchDataSaga.fetchData)(action);
    it('should signal data fetch', function () {
      var actual = gen.next().value;
      expect(actual).toEqual((0, _effects.put)(globalActions.fetchingData({
        order: 'by_author',
        category: ''
      })));
    });
    it('should call discussions by blog', function () {
      var actual = gen.next().value;
      expect(actual).toEqual((0, _effects.put)(appActions.fetchDataBegin()));
      actual = gen.next().value;
      expect(actual).toEqual((0, _effects.call)([_blurtjs.api, _blurtjs.api.getDiscussionsByBlogAsync], {
        tag: payload.accountname,
        limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
        start_author: payload.author,
        start_permlink: payload.permlink
      }));
    });
    it('should continue fetching data filtering 1 out', function () {
      var actual = gen.next([{
        author: 'alice'
      }, {
        author: 'bob',
        permlink: 'post1'
      }]).value;
      expect(actual).toEqual((0, _effects.put)(globalActions.receiveData({
        data: [{
          author: 'alice'
        }, {
          author: 'bob',
          permlink: 'post1'
        }],
        order: 'by_author',
        category: '',
        author: 'alice',
        firstPermlink: payload.permlink,
        accountname: 'bob',
        fetching: true,
        endOfData: false
      })));
    });
    it('should finish fetching data filtering 1 out', function () {
      var actual = gen.next().value;
      expect(actual).toEqual((0, _effects.call)([_blurtjs.api, _blurtjs.api.getDiscussionsByBlogAsync], {
        tag: payload.accountname,
        limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
        start_author: 'bob',
        start_permlink: 'post1'
      }));
      actual = gen.next([{
        author: 'bob',
        permlink: 'post2'
      }]).value;
      expect(actual).toEqual((0, _effects.put)(globalActions.receiveData({
        data: [{
          author: 'bob',
          permlink: 'post2'
        }],
        order: 'by_author',
        category: '',
        author: 'alice',
        firstPermlink: payload.permlink,
        accountname: 'bob',
        fetching: false,
        endOfData: true
      })));
      actual = gen.next().value;
      expect(actual).toEqual((0, _effects.put)(appActions.fetchDataEnd()));
    });
  });
  describe('should not fetch more batches than max batch size', function () {
    var payload = {
      order: 'by_author',
      author: 'alice',
      permlink: 'hair',
      accountname: 'bob',
      postFilter: function postFilter(value) {
        return value.author === 'bob';
      }
    };
    var action = {
      category: '',
      payload: payload
    };
    _constants["default"].FETCH_DATA_BATCH_SIZE = 2;
    _constants["default"].MAX_BATCHES = 2;
    var gen = (0, _FetchDataSaga.fetchData)(action);
    var actual = gen.next().value;
    expect(actual).toEqual((0, _effects.put)(globalActions.fetchingData({
      order: 'by_author',
      category: ''
    })));
    actual = gen.next().value;
    expect(actual).toEqual((0, _effects.put)(appActions.fetchDataBegin()));
    actual = gen.next().value;
    expect(actual).toEqual((0, _effects.call)([_blurtjs.api, _blurtjs.api.getDiscussionsByBlogAsync], {
      tag: payload.accountname,
      limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
      start_author: payload.author,
      start_permlink: payload.permlink
    }));

    // these all will not satisfy the filter
    actual = gen.next([{
      author: 'alice'
    }, {
      author: 'alice'
    }]).value;
    expect(actual).toEqual((0, _effects.put)(globalActions.receiveData({
      data: [{
        author: 'alice'
      }, {
        author: 'alice'
      }],
      order: 'by_author',
      category: '',
      author: 'alice',
      firstPermlink: payload.permlink,
      accountname: 'bob',
      fetching: true,
      endOfData: false
    })));
    actual = gen.next().value;
    expect(actual).toEqual((0, _effects.call)([_blurtjs.api, _blurtjs.api.getDiscussionsByBlogAsync], {
      tag: payload.accountname,
      limit: _constants["default"].FETCH_DATA_BATCH_SIZE,
      start_author: 'alice'
    }));
    actual = gen.next([{
      author: 'alice'
    }, {
      author: 'alice'
    }]).value;
    expect(actual).toEqual((0, _effects.put)(globalActions.receiveData({
      data: [{
        author: 'alice'
      }, {
        author: 'alice'
      }],
      order: 'by_author',
      category: '',
      author: 'alice',
      firstPermlink: payload.permlink,
      accountname: 'bob',
      fetching: false,
      endOfData: false
    })));
    actual = gen.next().value;
    expect(actual).toEqual((0, _effects.put)(appActions.fetchDataEnd()));
  });
});
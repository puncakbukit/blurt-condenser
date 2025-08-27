"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _immutable = require("immutable");
var _AppReducer = _interopRequireWildcard(require("./AppReducer"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var mockPayloads = (0, _defineProperty2["default"])((0, _defineProperty2["default"])({
  addNotification: {
    key: 'testKey'
  },
  removeNotification: {
    pathname: 'testPath'
  }
}, "removeNotification", {
  key: 'testKey'
}), "setUserPreferences", {
  cat: 'mymy',
  dog: 'polly'
});
var mockActions = {
  LOCATION_CHANGE: {
    type: '@@router/LOCATION_CHANGE',
    payload: {
      pathname: 'testPath'
    }
  }
};
var key = mockPayloads.addNotification.key;
var mockNotification = (0, _immutable.OrderedMap)((0, _defineProperty2["default"])({}, key, {
  action: 'missing translation: en.g.dismiss',
  dismissAfter: 10000,
  key: key
}));
describe('App reducer', function () {
  it('should provide a nice initial state', function () {
    var initial = (0, _AppReducer["default"])();
    expect(initial).toBe(_AppReducer.defaultState);
  });
  it('should return correct state for a LOCATION_CHANGE action', function () {
    var initial = (0, _AppReducer["default"])();
    var actual = (0, _AppReducer["default"])(initial, mockActions.LOCATION_CHANGE);
    var out = actual.get('location');
    expect(out.pathname).toEqual(mockActions.LOCATION_CHANGE.payload.pathname);
  });
  it('should return correct state for a BLURT_API_ERROR action', function () {
    var initial = (0, _AppReducer["default"])();
    var out = (0, _AppReducer["default"])(initial, (0, _AppReducer.steemApiError)());
    expect(out).toEqual(initial);
  });
  it('should return correct state for a FETCH_DATA_BEGIN action', function () {
    var initial = (0, _AppReducer["default"])();
    var actual = (0, _AppReducer["default"])(initial, (0, _AppReducer.fetchDataBegin)());
    var out = actual.get('loading');
    expect(out).toEqual(true);
  });
  it('should return correct state for a FETCH_DATA_END action', function () {
    var initial = (0, _AppReducer["default"])();
    var actual = (0, _AppReducer["default"])(initial, (0, _AppReducer.fetchDataEnd)());
    var out = actual.get('loading');
    expect(out).toEqual(false);
  });
  it('should return correct state for a ADD_NOTIFICATION action', function () {
    var initial = (0, _AppReducer["default"])();
    var actual = (0, _AppReducer["default"])(initial, (0, _AppReducer.addNotification)(mockPayloads.addNotification));
    var out = actual.getIn(['notifications', key]);
    expect(out).toEqual(mockNotification.get(key));
  });
  it('should return correct state for a REMOVE_NOTIFICATION action', function () {
    var initial = (0, _AppReducer["default"])();
    var initialWithNotification = initial.set('notifications', mockNotification);
    var actual = (0, _AppReducer["default"])(initialWithNotification, (0, _AppReducer.removeNotification)(mockPayloads.removeNotification));
    var out = actual.get('notifications');
    var expected = (0, _immutable.OrderedMap)();
    expect(out).toEqual(expected);
  });
  it('should return correct state for a SET_USER_PREFERENCES action', function () {
    var initial = (0, _AppReducer["default"])();
    var actual = (0, _AppReducer["default"])(initial, (0, _AppReducer.setUserPreferences)(mockPayloads.setUserPreferences));
    var out = actual.get('user_preferences');
    var expected = (0, _immutable.Map)({
      cat: 'mymy',
      dog: 'polly'
    });
    expect(out).toEqual(expected);
  });
  it('should return correct state for a TOGGLE_NIGHTMODE action', function () {
    var initial = (0, _AppReducer["default"])();
    var before = initial.getIn(['user_preferences', 'nightmode']);
    var actual = (0, _AppReducer["default"])(initial, (0, _AppReducer.toggleNightmode)());
    var after = actual.getIn(['user_preferences', 'nightmode']);
    expect(after).toEqual(!before);
  });
  it('should return correct state for a TOGGLE_BLOGMODE action', function () {
    var initial = (0, _AppReducer["default"])();
    var before = initial.getIn(['user_preferences', 'blogmode']);
    var actual = (0, _AppReducer["default"])(initial, (0, _AppReducer.toggleBlogmode)());
    var after = actual.getIn(['user_preferences', 'blogmode']);
    expect(after).toEqual(!before);
  });
  test('should merge in received feature flags', function () {
    // Arrange
    var initial = (0, _AppReducer["default"])();

    // Act
    var withFlags = (0, _AppReducer["default"])(initial, (0, _AppReducer.receiveFeatureFlags)({
      flying: true
    }));
    var withMoreFlags = (0, _AppReducer["default"])(withFlags, (0, _AppReducer.receiveFeatureFlags)({
      swimming: false
    }));

    // Assert
    expect(_AppReducer.selectors.getFeatureFlag(withMoreFlags, 'swimming')).toEqual(false);
    expect(_AppReducer.selectors.getFeatureFlag(withMoreFlags, 'flying')).toEqual(true);
    expect(_AppReducer.selectors.getFeatureFlag(withMoreFlags, 'dancing')).toEqual(false);
  });
});
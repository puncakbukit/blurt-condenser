"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _immutable = require("immutable");
var _reactRouterRedux = require("react-router-redux");
var _redux = require("redux");
var _reduxForm = require("redux-form");
var _StateFunctions = require("app/utils/StateFunctions");
var _AppReducer = _interopRequireDefault(require("./AppReducer"));
var _GlobalReducer = _interopRequireDefault(require("./GlobalReducer"));
var _UserReducer = _interopRequireDefault(require("./UserReducer"));
var _TransactionReducer = _interopRequireDefault(require("./TransactionReducer"));
var _OffchainReducer = _interopRequireDefault(require("./OffchainReducer"));
// @deprecated, instead use: app/utils/ReactForm.js

function initReducer(reducer, type) {
  return function (state, action) {
    if (!state) return reducer(state, action);

    // @@redux/INIT server and client init
    if (action.type === '@@redux/INIT' || action.type === '@@INIT') {
      if (!(state instanceof _immutable.Map)) {
        state = (0, _immutable.fromJS)(state);
      }
      if (type === 'global') {
        var content = state.get('content').withMutations(function (c) {
          c.forEach(function (cc, key) {
            if (!c.getIn([key, 'stats'])) {
              // This may have already been set in UniversalRender; if so, then
              //   active_votes were cleared from server response. In this case it
              //   is important to not try to recalculate the stats. (#1040)
              c.setIn([key, 'stats'], (0, _immutable.fromJS)((0, _StateFunctions.contentStats)(cc)));
            }
          });
        });
        state = state.set('content', content);
      }
      return state;
    }
    if (action.type === '@@router/LOCATION_CHANGE' && type === 'global') {
      state = state.set('pathname', action.payload.pathname);
      // console.log(action.type, type, action, state.toJS())
    }
    return reducer(state, action);
  };
}
var _default = exports["default"] = (0, _redux.combineReducers)({
  global: initReducer(_GlobalReducer["default"], 'global'),
  offchain: initReducer(_OffchainReducer["default"]),
  user: initReducer(_UserReducer["default"]),
  transaction: initReducer(_TransactionReducer["default"]),
  discussion: initReducer(function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return state;
  }),
  routing: initReducer(_reactRouterRedux.routerReducer),
  app: initReducer(_AppReducer["default"]),
  form: _reduxForm.reducer
});
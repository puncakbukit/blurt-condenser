"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var appActions = _interopRequireWildcard(require("app/redux/AppReducer"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /* eslint react/prop-types: 0 */
var ArticleLayoutSelector = /*#__PURE__*/function (_React$Component) {
  function ArticleLayoutSelector() {
    (0, _classCallCheck2["default"])(this, ArticleLayoutSelector);
    return _callSuper(this, ArticleLayoutSelector, arguments);
  }
  (0, _inherits2["default"])(ArticleLayoutSelector, _React$Component);
  return (0, _createClass2["default"])(ArticleLayoutSelector, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__layout-selector"
      }, /*#__PURE__*/_react["default"].createElement("svg", {
        className: "articles__icon--layout",
        onClick: this.props.toggleBlogmode
      }, /*#__PURE__*/_react["default"].createElement("g", {
        id: "svg-icon-symbol-layout",
        viewBox: "0 0 24 24",
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      }, /*#__PURE__*/_react["default"].createElement("rect", {
        className: "icon-svg icon-svg--accent icon-svg--layout-line1",
        x: 6,
        y: 16,
        width: 12,
        height: 2
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        className: "icon-svg icon-svg--accent icon-svg--layout-line2",
        x: 6,
        y: 11,
        width: 12,
        height: 2
      }), /*#__PURE__*/_react["default"].createElement("rect", {
        className: "icon-svg icon-svg--accent icon-svg--layout-line3",
        x: 6,
        y: 6,
        width: 12,
        height: 2
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M2,2 L2,22 L22,22 L22,2 L2,2 Z M1,1 L23,1 L23,23 L1,23 L1,1 Z",
        id: "icon-svg__border",
        className: "icon-svg icon-svg--accent",
        fillRule: "nonzero"
      }))));
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = (0, _reactRedux.connect)(function (state) {
  return {
    blogmode: state.app.getIn(['user_preferences', 'blogmode']) === undefined ? true : state.app.getIn(['user_preferences', 'blogmode'])
  };
}, function (dispatch) {
  return {
    toggleBlogmode: function toggleBlogmode() {
      dispatch(appActions.toggleBlogmode());
    }
  };
})(ArticleLayoutSelector);
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _Icon = _interopRequireWildcard(require("app/components/elements/Icon"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var styles = {
  textAlign: 'center',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridAutoRows: 'minmax(80px, auto)'
};
var Grid = function Grid(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles
  }, children);
};
var Benchmark = /*#__PURE__*/function (_React$Component) {
  function Benchmark() {
    (0, _classCallCheck2["default"])(this, Benchmark);
    return _callSuper(this, Benchmark, arguments);
  }
  (0, _inherits2["default"])(Benchmark, _React$Component);
  return (0, _createClass2["default"])(Benchmark, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(Grid, null, _Icon.icons.map(function (icon) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          key: 'icon_' + icon
        }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
          name: icon,
          size: "2x"
        }), /*#__PURE__*/_react["default"].createElement("p", null, " ", icon, " "));
      }));
    }
  }]);
}(_react["default"].Component);
module.exports = {
  path: '/benchmark',
  component: Benchmark
};
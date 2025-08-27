"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Flag = function Flag(_ref) {
  var flagged = _ref.flagged,
    FlagComponent = _ref.FlagComponent,
    _ref$Fallback = _ref.Fallback,
    Fallback = _ref$Fallback === void 0 ? null : _ref$Fallback,
    children = _ref.children;
  if (flagged && children) return _objectSpread({}, children);else return flagged ? FlagComponent : Fallback;
};
Flag.propTypes = {
  flagged: _propTypes["default"].bool.isRequired,
  FlagComponent: function FlagComponent(props, propName, componentName) {
    // First ensure it is a React element
    _propTypes["default"].checkPropTypes({
      FlagComponent: _propTypes["default"].element
    }, props, 'FlagComponent', 'Flag');
    // Also issue a warning if children are also supplied
    if (props[propName] && props.children) {
      return new Error('Supplied both a FlagComponent and children to Flag; rendering children!');
    }
  },
  Fallback: _propTypes["default"].element
};
var _default = exports["default"] = Flag;
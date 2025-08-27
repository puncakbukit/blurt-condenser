"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = void 0;
var _react = _interopRequireDefault(require("react"));
var _react2 = require("@storybook/react");
var _addonKnobs = require("@storybook/addon-knobs");
var _Icon = _interopRequireWildcard(require("./Icon"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var styles = {
  textAlign: 'center',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridAutoRows: 'minmax(80px, auto)'
};
var Grid = exports.Grid = function Grid(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: styles
  }, children);
};
var options = ['1x', '1_5x', '2x', '3x', '4x', '5x', '10x'];
(0, _react2.storiesOf)('Elements', module).addDecorator(_addonKnobs.withKnobs).add('Icon', function () {
  return /*#__PURE__*/_react["default"].createElement(Grid, null, _Icon.icons.map(function (icon) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: 'icon_' + icon
    }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
      name: icon,
      size: (0, _addonKnobs.select)('size', options, '2x')
    }), /*#__PURE__*/_react["default"].createElement("p", null, " ", icon, " "));
  }));
});
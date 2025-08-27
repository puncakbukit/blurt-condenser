"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.avatarSize = exports.SIZE_SMALL = exports.SIZE_MED = exports.SIZE_LARGE = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
var _ProxifyUrl = require("app/utils/ProxifyUrl");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var SIZE_SMALL = exports.SIZE_SMALL = '64x64';
var SIZE_MED = exports.SIZE_MED = '128x128';
var SIZE_LARGE = exports.SIZE_LARGE = '512x512';
var sizeList = [SIZE_SMALL, SIZE_MED, SIZE_LARGE];
var avatarSize = exports.avatarSize = {
  small: SIZE_SMALL,
  medium: SIZE_MED,
  large: SIZE_LARGE
};
var Userpic = /*#__PURE__*/function (_Component) {
  function Userpic() {
    var _this;
    (0, _classCallCheck2["default"])(this, Userpic);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Userpic, [].concat(args));
    (0, _defineProperty2["default"])(_this, "shouldComponentUpdate", (0, _shouldComponentUpdate["default"])(_this, 'Userpic'));
    return _this;
  }
  (0, _inherits2["default"])(Userpic, _Component);
  return (0, _createClass2["default"])(Userpic, [{
    key: "render",
    value: function render() {
      var account = this.props.account;
      var _this$props = this.props,
        json_metadata = _this$props.json_metadata,
        size = _this$props.size;
      var hideIfDefault = this.props.hideIfDefault || false;
      var avSize = size && sizeList.indexOf(size) > -1 ? '/' + size : '';
      if (hideIfDefault) {
        // try to extract image url from users metaData
        try {
          var md = JSON.parse(json_metadata);
          if (!/^(https?:)\/\//.test(md.profile.profile_image)) {
            return null;
          }
        } catch (e) {
          return null;
        }
      }
      var style = {
        backgroundImage: 'url(' + (0, _ProxifyUrl.imageProxy)() + "u/".concat(account, "/avatar/small)")
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "Userpic",
        style: style
      });
    }
  }]);
}(_react.Component);
Userpic.propTypes = {
  account: _propTypes["default"].string.isRequired
};
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, ownProps) {
  var account = ownProps.account,
    hideIfDefault = ownProps.hideIfDefault;
  return {
    account: account,
    json_metadata: state.global.getIn(['accounts', account, 'json_metadata']),
    hideIfDefault: hideIfDefault
  };
})(Userpic);
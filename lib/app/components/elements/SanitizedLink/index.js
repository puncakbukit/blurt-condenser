"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _classnames = _interopRequireDefault(require("classnames"));
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
var _Phishing = require("app/utils/Phishing");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var SanitizedLink = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function SanitizedLink() {
    var _this;
    (0, _classCallCheck2["default"])(this, SanitizedLink);
    _this = _callSuper(this, SanitizedLink);
    (0, _defineProperty2["default"])(_this, "onRevealPhishyLink", function (e) {
      e.preventDefault();
      _this.setState({
        revealPhishyLink: true
      });
    });
    _this.shouldComponentUpdate = (0, _shouldComponentUpdate["default"])(_this, 'SanitizedLink');
    _this.state = {
      revealPhishyLink: false
    };
    return _this;
  }
  (0, _inherits2["default"])(SanitizedLink, _React$Component);
  return (0, _createClass2["default"])(SanitizedLink, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        text = _this$props.text,
        url = _this$props.url;
      var isPhishy = (0, _Phishing.looksPhishy)(url);
      var classes = (0, _classnames["default"])({
        SanitizedLink: true,
        'SanitizedLink--phishyLink': isPhishy
      });
      if (!isPhishy) {
        return /*#__PURE__*/_react["default"].createElement("a", {
          className: classes,
          href: url,
          target: "_blank",
          rel: "noopener noreferrer"
        }, text);
      }
      if (this.state.revealPhishyLink) {
        return /*#__PURE__*/_react["default"].createElement("span", {
          className: classes,
          title: (0, _counterpart["default"])('sanitizedlink_jsx.phishylink_caution')
        }, text);
      }
      return /*#__PURE__*/_react["default"].createElement("span", {
        className: classes
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "phishylink-caution"
      }, (0, _counterpart["default"])('sanitizedlink_jsx.phishylink_caution')), /*#__PURE__*/_react["default"].createElement("span", {
        className: "phishylink-reveal-link",
        role: "button",
        onClick: this.onRevealPhishyLink
      }, (0, _counterpart["default"])('sanitizedlink_jsx.phishylink_reveal')));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(SanitizedLink, "propTypes", {
  url: _propTypes["default"].string,
  text: _propTypes["default"].string
});
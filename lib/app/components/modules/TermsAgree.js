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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _Translator = require("app/Translator");
var _HelpContent = _interopRequireDefault(require("app/components/elements/HelpContent"));
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /* eslint react/prop-types: 0 */
var TermsAgree = /*#__PURE__*/function (_Component) {
  function TermsAgree() {
    var _this;
    (0, _classCallCheck2["default"])(this, TermsAgree);
    _this = _callSuper(this, TermsAgree);
    _this.state = {
      tosChecked: false,
      privacyChecked: false
    };
    _this.termsAgree = _this.termsAgree.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    return _this;
  }
  (0, _inherits2["default"])(TermsAgree, _Component);
  return (0, _createClass2["default"])(TermsAgree, [{
    key: "handleInputChange",
    value: function handleInputChange(event) {
      var target = event.target;
      var value = target.type === 'checkbox' ? target.checked : target.value;
      var name = target.name;
      this.setState((0, _defineProperty2["default"])({}, name, value));
    }
  }, {
    key: "termsAgree",
    value: function termsAgree(e) {
      // let user proceed
      this.props.acceptTerms(e);
    }
  }, {
    key: "render",
    value: function render() {
      var username = this.props.username;
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h4", null, (0, _counterpart["default"])('termsagree_jsx.please_review')), /*#__PURE__*/_react["default"].createElement("p", null, (0, _counterpart["default"])('termsagree_jsx.hi_user', {
        username: username
      })), /*#__PURE__*/_react["default"].createElement("p", null, (0, _counterpart["default"])('termsagree_jsx.blurb')), /*#__PURE__*/_react["default"].createElement("p", null, /*#__PURE__*/_react["default"].createElement("label", null, /*#__PURE__*/_react["default"].createElement("input", {
        name: "tosChecked",
        type: "checkbox",
        checked: this.state.tosChecked,
        onChange: this.handleInputChange
      }), (0, _counterpart["default"])('termsagree_jsx.i_agree_to_steemits'), ' ', /*#__PURE__*/_react["default"].createElement("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        href: "/tos.html"
      }, (0, _counterpart["default"])('termsagree_jsx.terms_of_service')))), /*#__PURE__*/_react["default"].createElement("p", null, /*#__PURE__*/_react["default"].createElement("label", null, /*#__PURE__*/_react["default"].createElement("input", {
        name: "privacyChecked",
        type: "checkbox",
        checked: this.state.privacyChecked,
        onChange: this.handleInputChange
      }), (0, _counterpart["default"])('termsagree_jsx.i_agree_to_steemits'), ' ', /*#__PURE__*/_react["default"].createElement("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        href: "/privacy.html"
      }, (0, _counterpart["default"])('termsagree_jsx.privacy_policy')))), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("button", {
        type: "submit",
        className: "button",
        onClick: this.termsAgree,
        disabled: !this.state.tosChecked || !this.state.privacyChecked
      }, (0, _counterpart["default"])('termsagree_jsx.continue'))));
    }
  }]);
}(_react.Component);
(0, _defineProperty2["default"])(TermsAgree, "propTypes", {
  username: _propTypes["default"].string.isRequired,
  acceptTerms: _propTypes["default"].func.isRequired
});
var _default = exports["default"] = (0, _reactRedux.connect)(function (state) {
  return {
    username: state.user.getIn(['current', 'username'])
  };
}, function (dispatch) {
  return {
    acceptTerms: function acceptTerms(e) {
      if (e) e.preventDefault();
      dispatch(userActions.acceptTerms());
    }
  };
})(TermsAgree); // mapStateToProps
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _ReactForm = _interopRequireDefault(require("app/utils/ReactForm"));
var _constants = require("shared/constants");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _immutable = require("immutable");
var _BeneficiarySelector = _interopRequireWildcard(require("app/components/cards/BeneficiarySelector"));
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var _reactRedux = require("react-redux");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var PostAdvancedSettings = /*#__PURE__*/function (_Component) {
  function PostAdvancedSettings(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, PostAdvancedSettings);
    _this = _callSuper(this, PostAdvancedSettings);
    (0, _defineProperty2["default"])(_this, "handlePayoutChange", function (event) {
      _this.setState({
        payoutType: event.target.value
      });
    });
    _this.state = {
      payoutType: props.initialPayoutType
    };
    _this.initForm(props);
    return _this;
  }
  (0, _inherits2["default"])(PostAdvancedSettings, _Component);
  return (0, _createClass2["default"])(PostAdvancedSettings, [{
    key: "initForm",
    value: function initForm(props) {
      var fields = props.fields;
      (0, _ReactForm["default"])({
        fields: fields,
        instance: this,
        name: 'advancedSettings',
        initialValues: props.initialValues,
        validation: function validation(values) {
          return {
            beneficiaries: (0, _BeneficiarySelector.validateBeneficiaries)(props.username, values.beneficiaries, false)
          };
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        formId = _this$props.formId,
        username = _this$props.username,
        defaultPayoutType = _this$props.defaultPayoutType,
        initialPayoutType = _this$props.initialPayoutType;
      var _this$state = this.state,
        beneficiaries = _this$state.beneficiaries,
        payoutType = _this$state.payoutType;
      var _this$state$advancedS = this.state.advancedSettings,
        submitting = _this$state$advancedS.submitting,
        valid = _this$state$advancedS.valid,
        handleSubmit = _this$state$advancedS.handleSubmit;
      var disabled = submitting || !(valid || payoutType !== initialPayoutType);
      var form = /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: handleSubmit(function (_ref) {
          var data = _ref.data;
          var err = (0, _BeneficiarySelector.validateBeneficiaries)(_this2.props.username, data.beneficiaries, true);
          if (!err) {
            _this2.props.setPayoutType(formId, payoutType);
            _this2.props.setBeneficiaries(formId, data.beneficiaries);
            _this2.props.hideAdvancedSettings();
          }
        })
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, /*#__PURE__*/_react["default"].createElement("h4", null, (0, _counterpart["default"])('post_advanced_settings_jsx.payout_option_header')), /*#__PURE__*/_react["default"].createElement("p", null, (0, _counterpart["default"])('post_advanced_settings_jsx.payout_option_description')))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-12 medium-6 large-12 columns"
      }, /*#__PURE__*/_react["default"].createElement("select", {
        defaultValue: payoutType,
        onChange: this.handlePayoutChange
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "0%"
      }, (0, _counterpart["default"])('reply_editor.decline_payout')), /*#__PURE__*/_react["default"].createElement("option", {
        value: "100%"
      }, (0, _counterpart["default"])('reply_editor.power_up_100'))))), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, (0, _counterpart["default"])('post_advanced_settings_jsx.current_default'), ":", ' ', defaultPayoutType === '0%' ? (0, _counterpart["default"])('reply_editor.decline_payout') : (0, _counterpart["default"])('reply_editor.power_up_100'))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: '/@' + username + '/settings'
      }, (0, _counterpart["default"])('post_advanced_settings_jsx.update_default_in_settings')))), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("h4", {
        className: "column"
      }, (0, _counterpart["default"])('beneficiary_selector_jsx.header'))), /*#__PURE__*/_react["default"].createElement(_BeneficiarySelector["default"], (0, _extends2["default"])({}, beneficiaries.props, {
        tabIndex: 1
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "error"
      }, (beneficiaries.touched || beneficiaries.value) && beneficiaries.error, "\xA0"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("button", {
        type: "submit",
        className: "button",
        disabled: disabled,
        tabIndex: 2
      }, (0, _counterpart["default"])('g.save'))))));
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("h3", {
        className: "column"
      }, (0, _counterpart["default"])('reply_editor.advanced_settings'))), /*#__PURE__*/_react["default"].createElement("hr", null), form);
    }
  }]);
}(_react.Component);
(0, _defineProperty2["default"])(PostAdvancedSettings, "propTypes", {
  formId: _react["default"].PropTypes.string.isRequired
});
var _default = exports["default"] = (0, _reactRedux.connect)(
// mapStateToProps
function (state, ownProps) {
  var formId = ownProps.formId;
  var username = state.user.getIn(['current', 'username']);
  var isStory = formId === _constants.SUBMIT_FORM_ID;
  var defaultPayoutType = state.app.getIn(['user_preferences', isStory ? 'defaultBlogPayout' : 'defaultCommentPayout'], '100%');
  var initialPayoutType = state.user.getIn(['current', 'post', formId, 'payoutType']);
  var beneficiaries = state.user.getIn(['current', 'post', formId, 'beneficiaries']);
  console.log(beneficiaries);
  beneficiaries = beneficiaries ? beneficiaries.toJS() : [];
  return _objectSpread(_objectSpread({}, ownProps), {}, {
    fields: ['beneficiaries'],
    defaultPayoutType: defaultPayoutType,
    initialPayoutType: initialPayoutType,
    username: username,
    initialValues: {
      beneficiaries: beneficiaries
    }
  });
},
// mapDispatchToProps
function (dispatch) {
  return {
    hideAdvancedSettings: function hideAdvancedSettings() {
      return dispatch(userActions.hidePostAdvancedSettings());
    },
    setPayoutType: function setPayoutType(formId, payoutType) {
      return dispatch(userActions.set({
        key: ['current', 'post', formId, 'payoutType'],
        value: payoutType
      }));
    },
    setBeneficiaries: function setBeneficiaries(formId, beneficiaries) {
      return dispatch(userActions.set({
        key: ['current', 'post', formId, 'beneficiaries'],
        value: (0, _immutable.fromJS)(beneficiaries)
      }));
    }
  };
})(PostAdvancedSettings);
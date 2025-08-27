"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.validateCategory = validateCategory;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
var _ReduxForms = require("app/utils/ReduxForms");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _Tooltip = _interopRequireDefault(require("app/components/elements/Tooltip"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var CategorySelector = /*#__PURE__*/function (_React$Component) {
  function CategorySelector() {
    var _this;
    (0, _classCallCheck2["default"])(this, CategorySelector);
    _this = _callSuper(this, CategorySelector);
    _this.state = {
      createCategory: true
    };
    _this.shouldComponentUpdate = (0, _shouldComponentUpdate["default"])(_this, 'CategorySelector');
    _this.categoryCreateToggle = function (e) {
      e.preventDefault();
      _this.props.onChange();
      _this.setState({
        createCategory: !_this.state.createCategory
      });
      setTimeout(function () {
        return _this.refs.categoryRef.focus();
      }, 300);
    };
    _this.categorySelectOnChange = function (e) {
      e.preventDefault();
      var value = e.target.value;
      var onBlur = _this.props.onBlur; // call onBlur to trigger validation immediately
      if (value === 'new') {
        _this.setState({
          createCategory: true
        });
        setTimeout(function () {
          if (onBlur) onBlur();
          _this.refs.categoryRef.focus();
        }, 300);
      } else _this.props.onChange(e);
    };
    return _this;
  }
  (0, _inherits2["default"])(CategorySelector, _React$Component);
  return (0, _createClass2["default"])(CategorySelector, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        trending = _this$props.trending,
        tabIndex = _this$props.tabIndex,
        disabled = _this$props.disabled;
      var categories = trending.slice(0, 20);
      var createCategory = this.state.createCategory;
      var categoryOptions = categories.map(function (c, idx) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: c,
          key: idx
        }, c);
      });
      var impProps = _objectSpread({}, this.props);
      var categoryInput = /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("input", (0, _extends2["default"])({
        type: "text"
      }, (0, _ReduxForms.cleanReduxInput)(impProps), {
        ref: "categoryRef",
        tabIndex: tabIndex,
        disabled: disabled,
        autoCapitalize: "none"
      })), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("br", null), categories.map(function (c, idx) {
        return /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("a", {
          key: idx,
          value: c,
          onClick: function onClick() {
            if (!impProps.value.includes(c.get('tag'))) {
              impProps.onChange("".concat(impProps.value, " ").concat(c.get('tag')).trim());
            }
          }
        }, /*#__PURE__*/_react["default"].createElement(_Tooltip["default"], {
          t: c.get('description')
        }, "#", c.get('tag'))), ' ', "\xA0");
      }));
      var categorySelect = /*#__PURE__*/_react["default"].createElement("select", (0, _extends2["default"])({}, (0, _ReduxForms.cleanReduxInput)(this.props), {
        onChange: this.categorySelectOnChange,
        ref: "categoryRef",
        tabIndex: tabIndex,
        disabled: disabled
      }), /*#__PURE__*/_react["default"].createElement("option", {
        value: ""
      }, (0, _counterpart["default"])('category_selector_jsx.select_a_tag'), "..."), categoryOptions, /*#__PURE__*/_react["default"].createElement("option", {
        value: "new"
      }, this.props.placeholder));
      return /*#__PURE__*/_react["default"].createElement("span", null, createCategory ? categoryInput : categorySelect);
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(CategorySelector, "propTypes", {
  // HTML props
  id: _propTypes["default"].string,
  // DOM id for active component (focusing, etc...)
  autoComplete: _propTypes["default"].string,
  placeholder: _propTypes["default"].string,
  onChange: _propTypes["default"].func.isRequired,
  onBlur: _propTypes["default"].func.isRequired,
  isEdit: _propTypes["default"].bool,
  disabled: _propTypes["default"].bool,
  value: _propTypes["default"].string,
  tabIndex: _propTypes["default"].number,
  // redux connect (overwrite in HTML)
  trending: _propTypes["default"].object.isRequired // Immutable.List
});
(0, _defineProperty2["default"])(CategorySelector, "defaultProps", {
  autoComplete: 'on',
  id: 'CategorySelectorId',
  isEdit: false
});
function validateCategory(category) {
  var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!category || category.split(':')[0].trim() === '') return required ? (0, _counterpart["default"])('g.required') : null;
  var cats = category.split(':')[0].trim().split(' ');
  return (
    // !category || category.trim() === '' ? 'Required' :
    cats.length > 5 ? (0, _counterpart["default"])('category_selector_jsx.use_limited_amount_of_categories', {
      amount: 5
    }) : cats.find(function (c) {
      return c.length > 24;
    }) ? (0, _counterpart["default"])('category_selector_jsx.maximum_tag_length_is_24_characters') : cats.find(function (c) {
      return c.split('-').length > 2;
    }) ? (0, _counterpart["default"])('category_selector_jsx.use_one_dash') : cats.find(function (c) {
      return c.indexOf(',') >= 0;
    }) ? (0, _counterpart["default"])('category_selector_jsx.use_spaces_to_separate_tags') : cats.find(function (c) {
      return /[A-Z]/.test(c);
    }) ? (0, _counterpart["default"])('category_selector_jsx.use_only_lowercase_letters') : cats.find(function (c) {
      return !/^[a-z0-9-#]+$/.test(c);
    }) ? (0, _counterpart["default"])('category_selector_jsx.use_only_allowed_characters') : cats.find(function (c) {
      return !/^[a-z-#]/.test(c);
    }) ? (0, _counterpart["default"])('category_selector_jsx.must_start_with_a_letter') : cats.find(function (c) {
      return !/[a-z0-9]$/.test(c);
    }) ? (0, _counterpart["default"])('category_selector_jsx.must_end_with_a_letter_or_number') : null
  );
}
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, ownProps) {
  var trending = state.global.getIn(['tag_idx', 'trending']);
  // apply translations
  // they are used here because default prop can't acces intl property
  var placeholder = (0, _counterpart["default"])('category_selector_jsx.tag_your_story');
  return _objectSpread({
    trending: trending,
    placeholder: placeholder
  }, ownProps);
})(CategorySelector);
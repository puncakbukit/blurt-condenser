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
var _ServerApiClient = require("app/utils/ServerApiClient");
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _reactCopyToClipboard = _interopRequireDefault(require("react-copy-to-clipboard"));
var _counterpart = _interopRequireDefault(require("counterpart"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var ExplorePost = /*#__PURE__*/function (_Component) {
  function ExplorePost(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ExplorePost);
    _this = _callSuper(this, ExplorePost, [props]);
    _this.state = {
      copied: false,
      copiedMD: false
    };
    _this.onCopy = _this.onCopy.bind(_this);
    _this.onCopyMD = _this.onCopyMD.bind(_this);
    // this.Steemd = this.Steemd.bind(this);
    // this.Steemdb = this.Steemdb.bind(this);
    // this.Busy = this.Busy.bind(this);
    return _this;
  }

  // Steemd() {
  //     serverApiRecordEvent('SteemdView', this.props.permlink);
  // }
  //
  // Steemdb() {
  //     serverApiRecordEvent('SteemdbView', this.props.permlink);
  // }
  //
  // Busy() {
  //     serverApiRecordEvent('Busy view', this.props.permlink);
  // }
  (0, _inherits2["default"])(ExplorePost, _Component);
  return (0, _createClass2["default"])(ExplorePost, [{
    key: "onCopy",
    value: function onCopy() {
      this.setState({
        copied: true
      });
    }
  }, {
    key: "onCopyMD",
    value: function onCopyMD() {
      this.setState({
        copiedMD: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var link = this.props.permlink;
      var title = this.props.title;
      // const steemd = 'https://steemd.com' + link;
      // const steemdb = 'https://steemdb.com' + link;
      // const busy = 'https://busy.org' + link;
      var blurt_world = 'https://blurt.blog' + link;
      var blurtmd = '[' + title + '](https://blurt.blog' + link + ')';
      var text = this.state.copied == true ? (0, _counterpart["default"])('explorepost_jsx.copied') : (0, _counterpart["default"])('explorepost_jsx.copy');
      var textMD = this.state.copiedMD == true ? (0, _counterpart["default"])('explorepost_jsx.copied') : (0, _counterpart["default"])('explorepost_jsx.copy');
      return /*#__PURE__*/_react["default"].createElement("span", {
        className: "ExplorePost"
      }, /*#__PURE__*/_react["default"].createElement("h4", null, (0, _counterpart["default"])('g.share_this_post')), /*#__PURE__*/_react["default"].createElement("hr", null), /*#__PURE__*/_react["default"].createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        className: "input-group-field share-box",
        type: "text",
        value: blurt_world,
        onChange: function onChange(e) {
          return e.preventDefault();
        }
      }), /*#__PURE__*/_react["default"].createElement(_reactCopyToClipboard["default"], {
        text: blurt_world,
        onCopy: this.onCopy,
        className: "ExplorePost__copy-button input-group-label"
      }, /*#__PURE__*/_react["default"].createElement("span", null, text))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "input-group"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        className: "input-group-field share-box",
        type: "text",
        value: blurtmd,
        onChange: function onChange(e) {
          return e.preventDefault();
        }
      }), /*#__PURE__*/_react["default"].createElement(_reactCopyToClipboard["default"], {
        text: blurtmd,
        onCopy: this.onCopyMD,
        className: "ExplorePost__copy-button input-group-label"
      }, /*#__PURE__*/_react["default"].createElement("span", null, textMD))), /*#__PURE__*/_react["default"].createElement("h5", null, (0, _counterpart["default"])('explorepost_jsx.alternative_sources')), /*#__PURE__*/_react["default"].createElement("ul", null));
    }
  }]);
}(_react.Component);
(0, _defineProperty2["default"])(ExplorePost, "propTypes", {
  permlink: _propTypes["default"].string.isRequired,
  title: _propTypes["default"].string.isRequired
});
var _default = exports["default"] = (0, _reactRedux.connect)()(ExplorePost);
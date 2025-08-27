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
var _remarkable = _interopRequireDefault(require("remarkable"));
var _SanitizeConfig = _interopRequireWildcard(require("app/utils/SanitizeConfig"));
var _sanitizeHtml = _interopRequireDefault(require("sanitize-html"));
var _HtmlReady = _interopRequireDefault(require("shared/HtmlReady"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _EmbeddedPlayers = require("app/components/elements/EmbeddedPlayers");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var remarkable = new _remarkable["default"]({
  html: true,
  // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false,
  // linkify is done locally
  typographer: false,
  // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’'
});
var remarkableToSpec = new _remarkable["default"]({
  html: true,
  breaks: false,
  // real markdown uses \n\n for paragraph breaks
  linkify: false,
  typographer: false,
  quotes: '“”‘’'
});
var MarkdownViewer = /*#__PURE__*/function (_Component) {
  function MarkdownViewer() {
    var _this;
    (0, _classCallCheck2["default"])(this, MarkdownViewer);
    _this = _callSuper(this, MarkdownViewer);
    (0, _defineProperty2["default"])(_this, "onAllowNoImage", function () {
      _this.setState({
        allowNoImage: false
      });
    });
    _this.state = {
      allowNoImage: true
    };
    return _this;
  }
  (0, _inherits2["default"])(MarkdownViewer, _Component);
  return (0, _createClass2["default"])(MarkdownViewer, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(np, ns) {
      return np.text !== this.props.text || np.large !== this.props.large || ns.allowNoImage !== this.state.allowNoImage;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        noImage = _this$props.noImage,
        hideImages = _this$props.hideImages;
      var allowNoImage = this.state.allowNoImage;
      var text = this.props.text;
      if (!text) text = ''; // text can be empty, still view the link meta data
      var _this$props2 = this.props,
        large = _this$props2.large,
        highQualityPost = _this$props2.highQualityPost;
      var html = false;
      // See also ReplyEditor isHtmlTest
      var m = text.match(/^<html>([\S\s]*)<\/html>$/);
      if (m && m.length === 2) {
        html = true;
        text = m[1];
      } else {
        // See also ReplyEditor isHtmlTest
        html = /^<p>[\S\s]*<\/p>/.test(text);
      }

      // Strip out HTML comments. "JS-DOS" bug.
      text = text.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');
      var renderer = remarkableToSpec;
      if (this.props.breaks === true) {
        renderer = remarkable;
      }
      var renderedText = html ? text : renderer.render(text);

      // If content isn't wrapped with an html element at this point, add it.
      if (!renderedText.indexOf('<html>') !== 0) {
        renderedText = '<html>' + renderedText + '</html>';
      }

      // Embed videos, link mentions and hashtags, etc...
      if (renderedText) renderedText = (0, _HtmlReady["default"])(renderedText, {
        hideImages: hideImages
      }).html;

      // Complete removal of javascript and other dangerous tags..
      // The must remain as close as possible to dangerouslySetInnerHTML
      var cleanText = renderedText;
      if (this.props.allowDangerousHTML === true) {
        console.log('WARN\tMarkdownViewer rendering unsanitized content');
      } else {
        cleanText = (0, _sanitizeHtml["default"])(renderedText, (0, _SanitizeConfig["default"])({
          large: large,
          highQualityPost: highQualityPost,
          noImage: noImage && allowNoImage
        }));
      }
      if (/<\s*script/gi.test(cleanText)) {
        // Not meant to be complete checking, just a secondary trap and red flag (code can change)
        console.error('Refusing to render script tag in post text', cleanText);
        return /*#__PURE__*/_react["default"].createElement("div", null);
      }
      var noImageActive = cleanText.indexOf(_SanitizeConfig.noImageText) !== -1;

      // In addition to inserting the youtube component, this allows
      // react to compare separately preventing excessive re-rendering.
      var idx = 0;
      var sections = [];
      function checksum(s) {
        var chk = 0x12345678;
        var len = s.length;
        for (var i = 0; i < len; i += 1) {
          chk += s.charCodeAt(i) * (i + 1);
        }
        return (chk & 0xffffffff).toString(16);
      }

      // HtmlReady inserts ~~~ embed:${id} type ~~~
      var _iterator = _createForOfIteratorHelper(cleanText.split('~~~ embed:')),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var section = _step.value;
          var embedMd = (0, _EmbeddedPlayers.generateMd)(section, idx, large);
          if (embedMd) {
            var newSection = embedMd.section,
              markdown = embedMd.markdown;
            section = newSection;
            sections.push(markdown);
            if (section === '') continue;
          }
          sections.push(/*#__PURE__*/_react["default"].createElement("div", {
            key: checksum(section),
            dangerouslySetInnerHTML: {
              __html: section
            }
          }));
          idx += 1;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var cn = 'Markdown' + (this.props.className ? " ".concat(this.props.className) : '') + (html ? ' html' : '') + (large ? '' : ' MarkdownViewer--small');
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: 'MarkdownViewer ' + cn
      }, sections, noImageActive && allowNoImage && /*#__PURE__*/_react["default"].createElement("div", {
        key: 'hidden-content',
        onClick: this.onAllowNoImage,
        className: "MarkdownViewer__negative_group"
      }, (0, _counterpart["default"])('markdownviewer_jsx.images_were_hidden_due_to_low_ratings'), /*#__PURE__*/_react["default"].createElement("button", {
        style: {
          marginBottom: 0
        },
        className: "button hollow tiny float-right"
      }, (0, _counterpart["default"])('g.show'))));
    }
  }]);
}(_react.Component);
(0, _defineProperty2["default"])(MarkdownViewer, "propTypes", {
  // HTML properties
  text: _propTypes["default"].string,
  className: _propTypes["default"].string,
  large: _propTypes["default"].bool,
  jsonMetadata: _propTypes["default"].object,
  highQualityPost: _propTypes["default"].bool,
  noImage: _propTypes["default"].bool,
  allowDangerousHTML: _propTypes["default"].bool,
  hideImages: _propTypes["default"].bool,
  // whether to replace images with just a span containing the src url
  breaks: _propTypes["default"].bool // true to use bastardized markdown that cares about newlines
  // used for the ImageUserBlockList
});
(0, _defineProperty2["default"])(MarkdownViewer, "defaultProps", {
  allowDangerousHTML: false,
  breaks: true,
  className: '',
  hideImages: false,
  large: false
});
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, ownProps) {
  return _objectSpread({}, ownProps);
})(MarkdownViewer);
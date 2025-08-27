"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireWildcard(require("react"));
var _reactRedux = require("react-redux");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var BiddingAd = /*#__PURE__*/function (_Component) {
  function BiddingAd(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, BiddingAd);
    _this = _callSuper(this, BiddingAd, [props]);
    var ad = props.ad,
      enabled = props.enabled,
      type = props.type;
    _this.ad = {};
    _this.type = type;
    _this.enabled = false;
    if (ad) {
      // console.info(
      //     `Slot named '${props.slotName}' will render with given data:`,
      //     ad
      // );
      _this.enabled = enabled;
      _this.ad = ad.toJS();
    } else {
      // console.info(
      //     `Slot named '${
      //         props.slotName
      //     }' will be disabled because we were unable to find the ad details.`
      // );
    }
    return _this;
  }
  (0, _inherits2["default"])(BiddingAd, _Component);
  return (0, _createClass2["default"])(BiddingAd, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      if (!this.ad.path || !this.enabled) return;
      googletag.cmd.push(function () {
        var slot = googletag.defineSlot(_this2.ad.path, _this2.ad.dimensions, _this2.ad.path);
        if (slot) {
          slot.addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
          googletag.cmd.push(function () {
            googletag.display(_this2.ad.path);
            _this2.refreshBid(_this2.ad.path, slot);
            googletag.pubads().addEventListener('impressionViewable', function (e) {
              window.dispatchEvent(new Event('gptadshown', e));
            });
            googletag.pubads().addEventListener('slotRenderEnded', function (e) {
              window.dispatchEvent(new Event('gptadshown', e));
            });
          });
        }
      });
    }
  }, {
    key: "refreshBid",
    value: function refreshBid(path, slot) {
      pbjs.que.push(function () {
        pbjs.requestBids({
          timeout: 2000,
          adUnitCodes: [path],
          bidsBackHandler: function bidsBackHandler() {
            pbjs.setTargetingForGPTAsync([path]);
            googletag.pubads().refresh([slot]);
          }
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "bidding-ad gpt-ad",
        style: {
          width: '100%'
        },
        id: this.ad.path
      });
    }
  }]);
}(_react.Component);
BiddingAd.propTypes = {
  ad: _react.PropTypes.shape({
    path: _react.PropTypes.string,
    dimensions: _react.PropTypes.array
  }).isRequired,
  enabled: _react.PropTypes.bool.isRequired,
  type: _react.PropTypes.oneOf(['Bidding', 'Category', 'Basic'])
};
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, props) {
  var enabled = !!state.app.getIn(['googleAds', 'gptEnabled']) && !!process.env.BROWSER && !!window.googletag;
  var postCategory = state.global.get('postCategory');
  var basicSlots = state.app.getIn(['googleAds', 'gptBasicSlots']);
  var biddingSlots = state.app.getIn(['googleAds', 'gptBiddingSlots']);
  var categorySlots = state.app.getIn(['googleAds', 'gptCategorySlots']);
  var slotName = props.slotName;
  var type = props.type;
  var slot = state.app.getIn(['googleAds', "gpt".concat(type, "Slots"), slotName]);
  return _objectSpread({
    enabled: enabled,
    ad: slot
  }, props);
}, function (dispatch) {
  return {};
})(BiddingAd);
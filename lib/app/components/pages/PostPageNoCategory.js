"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _reactRouter = require("react-router");
var _reactRedux = require("react-redux");
var _FetchDataSaga = require("app/redux/FetchDataSaga");
var _LoadingIndicator = _interopRequireDefault(require("app/components/elements/LoadingIndicator"));
var _SvgImage = _interopRequireDefault(require("app/components/elements/SvgImage"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var PostWrapper = /*#__PURE__*/function (_React$Component) {
  function PostWrapper() {
    var _this;
    (0, _classCallCheck2["default"])(this, PostWrapper);
    _this = _callSuper(this, PostWrapper);
    _this.state = {
      loading: true
    };
    return _this;
  }
  (0, _inherits2["default"])(PostWrapper, _React$Component);
  return (0, _createClass2["default"])(PostWrapper, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;
      var route_params = this.props.routeParams;
      var post = route_params.username + '/' + route_params.slug;
      var dis = this.props.content.get(post);
      if (!dis) {
        this.props.getContent({
          author: route_params.username,
          permlink: route_params.slug
        }).then(function (content) {
          if (content) {
            _reactRouter.browserHistory.replace("/".concat(content.category, "/@").concat(post));
          }
        })["catch"](function () {
          _this2.setState({
            loading: false
          });
        });
      } else if (dis.get('id') === '0.0.0') {
        // non-existing post
        this.setState({
          loading: false
        });
      } else {
        if (_reactRouter.browserHistory) {
          _reactRouter.browserHistory.replace("/".concat(dis.get('category'), "/@").concat(post));
        }
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(np, ns) {
      return ns.loading !== this.state.loading;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", null, this.state.loading ? /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement(_LoadingIndicator["default"], {
        type: "circle"
      })) : /*#__PURE__*/_react["default"].createElement("div", {
        className: "NotFound float-center"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/"
      }, /*#__PURE__*/_react["default"].createElement(_SvgImage["default"], {
        name: "404",
        width: "640px",
        height: "480px"
      }))));
    }
  }]);
}(_react["default"].Component);
var StoreWrapped = (0, _reactRedux.connect)(function (state) {
  return {
    content: state.global.get('content')
  };
}, function (dispatch) {
  return {
    getContent: function getContent(payload) {
      return new Promise(function (resolve, reject) {
        dispatch(_FetchDataSaga.actions.getContent(_objectSpread(_objectSpread({}, payload), {}, {
          resolve: resolve,
          reject: reject
        })));
      });
    }
  };
})(PostWrapper);
module.exports = {
  path: '/@:username/:slug',
  component: StoreWrapped
};
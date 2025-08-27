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
var _reactRouter = require("react-router");
var _reactRedux = require("react-redux");
var _StateFunctions = require("app/utils/StateFunctions");
var _counterpart = _interopRequireDefault(require("counterpart"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var TagsIndex = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function TagsIndex(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, TagsIndex);
    _this = _callSuper(this, TagsIndex, [props]);
    (0, _defineProperty2["default"])(_this, "onChangeSort", function (e, order) {
      e.preventDefault();
      _this.setState({
        order: order
      });
    });
    (0, _defineProperty2["default"])(_this, "compareTags", function (a, b, type) {
      switch (type) {
        case 'name':
          return a.get('name').localeCompare(b.get('name'));
        case 'posts':
          return parseInt(a.get('top_posts')) <= parseInt(b.get('top_posts')) ? 1 : -1;
        case 'comments':
          return parseInt(a.get('comments')) <= parseInt(b.get('comments')) ? 1 : -1;
        case 'payouts':
          return parseInt(a.get('total_payouts')) <= parseInt(b.get('total_payouts')) ? 1 : -1;
      }
    });
    _this.state = {
      order: props.order || 'name'
    };
    _this.onChangeSort = _this.onChangeSort.bind(_this);
    return _this;
  }
  (0, _inherits2["default"])(TagsIndex, _React$Component);
  return (0, _createClass2["default"])(TagsIndex, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var res = this.props.tagsAll !== nextProps.tagsAll || this.state !== nextState;
      return res;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var tagsAll = this.props.tagsAll;
      //console.log('-- TagsIndex.render -->', tagsAll.toJS());
      var order = this.state.order;
      var tags = tagsAll;
      var rows = tags.filter(
      // there is a blank tag present, as well as some starting with #. filter them out.
      function (tag) {
        return /^[a-z]/.test(tag.get('name'));
      }).sort(function (a, b) {
        return _this2.compareTags(a, b, order);
      }).map(function (tag) {
        var name = tag.get('name');
        var link = "/trending/".concat(name);
        return /*#__PURE__*/_react["default"].createElement("tr", {
          key: name
        }, /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
          to: link,
          activeClassName: "active"
        }, name)), /*#__PURE__*/_react["default"].createElement("td", null, (0, _StateFunctions.numberWithCommas)(tag.get('top_posts').toString())), /*#__PURE__*/_react["default"].createElement("td", null, (0, _StateFunctions.numberWithCommas)(tag.get('comments').toString())), /*#__PURE__*/_react["default"].createElement("td", null, (0, _StateFunctions.numberWithCommas)(tag.get('total_payouts'))));
      }).toArray();
      var cols = [['name', (0, _counterpart["default"])('g.tag')], ['posts', (0, _counterpart["default"])('g.posts')], ['comments', (0, _counterpart["default"])('g.comments')], ['payouts', (0, _counterpart["default"])('g.payouts')]].map(function (col) {
        return /*#__PURE__*/_react["default"].createElement("th", {
          key: col[0]
        }, order === col[0] ? /*#__PURE__*/_react["default"].createElement("strong", null, col[1]) : /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
          to: "#",
          onClick: function onClick(e) {
            return _this2.onChangeSort(e, col[0]);
          }
        }, col[1]));
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "TagsIndex row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("h4", null, (0, _counterpart["default"])('g.trending_topics')), /*#__PURE__*/_react["default"].createElement("table", null, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, cols)), /*#__PURE__*/_react["default"].createElement("tbody", null, rows))));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(TagsIndex, "propTypes", {
  tagsAll: _propTypes["default"].object.isRequired
});
module.exports = {
  path: 'tags(/:order)',
  component: (0, _reactRedux.connect)(function (state) {
    return {
      tagsAll: state.global.get('tags')
    };
  })(TagsIndex)
};
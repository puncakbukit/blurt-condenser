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
var _reactRedux = require("react-redux");
var _immutable = require("immutable");
var _TimeAgoWrapper = _interopRequireDefault(require("app/components/elements/TimeAgoWrapper"));
var _FetchDataSaga = require("app/redux/FetchDataSaga");
var _Callout = _interopRequireDefault(require("app/components/elements/Callout"));
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _Userpic = _interopRequireDefault(require("app/components/elements/Userpic"));
var _counterpart = _interopRequireDefault(require("counterpart"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var notificationsIcon = function notificationsIcon(type) {
  var types = {
    reply: 'chatbox',
    reply_post: 'chatbox',
    reply_comment: 'chatbox',
    follow: 'voters',
    set_label: 'pencil2',
    set_role: 'pencil2',
    error: 'cog',
    reblog: 'reblog',
    mention: 'chatboxes',
    transfer: 'transfer',
    witness_vote: 'witness'
  };
  var icon = 'chain';
  if (type in types) {
    icon = types[type];
  } else {
    console.error('no icon for type: ', type);
  }
  return /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
    size: "0_8x",
    name: icon
  });
};
var highlightText = function highlightText(text, highlight) {
  if (!highlight) return text;
  var parts = text.split(new RegExp("(".concat(highlight, ")"), 'gi'));
  return /*#__PURE__*/_react["default"].createElement("span", null, ' ', parts.map(function (part, i) {
    return /*#__PURE__*/_react["default"].createElement("span", {
      key: i,
      style: part.toLowerCase() === highlight.toLowerCase() ? {
        fontWeight: 'bold'
      } : {}
    }, part);
  }), ' ');
};
var pic = function pic(author) {
  return /*#__PURE__*/_react["default"].createElement("a", {
    href: '/@' + author
  }, /*#__PURE__*/_react["default"].createElement(_Userpic["default"], {
    account: author
  }));
};
var NotificationsList = /*#__PURE__*/function (_React$Component) {
  function NotificationsList() {
    var _this;
    (0, _classCallCheck2["default"])(this, NotificationsList);
    _this = _callSuper(this, NotificationsList);
    (0, _defineProperty2["default"])(_this, "onClickMarkAsRead", function (e) {
      e.preventDefault();
      var _this$props = _this.props,
        username = _this$props.username,
        markAsRead = _this$props.markAsRead;
      markAsRead(username);
    });
    return _this;
  }
  (0, _inherits2["default"])(NotificationsList, _React$Component);
  return (0, _createClass2["default"])(NotificationsList, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this$props2 = this.props,
        username = _this$props2.username,
        getAccountNotifications = _this$props2.getAccountNotifications;
      if (username) {
        getAccountNotifications(username);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props3 = this.props,
        username = _this$props3.username,
        getAccountNotifications = _this$props3.getAccountNotifications;
      if (prevProps.username !== username) {
        getAccountNotifications(username);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        notifications = _this$props4.notifications,
        isOwnAccount = _this$props4.isOwnAccount,
        accountName = _this$props4.accountName;
      var renderItem = function renderItem(item, index) {
        var lastRead = localStorage.getItem('last_timestamp');
        var unRead = lastRead <= item.timestamp;
        var key = "".concat(index).concat(item.timestamp);
        if (item.type === 'mention') {
          var type = item.type;
          var account = item.author;
          var timestamp = item.timestamp;
          var permlink = item.permlink;
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            className: "notification__item flex-body"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, pic("".concat(account))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__message"
          }, /*#__PURE__*/_react["default"].createElement("a", {
            href: "/@".concat(account, "/").concat(permlink)
          }, highlightText("".concat((0, _counterpart["default"])('notificationsList_jsx.mention', {
            account: account
          })), "".concat(account))))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__icon"
          }, notificationsIcon(type)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__date"
          }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
            date: new Date(timestamp * 1000).toJSON()
          }))), unRead && /*#__PURE__*/_react["default"].createElement("span", {
            className: "notification__unread"
          }, "\u2022"));
        } else if (item.type === 'transfer') {
          var _type = item.type;
          var _account = item.from;
          var _timestamp = item.timestamp;
          var amount = item.amount;
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            className: "notification__item flex-body"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, pic("".concat(_account))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__message"
          }, /*#__PURE__*/_react["default"].createElement("a", {
            href: "https://blurtwallet.com/@".concat(accountName, "/transfers")
          }, highlightText("".concat((0, _counterpart["default"])('notificationsList_jsx.transfer', {
            account: _account,
            amount: amount
          })), "".concat(_account))))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__icon"
          }, notificationsIcon(_type)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__date"
          }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
            date: new Date(_timestamp * 1000).toJSON()
          }))), unRead && /*#__PURE__*/_react["default"].createElement("span", {
            className: "notification__unread"
          }, "\u2022"));
        } else if (item.type === 'reply') {
          var _type2 = item.type;
          var _account2 = item.author;
          var _timestamp2 = item.timestamp;
          var _permlink = item.permlink;
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            className: "notification__item flex-body"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, pic("".concat(_account2))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__message"
          }, /*#__PURE__*/_react["default"].createElement("a", {
            href: "/@".concat(_account2, "/").concat(_permlink)
          }, highlightText("".concat((0, _counterpart["default"])('notificationsList_jsx.reply', {
            account: _account2
          })), "".concat(_account2))))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__icon"
          }, notificationsIcon(_type2)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__date"
          }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
            date: new Date(_timestamp2 * 1000).toJSON()
          }))), unRead && /*#__PURE__*/_react["default"].createElement("span", {
            className: "notification__unread"
          }, "\u2022"));
        } else if (item.type === 'reblog') {
          var _type3 = item.type;
          var _account3 = item.account;
          var _timestamp3 = item.timestamp;
          var _permlink2 = item.permlink;
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            className: "notification__item flex-body"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, pic("".concat(_account3))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__message"
          }, /*#__PURE__*/_react["default"].createElement("a", {
            href: "/@".concat(accountName, "/").concat(_permlink2)
          }, highlightText("".concat((0, _counterpart["default"])('notificationsList_jsx.reblog', {
            account: _account3
          })), "".concat(_account3))))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__icon"
          }, notificationsIcon(_type3)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__date"
          }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
            date: new Date(_timestamp3 * 1000).toJSON()
          }))), unRead && /*#__PURE__*/_react["default"].createElement("span", {
            className: "notification__unread"
          }, "\u2022"));
        } else if (item.type === 'follow') {
          var _type4 = item.type;
          var _account4 = item.follower;
          var _timestamp4 = item.timestamp;
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            className: "notification__item flex-body"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, pic("".concat(_account4))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__message"
          }, /*#__PURE__*/_react["default"].createElement("a", {
            href: "/@".concat(_account4)
          }, highlightText("".concat((0, _counterpart["default"])('notificationsList_jsx.follow', {
            account: _account4
          })), "".concat(_account4))))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__icon"
          }, notificationsIcon(_type4)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__date"
          }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
            date: new Date(_timestamp4 * 1000).toJSON()
          }))), unRead && /*#__PURE__*/_react["default"].createElement("span", {
            className: "notification__unread"
          }, "\u2022"));
        } else if (item.type === 'witness_vote') {
          var _type5 = item.type;
          var _account5 = item.account;
          var _timestamp5 = item.timestamp;
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: key,
            className: "notification__item flex-body"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, pic("".concat(_account5))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__message"
          }, /*#__PURE__*/_react["default"].createElement("a", {
            href: "/@".concat(_account5)
          }, highlightText("".concat((0, _counterpart["default"])('notificationsList_jsx.witness_vote', {
            account: _account5
          })), "".concat(_account5))))), /*#__PURE__*/_react["default"].createElement("div", {
            className: "flex-row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__icon"
          }, notificationsIcon(_type5)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "notification__date"
          }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
            date: new Date(_timestamp5 * 1000).toJSON()
          }))), unRead && /*#__PURE__*/_react["default"].createElement("span", {
            className: "notification__unread"
          }, "\u2022"));
        }
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: ""
      }, isOwnAccount, notifications && notifications.length > 0 && /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("a", {
        href: "#",
        onClick: this.onClickMarkAsRead
      }, /*#__PURE__*/_react["default"].createElement("strong", null, (0, _counterpart["default"])('notificationsList_jsx.mark_all_as_read'))), /*#__PURE__*/_react["default"].createElement("br", null)), notifications && notifications.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          lineHeight: '1rem'
        }
      }, notifications.map(function (item) {
        return renderItem(item);
      })), !notifications && process.env.BROWSER && /*#__PURE__*/_react["default"].createElement(_Callout["default"], null, "Welcome! You don't have any notifications yet."));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(NotificationsList, "propTypes", {
  username: _propTypes["default"].string.isRequired,
  markAsRead: _propTypes["default"].func.isRequired
});
(0, _defineProperty2["default"])(NotificationsList, "defaultProps", {
  notifications: []
});
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, props) {
  var accountName = props.username;
  var isOwnAccount = state.user.getIn(['current', 'username'], '') == accountName;
  var notifications = state.global.getIn(['notifications', accountName, 'notifications'], (0, _immutable.List)()).toJS();
  return _objectSpread(_objectSpread({}, props), {}, {
    isOwnAccount: isOwnAccount,
    accountName: accountName,
    notifications: notifications
  });
}, function (dispatch) {
  return {
    getAccountNotifications: function getAccountNotifications(username) {
      var query = {
        account: username
      };
      return dispatch(_FetchDataSaga.actions.getAccountNotifications(query));
    },
    markAsRead: function markAsRead(username) {
      var query = {
        account: username
      };
      if (typeof localStorage != 'undefined') {
        localStorage.setItem('last_timestamp', Math.floor(Date.now() / 1000));
      }
      return dispatch(_FetchDataSaga.actions.getAccountNotifications(query));
    }
  };
})(NotificationsList);
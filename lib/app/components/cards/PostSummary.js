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
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRouter = require("react-router");
var _TimeAgoWrapper = _interopRequireDefault(require("app/components/elements/TimeAgoWrapper"));
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _reactRedux = require("react-redux");
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var _Reblog = _interopRequireDefault(require("app/components/elements/Reblog"));
var _Voting = _interopRequireDefault(require("app/components/elements/Voting"));
var _Accessors = require("app/utils/Accessors");
var _ExtractContent = _interopRequireDefault(require("app/utils/ExtractContent"));
var _VotesAndComments = _interopRequireDefault(require("app/components/elements/VotesAndComments"));
var _immutable = require("immutable");
var _Author = _interopRequireDefault(require("app/components/elements/Author"));
var _TagList = _interopRequireDefault(require("app/components/elements/TagList"));
var _UserNames = _interopRequireDefault(require("app/components/elements/UserNames"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _ImageUserBlockList = _interopRequireDefault(require("app/utils/ImageUserBlockList"));
var _ProxifyUrl = _interopRequireDefault(require("app/utils/ProxifyUrl"));
var _Userpic = _interopRequireWildcard(require("app/components/elements/Userpic"));
var _constants = require("shared/constants");
var _StateFunctions = require("app/utils/StateFunctions");
var _ParsersAndFormatters = require("app/utils/ParsersAndFormatters");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var PostSummary = /*#__PURE__*/function (_React$Component) {
  function PostSummary() {
    var _this;
    (0, _classCallCheck2["default"])(this, PostSummary);
    _this = _callSuper(this, PostSummary);
    _this.state = {
      revealNsfw: false
    };
    _this.onRevealNsfw = _this.onRevealNsfw.bind(_this);
    return _this;
  }
  (0, _inherits2["default"])(PostSummary, _React$Component);
  return (0, _createClass2["default"])(PostSummary, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(props, state) {
      return props.thumbSize !== this.props.thumbSize || props.pending_payout !== this.props.pending_payout || props.total_payout !== this.props.total_payout || props.username !== this.props.username || props.nsfwPref !== this.props.nsfwPref || props.blogmode !== this.props.blogmode || state.revealNsfw !== this.state.revealNsfw;
    }
  }, {
    key: "onRevealNsfw",
    value: function onRevealNsfw(e) {
      e.preventDefault();
      this.setState({
        revealNsfw: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        thumbSize = _this$props.thumbSize,
        ignore = _this$props.ignore;
      var _this$props2 = this.props,
        post = _this$props2.post,
        content = _this$props2.content,
        featured = _this$props2.featured,
        promoted = _this$props2.promoted,
        onClose = _this$props2.onClose;
      var account = this.props.account;
      if (!content) return null;
      var reblogged_by;
      if (content.get('reblogged_by') && content.get('reblogged_by').size > 0) {
        reblogged_by = content.get('reblogged_by').toJS();
      }
      if (reblogged_by) {
        reblogged_by = /*#__PURE__*/_react["default"].createElement("div", {
          className: "articles__resteem"
        }, /*#__PURE__*/_react["default"].createElement("p", {
          className: "articles__resteem-text"
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "articles__resteem-icon"
        }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
          name: "reblog"
        })), /*#__PURE__*/_react["default"].createElement(_UserNames["default"], {
          names: reblogged_by
        }), ' ', (0, _counterpart["default"])('postsummary_jsx.resteemed')));
      }

      // 'account' is the current blog being viewed, if applicable.
      if (account && account != content.get('author')) {
        reblogged_by = /*#__PURE__*/_react["default"].createElement("div", {
          className: "articles__resteem"
        }, /*#__PURE__*/_react["default"].createElement("p", {
          className: "articles__resteem-text"
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "articles__resteem-icon"
        }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
          name: "reblog"
        })), (0, _counterpart["default"])('postsummary_jsx.resteemed')));
      }
      var _content$get$toJS = content.get('stats', (0, _immutable.Map)()).toJS(),
        gray = _content$get$toJS.gray;
      var authorRepLog10 = (0, _ParsersAndFormatters.repLog10)(content.get('author_reputation'));
      var isNsfw = (0, _StateFunctions.hasNsfwTag)(content);
      var special = content.get('special');
      var p = (0, _ExtractContent["default"])(_Accessors.immutableAccessor, content);
      var desc = p.desc;

      //const archived = content.get('cashout_time') === '1969-12-31T23:59:59'; // TODO: audit after HF17. #1259

      var post_url;
      var title_text;
      var comments_url;
      if (content.get('depth') > 0) {
        title_text = (0, _counterpart["default"])('g.re_to', {
          topic: content.get('root_title')
        });
        post_url = '/' + content.get('category') + '/@' + content.get('author') + '/' + content.get('permlink');
        comments_url = p.link + '#comments';
      } else {
        title_text = p.title;
        post_url = p.link;
        comments_url = post_url + '#comments';
      }
      var content_body = /*#__PURE__*/_react["default"].createElement("div", {
        className: "PostSummary__body entry-content"
      }, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: post_url
      }, desc));
      var content_title = /*#__PURE__*/_react["default"].createElement("h2", {
        className: "articles__h2 entry-title"
      }, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: post_url
      }, isNsfw && /*#__PURE__*/_react["default"].createElement("span", {
        className: "nsfw-flag"
      }, "nsfw"), title_text), featured && /*#__PURE__*/_react["default"].createElement("span", {
        className: "FeaturedTag"
      }, "Featured"), promoted && /*#__PURE__*/_react["default"].createElement("span", {
        className: "PromotedTag"
      }, "Sponsored"));

      // author and category
      var author_category = /*#__PURE__*/_react["default"].createElement("span", {
        className: "vcard"
      }, /*#__PURE__*/_react["default"].createElement(_Userpic["default"], {
        account: p.author
      }), /*#__PURE__*/_react["default"].createElement(_Author["default"], {
        author: p.author,
        authorRepLog10: authorRepLog10,
        follow: false,
        mute: false
      }), " ", (0, _counterpart["default"])('g.in'), " ", /*#__PURE__*/_react["default"].createElement(_TagList["default"], {
        post: p,
        single: true
      }), "\xA0\u2022\xA0", /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: post_url
      }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
        date: p.created,
        className: "updated"
      })));

      // New Post Summary heading
      var summary_header = /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__summary-header"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "user"
      }, !isNsfw ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "user__col user__col--left"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "user__link",
        href: '/@' + p.author
      }, /*#__PURE__*/_react["default"].createElement(_Userpic["default"], {
        account: p.author,
        size: _Userpic.avatarSize.small
      }))) : null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "user__col user__col--right"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "user__name"
      }, /*#__PURE__*/_react["default"].createElement(_Author["default"], {
        author: p.author,
        authorRepLog10: authorRepLog10,
        follow: false,
        mute: false
      })), /*#__PURE__*/_react["default"].createElement("span", {
        className: "articles__tag-link"
      }, (0, _counterpart["default"])('g.in'), "\xA0", /*#__PURE__*/_react["default"].createElement(_TagList["default"], {
        post: p,
        single: true
      }), "\xA0\u2022\xA0"), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        className: "timestamp__link",
        to: post_url
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "timestamp__time"
      }, /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
        date: p.created,
        className: "updated"
      })))), (featured || promoted) && /*#__PURE__*/_react["default"].createElement("a", {
        onClick: onClose,
        className: "PostDismiss",
        title: "Dismiss Post"
      }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "close"
      }))));
      var content_footer = /*#__PURE__*/_react["default"].createElement("div", {
        className: "PostSummary__footer"
      }, /*#__PURE__*/_react["default"].createElement(_Voting["default"], {
        post: post,
        showList: true
      }), /*#__PURE__*/_react["default"].createElement(_VotesAndComments["default"], {
        post: post,
        commentsLink: comments_url
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "PostSummary__time_author_category"
      }, /*#__PURE__*/_react["default"].createElement(_Reblog["default"], {
        author: p.author,
        permlink: p.permlink,
        parent_author: p.parent_author
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "show-for-medium"
      }, author_category)));
      var summary_footer = /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__summary-footer"
      }, /*#__PURE__*/_react["default"].createElement(_Voting["default"], {
        post: post,
        showList: true
      }), /*#__PURE__*/_react["default"].createElement(_VotesAndComments["default"], {
        post: post,
        commentsLink: comments_url
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "PostSummary__time_author_category"
      }, /*#__PURE__*/_react["default"].createElement(_Reblog["default"], {
        author: p.author,
        permlink: p.permlink,
        parent_author: p.parent_author
      })));
      var _this$props3 = this.props,
        nsfwPref = _this$props3.nsfwPref,
        username = _this$props3.username;
      var revealNsfw = this.state.revealNsfw;
      if (isNsfw) {
        if (nsfwPref === 'hide') {
          // user wishes to hide these posts entirely
          return null;
        } else if (nsfwPref === 'warn' && !revealNsfw) {
          // user wishes to be warned, and has not revealed this post
          return /*#__PURE__*/_react["default"].createElement("article", {
            className: 'PostSummary hentry',
            itemScope: true,
            itemType: "http://schema.org/blogPost"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "PostSummary__nsfw-warning"
          }, summary_header, /*#__PURE__*/_react["default"].createElement("span", {
            className: "nsfw-flag"
          }, "nsfw"), "\xA0\xA0", /*#__PURE__*/_react["default"].createElement("span", {
            className: "ptc",
            role: "button",
            onClick: this.onRevealNsfw
          }, /*#__PURE__*/_react["default"].createElement("a", null, (0, _counterpart["default"])('postsummary_jsx.reveal_it'))), ' ', (0, _counterpart["default"])('g.or') + ' ', username ? /*#__PURE__*/_react["default"].createElement("span", null, (0, _counterpart["default"])('postsummary_jsx.adjust_your'), ' ', /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/@".concat(username, "/settings")
          }, (0, _counterpart["default"])('postsummary_jsx.display_preferences')), ".") : /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("a", {
            href: _constants.SIGNUP_URL
          }, (0, _counterpart["default"])('postsummary_jsx.create_an_account')), ' ', (0, _counterpart["default"])('postsummary_jsx.to_save_your_preferences'), "."), summary_footer));
        }
      }
      var userBlacklisted = _ImageUserBlockList["default"].includes(p.author);
      var thumb = null;
      if (!gray && p.image_link && !userBlacklisted) {
        // on mobile, we always use blog layout style -- there's no toggler
        // on desktop, we offer a choice of either blog or list
        // if blogmode is false, output an image with a srcset
        // which has the 256x512 for whatever the large breakpoint is where the list layout is used
        // and the 640 for lower than that

        var blogSize = (0, _ProxifyUrl["default"])(p.image_link).replace(/ /g, '%20');
        if (this.props.blogmode) {
          thumb = /*#__PURE__*/_react["default"].createElement("span", {
            className: "articles__feature-img-container"
          }, /*#__PURE__*/_react["default"].createElement("img", {
            className: "articles__feature-img",
            src: blogSize
          }));
        } else {
          var listSize = (0, _ProxifyUrl["default"])(p.image_link, '256x256').replace(/ /g, '%20');
          thumb = /*#__PURE__*/_react["default"].createElement("span", {
            className: "articles__feature-img-container"
          }, /*#__PURE__*/_react["default"].createElement("picture", {
            className: "articles__feature-img"
          }, /*#__PURE__*/_react["default"].createElement("source", {
            srcSet: listSize,
            media: "(min-width: 1000px)"
          }), /*#__PURE__*/_react["default"].createElement("img", {
            srcSet: blogSize
          })));
        }
      }

      // A post is hidden if it's marked "gray" or "ignore" and it's not
      // special.
      var commentClasses = [];
      if (!special && (gray || ignore)) commentClasses.push('downvoted'); // rephide

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__summary"
      }, reblogged_by, summary_header, /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__content-block articles__content-block--text"
      }, content_title), /*#__PURE__*/_react["default"].createElement("div", {
        className: 'articles__content hentry' + (thumb ? ' with-image ' : ' ') + commentClasses.join(' '),
        itemScope: true,
        itemType: "http://schema.org/blogPost"
      }, thumb ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__content-block articles__content-block--img"
      }, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        className: "articles__link",
        to: post_url
      }, thumb)) : null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__content-block articles__content-block--text"
      }, content_body, this.props.blogmode ? null : summary_footer), this.props.blogmode ? summary_footer : null));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(PostSummary, "propTypes", {
  post: _propTypes["default"].string.isRequired,
  pending_payout: _propTypes["default"].string.isRequired,
  total_payout: _propTypes["default"].string.isRequired,
  content: _propTypes["default"].object.isRequired,
  featured: _propTypes["default"].bool,
  promoted: _propTypes["default"].bool,
  onClose: _propTypes["default"].func,
  thumbSize: _propTypes["default"].string,
  nsfwPref: _propTypes["default"].string
});
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, props) {
  var post = props.post;
  var content = state.global.get('content').get(post);
  var pending_payout = 0;
  var total_payout = 0;
  if (content) {
    pending_payout = content.get('pending_payout_value');
    total_payout = content.get('total_payout_value');
  }
  return {
    post: post,
    content: content,
    pending_payout: pending_payout ? pending_payout.toString() : pending_payout,
    total_payout: total_payout ? total_payout.toString() : total_payout,
    username: state.user.getIn(['current', 'username']) || state.offchain.get('account'),
    blogmode: state.app.getIn(['user_preferences', 'blogmode']) === undefined ? true : state.app.getIn(['user_preferences', 'blogmode'])
  };
}, function (dispatch) {
  return {
    dispatchSubmit: function dispatchSubmit(data) {
      dispatch(userActions.usernamePasswordLogin(_objectSpread({}, data)));
    },
    clearError: function clearError() {
      dispatch(userActions.loginError({
        error: null
      }));
    }
  };
})(PostSummary);
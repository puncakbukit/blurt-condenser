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
var _reactRedux = require("react-redux");
var _counterpart = _interopRequireDefault(require("counterpart"));
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var _FetchDataSaga = require("app/redux/FetchDataSaga");
var _PostSummary = _interopRequireDefault(require("app/components/cards/PostSummary"));
var _Post = _interopRequireDefault(require("app/components/pages/Post"));
var _LoadingIndicator = _interopRequireDefault(require("app/components/elements/LoadingIndicator"));
var _lodash = _interopRequireDefault(require("lodash.debounce"));
var _DomUtils = require("app/utils/DomUtils");
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _GptAd = _interopRequireDefault(require("app/components/elements/GptAd"));
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}
var PostsList = /*#__PURE__*/function (_React$Component) {
  function PostsList() {
    var _this;
    (0, _classCallCheck2["default"])(this, PostsList);
    _this = _callSuper(this, PostsList);
    (0, _defineProperty2["default"])(_this, "toggleNegativeReplies", function () {
      _this.setState({
        showNegativeComments: !_this.state.showNegativeComments
      });
    });
    (0, _defineProperty2["default"])(_this, "scrollListener", (0, _lodash["default"])(function () {
      var el = window.document.getElementById('posts_list');
      if (!el) return;
      var scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < 10) {
        var _this$props = _this.props,
          loadMore = _this$props.loadMore,
          posts = _this$props.posts,
          category = _this$props.category,
          showResteem = _this$props.showResteem;
        if (loadMore && posts && posts.size) loadMore(posts.last(), category, showResteem);
      }
      // Detect if we're in mobile mode (renders larger preview imgs)
      var mq = window.matchMedia('screen and (max-width: 39.9375em)');
      if (mq.matches) {
        _this.setState({
          thumbSize: 'mobile'
        });
      } else {
        _this.setState({
          thumbSize: 'desktop'
        });
      }
    }, 150));
    _this.state = {
      thumbSize: 'desktop',
      showNegativeComments: false
    };
    _this.scrollListener = _this.scrollListener.bind(_this);
    _this.onBackButton = _this.onBackButton.bind(_this);
    _this.closeOnOutsideClick = _this.closeOnOutsideClick.bind(_this);
    _this.shouldComponentUpdate = (0, _shouldComponentUpdate["default"])(_this, 'PostsList');
    return _this;
  }
  (0, _inherits2["default"])(PostsList, _React$Component);
  return (0, _createClass2["default"])(PostsList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.attachScrollListener();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.detachScrollListener();
      window.removeEventListener('popstate', this.onBackButton);
      window.removeEventListener('keydown', this.onBackButton);
      var post_overlay = document.getElementById('post_overlay');
      if (post_overlay) post_overlay.removeEventListener('click', this.closeOnOutsideClick);
      document.getElementsByTagName('body')[0].className = '';
    }
  }, {
    key: "onBackButton",
    value: function onBackButton(e) {
      if ('keyCode' in e && e.keyCode !== 27) return;
      window.removeEventListener('popstate', this.onBackButton);
      window.removeEventListener('keydown', this.onBackButton);
    }
  }, {
    key: "closeOnOutsideClick",
    value: function closeOnOutsideClick(e) {
      var inside_post = (0, _DomUtils.findParent)(e.target, 'PostsList__post_container');
      if (!inside_post) {
        var inside_top_bar = (0, _DomUtils.findParent)(e.target, 'PostsList__post_top_bar');
        if (!inside_top_bar) {
          var post_overlay = document.getElementById('post_overlay');
          if (post_overlay) post_overlay.removeEventListener('click', this.closeOnOutsideClick);
          this.closePostModal();
        }
      }
    }
  }, {
    key: "fetchIfNeeded",
    value: function fetchIfNeeded() {
      this.scrollListener();
    }
  }, {
    key: "attachScrollListener",
    value: function attachScrollListener() {
      window.addEventListener('scroll', this.scrollListener, {
        capture: false,
        passive: true
      });
      window.addEventListener('resize', this.scrollListener, {
        capture: false,
        passive: true
      });
      this.scrollListener();
    }
  }, {
    key: "detachScrollListener",
    value: function detachScrollListener() {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('resize', this.scrollListener);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props2 = this.props,
        posts = _this$props2.posts,
        showFeatured = _this$props2.showFeatured,
        showPromoted = _this$props2.showPromoted,
        showResteem = _this$props2.showResteem,
        showSpam = _this$props2.showSpam,
        loading = _this$props2.loading,
        anyPosts = _this$props2.anyPosts,
        pathname = _this$props2.pathname,
        category = _this$props2.category,
        content = _this$props2.content,
        ignore_result = _this$props2.ignore_result,
        account = _this$props2.account,
        username = _this$props2.username,
        nsfwPref = _this$props2.nsfwPref,
        blacklist = _this$props2.blacklist;
      var thumbSize = this.state.thumbSize;
      var postsInfo = [];
      posts.forEach(function (item) {
        var cont = content.get(item);
        if (!cont) {
          console.error('PostsList --> Missing cont key', item);
          return;
        }
        var ignore = ignore_result && ignore_result.has(cont.get('author'));
        var hideResteem = !showResteem && account && cont.get('author') != account;
        var hide = cont.getIn(['stats', 'hide']);
        if (!hideResteem && (!(ignore || hide) || showSpam))
          // rephide
          postsInfo.push({
            item: item,
            ignore: ignore
          });
      });

      // Helper functions for determining whether to show special posts.
      var isLoggedInOnFeed = username && pathname === "/@".concat(username, "/feed");
      var isLoggedOutOnTrending = !username && (pathname === '/' || pathname === '/hot' || pathname === '/hot/');
      var areFeaturedPostsVisible = showFeatured && (isLoggedInOnFeed || isLoggedOutOnTrending);
      var areFeaturedPostsReady = isLoggedInOnFeed ? anyPosts : postsInfo.length > 0;
      var showFeaturedPosts = areFeaturedPostsVisible && areFeaturedPostsReady;
      var featureds = this.props.featured;
      var renderFeatured = function renderFeatured(featuredPosts) {
        if (!process.env.BROWSER) return null;
        return featuredPosts.map(function (featuredPost) {
          var id = "".concat(featuredPost.author, "/").concat(featuredPost.permlink);
          if (localStorage.getItem("hidden-featured-post-".concat(id))) return null;
          var featuredPostContent = content.get(id);
          var isSeen = featuredPostContent.get('seen');
          var close = function close(e) {
            e.preventDefault();
            localStorage.setItem("hidden-featured-post-".concat(id), true);
            _this2.forceUpdate();
          };
          return /*#__PURE__*/_react["default"].createElement("li", {
            key: id
          }, /*#__PURE__*/_react["default"].createElement(_PostSummary["default"], {
            account: account,
            post: id,
            thumbSize: thumbSize,
            ignore: false,
            nsfwPref: nsfwPref,
            featured: true,
            onClose: close
          }));
        });
      };
      var arePromotedPostsVisible = showPromoted && (isLoggedInOnFeed || isLoggedOutOnTrending);
      var arePromotedPostsReady = isLoggedInOnFeed ? anyPosts : postsInfo.length > 0;
      var showPromotedPosts = arePromotedPostsVisible && arePromotedPostsReady;
      var promoteds = this.props.promoted;
      var renderPromoted = function renderPromoted(promotedPosts) {
        if (!process.env.BROWSER) return null;
        return promotedPosts.map(function (promotedPost) {
          var id = "".concat(promotedPost.author, "/").concat(promotedPost.permlink);
          if (localStorage.getItem("hidden-promoted-post-".concat(id))) return null;
          var promotedPostContent = content.get(id);
          var isSeen = promotedPostContent.get('seen');
          var close = function close(e) {
            e.preventDefault();
            localStorage.setItem("hidden-promoted-post-".concat(id), true);
            _this2.forceUpdate();
          };
          return /*#__PURE__*/_react["default"].createElement("li", {
            key: id
          }, /*#__PURE__*/_react["default"].createElement(_PostSummary["default"], {
            account: account,
            post: id,
            thumbSize: thumbSize,
            ignore: false,
            nsfwPref: nsfwPref,
            promoted: true,
            onClose: close
          }));
        });
      };
      var renderSummary = function renderSummary(items) {
        return items.map(function (item, i) {
          var every = _this2.props.adSlots.in_feed_1.every;
          var author = content.get(item.item).get('author');
          if (_this2.props.shouldSeeAds && i >= every && i % every === 0) {
            return /*#__PURE__*/_react["default"].createElement("div", {
              key: item.item
            }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement(_PostSummary["default"], {
              account: account,
              post: item.item,
              thumbSize: thumbSize,
              ignore: item.ignore,
              nsfwPref: nsfwPref
            })), /*#__PURE__*/_react["default"].createElement("div", {
              className: "articles__content-block--ad"
            }, /*#__PURE__*/_react["default"].createElement(_GptAd["default"], {
              tags: [category],
              type: "Freestar",
              id: "bsa-zone_1566495089502-1_123456"
            })));
          }
          return /*#__PURE__*/_react["default"].createElement("li", {
            key: item.item
          }, /*#__PURE__*/_react["default"].createElement(_PostSummary["default"], {
            account: account,
            post: item.item,
            thumbSize: thumbSize,
            ignore: item.ignore,
            nsfwPref: nsfwPref
          }));
        });
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "posts_list",
        className: "PostsList"
      }, /*#__PURE__*/_react["default"].createElement("ul", {
        className: "PostsList__summaries hfeed",
        itemScope: true,
        itemType: "http://schema.org/blogPosts"
      }, showFeaturedPosts && renderFeatured(featureds), showPromotedPosts && renderPromoted(promoteds), renderSummary(postsInfo)), loading && /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement(_LoadingIndicator["default"], {
        style: {
          marginBottom: '2rem'
        },
        type: "circle"
      })));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(PostsList, "propTypes", {
  posts: _propTypes["default"].object.isRequired,
  loading: _propTypes["default"].bool.isRequired,
  category: _propTypes["default"].string,
  loadMore: _propTypes["default"].func,
  showSpam: _propTypes["default"].bool,
  showResteem: _propTypes["default"].bool,
  fetchState: _propTypes["default"].func.isRequired,
  pathname: _propTypes["default"].string,
  nsfwPref: _propTypes["default"].string.isRequired
});
(0, _defineProperty2["default"])(PostsList, "defaultProps", {
  showSpam: false,
  loading: false
});
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, props) {
  var pathname = state.app.get('location').pathname;
  var current = state.user.get('current');
  var username = current ? current.get('username') : state.offchain.get('account');
  var content = state.global.get('content');
  var ignore_result = state.global.getIn(['follow', 'getFollowingAsync', username, 'ignore_result']);
  var userPreferences = state.app.get('user_preferences').toJS();
  var nsfwPref = userPreferences.nsfwPref || 'warn';
  var featured = state.offchain.get('special_posts').get('featured_posts').toJS();
  var promoted = state.offchain.get('special_posts').get('promoted_posts').toJS();
  var shouldSeeAds = state.app.getIn(['googleAds', 'enabled']);
  var adSlots = state.app.getIn(['googleAds', 'adSlots']).toJS();
  var blacklist = state.global.get('blacklist');
  return _objectSpread(_objectSpread({}, props), {}, {
    pathname: pathname,
    username: username,
    content: content,
    ignore_result: ignore_result,
    nsfwPref: nsfwPref,
    featured: featured,
    promoted: promoted,
    shouldSeeAds: shouldSeeAds,
    adSlots: adSlots,
    blacklist: blacklist
  });
}, function (dispatch) {
  return {
    fetchState: function fetchState(pathname) {
      dispatch(_FetchDataSaga.actions.fetchState({
        pathname: pathname
      }));
    },
    removeHighSecurityKeys: function removeHighSecurityKeys() {
      dispatch(userActions.removeHighSecurityKeys());
    }
  };
})(PostsList);
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _reactRouter = require("react-router");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _immutable = require("immutable");
var _FetchDataSaga = require("app/redux/FetchDataSaga");
var _constants = _interopRequireDefault(require("app/redux/constants"));
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
var _PostsList = _interopRequireDefault(require("app/components/cards/PostsList"));
var _StateFunctions = require("app/utils/StateFunctions");
var _Callout = _interopRequireDefault(require("app/components/elements/Callout"));
var _SidebarLinks = _interopRequireDefault(require("app/components/elements/SidebarLinks"));
var _SidebarNewUsers = _interopRequireDefault(require("app/components/elements/SidebarNewUsers"));
var _SidebarStats = _interopRequireDefault(require("app/components/elements/SidebarStats"));
var _Notices = _interopRequireDefault(require("app/components/elements/Notices"));
var _GptUtils = require("app/utils/GptUtils");
var _GptAd = _interopRequireDefault(require("app/components/elements/GptAd"));
var _ArticleLayoutSelector = _interopRequireDefault(require("app/components/modules/ArticleLayoutSelector"));
var _Topics = _interopRequireDefault(require("./Topics"));
var _SortOrder = _interopRequireDefault(require("app/components/elements/SortOrder"));
var _client_config = require("app/client_config");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /* eslint react/prop-types: 0 */
var PostsIndex = /*#__PURE__*/function (_React$Component) {
  function PostsIndex() {
    var _this;
    (0, _classCallCheck2["default"])(this, PostsIndex);
    _this = _callSuper(this, PostsIndex);
    (0, _defineProperty2["default"])(_this, "onShowSpam", function () {
      _this.setState({
        showSpam: !_this.state.showSpam
      });
    });
    _this.state = {};
    _this.loadMore = _this.loadMore.bind(_this);
    _this.shouldComponentUpdate = (0, _shouldComponentUpdate["default"])(_this, 'PostsIndex');
    return _this;
  }
  (0, _inherits2["default"])(PostsIndex, _React$Component);
  return (0, _createClass2["default"])(PostsIndex, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (window.innerHeight && window.innerHeight > 3000 && prevProps.discussions !== this.props.discussions) {
        this.refs.list.fetchIfNeeded();
      }
    }
  }, {
    key: "getPosts",
    value: function getPosts(order, category) {
      var topic_discussions = this.props.discussions.get(category || '');
      if (!topic_discussions) return null;
      return topic_discussions.get(order);
    }
  }, {
    key: "loadMore",
    value: function loadMore(last_post) {
      if (!last_post) return;
      var _this$props$routePara = this.props.routeParams,
        accountname = _this$props$routePara.accountname,
        category = _this$props$routePara.category,
        _this$props$routePara2 = _this$props$routePara.order,
        order = _this$props$routePara2 === void 0 ? _constants["default"].DEFAULT_SORT_ORDER : _this$props$routePara2;
      if (category === 'feed') {
        accountname = order.slice(1);
        order = 'by_feed';
      }
      if ((0, _StateFunctions.isFetchingOrRecentlyUpdated)(this.props.status, order, category)) return;
      var _last_post$split = last_post.split('/'),
        _last_post$split2 = (0, _slicedToArray2["default"])(_last_post$split, 2),
        author = _last_post$split2[0],
        permlink = _last_post$split2[1];
      this.props.requestData({
        author: author,
        permlink: permlink,
        order: order,
        category: category,
        accountname: accountname
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$routePara3 = this.props.routeParams,
        category = _this$props$routePara3.category,
        _this$props$routePara4 = _this$props$routePara3.order,
        order = _this$props$routePara4 === void 0 ? _constants["default"].DEFAULT_SORT_ORDER : _this$props$routePara4;
      var _this$props = this.props,
        categories = _this$props.categories,
        featured = _this$props.featured,
        promoted = _this$props.promoted,
        gptBannedTags = _this$props.gptBannedTags,
        topic = _this$props.topic;
      var allowAdsOnContent = true;
      allowAdsOnContent = this.props.gptEnabled && !_GptUtils.GptUtils.HasBannedTags([topic], gptBannedTags);
      var topics_order = order;
      var posts = [];
      var account_name = '';
      var emptyText = '';
      if (category === 'feed') {
        account_name = order.slice(1);
        order = 'by_feed';
        topics_order = 'hot';
        posts = this.props.feed_posts;
        var isMyAccount = this.props.username === account_name;
        if (isMyAccount) {
          emptyText = /*#__PURE__*/_react["default"].createElement("div", null, (0, _counterpart["default"])('posts_index.empty_feed_1'), ".", /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("br", null), (0, _counterpart["default"])('posts_index.empty_feed_2'), ".", /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/hot"
          }, (0, _counterpart["default"])('posts_index.empty_feed_3')), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/welcome"
          }, (0, _counterpart["default"])('posts_index.empty_feed_4')), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/faq.html"
          }, (0, _counterpart["default"])('posts_index.empty_feed_5')), /*#__PURE__*/_react["default"].createElement("br", null));
        } else {
          emptyText = /*#__PURE__*/_react["default"].createElement("div", null, (0, _counterpart["default"])('user_profile.user_hasnt_followed_anything_yet', {
            name: account_name
          }));
        }
      } else {
        posts = this.getPosts(order, category);
        if (posts && posts.size === 0) {
          emptyText = /*#__PURE__*/_react["default"].createElement("div", null, 'No ' + topics_order + (category ? ' #' + category : '') + ' posts found');
        }
      }
      var status = this.props.status ? this.props.status.getIn([category || '', order]) : null;
      var fetching = status && status.fetching || this.props.loading;
      var showSpam = this.state.showSpam;

      // If we're at one of the four sort order routes without a tag filter,
      // use the translated string for that sort order, f.ex "trending"
      //
      // If you click on a tag while you're in a sort order route,
      // the title should be the translated string for that sort order
      // plus the tag string, f.ex "trending: blog"
      //
      // Logged-in:
      // At homepage (@user/feed) say "My feed"
      var page_title = 'Posts'; // sensible default here?
      if (category === 'feed') {
        if (account_name === this.props.username) page_title = (0, _counterpart["default"])('posts_index.my_feed');else if (this.props.location.pathname === "/@".concat(_client_config.RECOMMENDED_FOLLOW_ACCOUNT, "/feed")) page_title = (0, _counterpart["default"])('g.recommended');else page_title = (0, _counterpart["default"])('posts_index.accountnames_feed', {
          account_name: account_name
        });
      } else {
        switch (topics_order) {
          case 'trending':
            // cribbed from Header.jsx where it's repeated 2x already :P
            page_title = (0, _counterpart["default"])('main_menu.trending');
            break;
          case 'created':
            page_title = (0, _counterpart["default"])('g.new');
            break;
          case 'hot':
            page_title = (0, _counterpart["default"])('main_menu.hot');
            break;
          case 'promoted':
            page_title = (0, _counterpart["default"])('g.promoted');
            break;
        }
        if (typeof category !== 'undefined') {
          page_title = "".concat(page_title, ": ").concat(category); // maybe todo: localize the colon?
        } else {
          page_title = "".concat(page_title, ": ").concat((0, _counterpart["default"])('g.all_tags'));
        }
      }
      var layoutClass = this.props.blogmode ? ' layout-block' : ' layout-list';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: 'PostsIndex row' + (fetching ? ' fetching' : '') + layoutClass
      }, /*#__PURE__*/_react["default"].createElement("article", {
        className: "articles"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__header row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-6 medium-6 large-6 column"
      }, /*#__PURE__*/_react["default"].createElement("h1", {
        className: "articles__h1 show-for-mq-large articles__h1--no-wrap"
      }, page_title), /*#__PURE__*/_react["default"].createElement("span", {
        className: "hide-for-mq-large articles__header-select"
      }, /*#__PURE__*/_react["default"].createElement(_Topics["default"], {
        username: this.props.username,
        order: topics_order,
        current: category,
        categories: categories,
        compact: true
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-6 medium-5 large-5 column hide-for-large articles__header-select"
      }, /*#__PURE__*/_react["default"].createElement(_SortOrder["default"], {
        sortOrder: this.props.sortOrder,
        topic: this.props.topic,
        horizontal: false
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "medium-1 show-for-mq-medium column"
      }, /*#__PURE__*/_react["default"].createElement(_ArticleLayoutSelector["default"], null))), /*#__PURE__*/_react["default"].createElement("hr", {
        className: "articles__hr"
      }), !fetching && posts && !posts.size && featured && !featured.size && promoted && !promoted.size ? /*#__PURE__*/_react["default"].createElement(_Callout["default"], null, emptyText) : /*#__PURE__*/_react["default"].createElement(_PostsList["default"], {
        ref: "list",
        posts: posts ? posts : (0, _immutable.List)(),
        loading: fetching,
        anyPosts: true,
        category: category,
        loadMore: this.loadMore,
        showFeatured: true,
        showPromoted: true,
        showSpam: showSpam,
        allowAdsOnContent: allowAdsOnContent
      })), /*#__PURE__*/_react["default"].createElement("aside", {
        className: "c-sidebar c-sidebar--right"
      }, this.props.isBrowser && !this.props.maybeLoggedIn && !this.props.username ? /*#__PURE__*/_react["default"].createElement(_SidebarNewUsers["default"], null) : this.props.isBrowser && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_SidebarLinks["default"], {
        username: this.props.username
      }), /*#__PURE__*/_react["default"].createElement(_SidebarStats["default"], {
        bandwidthKbytesFee: this.props.bandwidthKbytesFee,
        operationFlatFee: this.props.operationFlatFee
      })), /*#__PURE__*/_react["default"].createElement(_Notices["default"], {
        notices: this.props.notices
      }), this.props.gptEnabled && allowAdsOnContent ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "sidebar-ad"
      }, /*#__PURE__*/_react["default"].createElement(_GptAd["default"], {
        type: "Freestar",
        id: "bsa-zone_1566495004689-0_123456"
      })) : null), /*#__PURE__*/_react["default"].createElement("aside", {
        className: "c-sidebar c-sidebar--left"
      }, /*#__PURE__*/_react["default"].createElement(_Topics["default"], {
        order: topics_order,
        current: category,
        compact: false,
        username: this.props.username,
        categories: categories
      }), /*#__PURE__*/_react["default"].createElement("small", null, /*#__PURE__*/_react["default"].createElement("a", {
        className: "c-sidebar__more-link",
        onClick: this.onShowSpam
      }, showSpam ? (0, _counterpart["default"])('g.next_3_strings_together.show_less') : (0, _counterpart["default"])('g.next_3_strings_together.show_more')), ' ' + (0, _counterpart["default"])('g.next_3_strings_together.value_posts')), this.props.gptEnabled && allowAdsOnContent ? /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "sidebar-ad"
      }, /*#__PURE__*/_react["default"].createElement(_GptAd["default"], {
        type: "Freestar",
        slotName: "bsa-zone_1566494461953-7_123456"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "sidebar-ad",
        style: {
          marginTop: 20
        }
      }, /*#__PURE__*/_react["default"].createElement(_GptAd["default"], {
        type: "Freestar",
        slotName: "bsa-zone_1566494856923-9_123456"
      }))) : null));
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(PostsIndex, "propTypes", {
  discussions: _propTypes["default"].object,
  feed_posts: _propTypes["default"].object,
  status: _propTypes["default"].object,
  routeParams: _propTypes["default"].object,
  requestData: _propTypes["default"].func,
  loading: _propTypes["default"].bool,
  username: _propTypes["default"].string,
  blogmode: _propTypes["default"].bool,
  categories: _propTypes["default"].object
});
(0, _defineProperty2["default"])(PostsIndex, "defaultProps", {
  showSpam: false
});
module.exports = {
  path: ':order(/:category)',
  component: (0, _reactRedux.connect)(function (state, ownProps) {
    // special case if user feed (vs. trending, etc)
    var feed_posts;
    if (ownProps.routeParams.category === 'feed') {
      var account_name = ownProps.routeParams.order.slice(1);
      feed_posts = state.global.getIn(['accounts', account_name, 'feed']);
    }
    return {
      discussions: state.global.get('discussion_idx'),
      status: state.global.get('status'),
      loading: state.app.get('loading'),
      feed_posts: feed_posts,
      username: state.user.getIn(['current', 'username']) || state.offchain.get('account'),
      blogmode: state.app.getIn(['user_preferences', 'blogmode']) === undefined ? true : state.app.getIn(['user_preferences', 'blogmode']),
      sortOrder: ownProps.params.order,
      topic: ownProps.params.category,
      categories: state.global.getIn(['tag_idx', 'trending']).take(20),
      featured: state.offchain.get('special_posts').get('featured_posts'),
      promoted: state.offchain.get('special_posts').get('promoted_posts'),
      notices: state.offchain.get('special_posts').get('notices').toJS(),
      maybeLoggedIn: state.user.get('maybeLoggedIn'),
      isBrowser: process.env.BROWSER,
      gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
      gptBannedTags: state.app.getIn(['googleAds', 'gptBannedTags']),
      bandwidthKbytesFee: state.global.getIn(['props', 'bandwidth_kbytes_fee']),
      operationFlatFee: state.global.getIn(['props', 'operation_flat_fee'])
    };
  }, function (dispatch) {
    return {
      requestData: function requestData(args) {
        return dispatch(_FetchDataSaga.actions.requestData(args));
      }
    };
  })(PostsIndex)
};
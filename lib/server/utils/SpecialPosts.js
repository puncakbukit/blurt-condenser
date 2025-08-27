"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specialPosts = specialPosts;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var config = _interopRequireWildcard(require("config"));
var https = _interopRequireWildcard(require("https"));
var blurtjs = _interopRequireWildcard(require("@blurtfoundation/blurtjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t4 in e) "default" !== _t4 && {}.hasOwnProperty.call(e, _t4) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t4)) && (i.get || i.set) ? o(f, _t4, i) : f[_t4] = e[_t4]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Load special posts - including notices, featured, and promoted.
 *
 * @returns {promise} resolves to object of {featured_posts:[], promoted_posts:[], notices:[]}
 */
function loadSpecialPosts() {
  return new Promise(function (resolve, reject) {
    var emptySpecialPosts = {
      featured_posts: [],
      promoted_posts: [],
      notices: []
    };
    if (!config.special_posts_url) {
      resolve(emptySpecialPosts);
      return;
    }
    var request = https.get(config.special_posts_url, function (resp) {
      var data = '';
      resp.on('data', function (chunk) {
        data += chunk;
      });
      resp.on('end', function () {
        var json = JSON.parse(data);
        console.info('Received special posts payload', json);
        if (json === Object(json)) {
          resolve(json);
        }
      });
    });
    request.on('error', function (e) {
      console.error('Could not load special posts', e);
      resolve(emptySpecialPosts);
    });
  });
}
/**
 * [async] Get special posts - including notices, featured, and promoted.
 *
 * @returns {object} object of {featured_posts:[], promoted_posts:[], notices:[]}
 */
function specialPosts() {
  return _specialPosts.apply(this, arguments);
}
function _specialPosts() {
  _specialPosts = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var postData, loadedPostData, _iterator, _step, url, _url$split$1$split, _url$split$1$split2, username, postId, post, _iterator2, _step2, _url, _url$split$1$split3, _url$split$1$split4, _username, _postId, _post, _iterator3, _step3, notice, _notice$permalink$spl, _notice$permalink$spl2, _username2, _postId2, _post2, _t, _t2, _t3;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.info('Loading special posts');
          _context.next = 1;
          return loadSpecialPosts();
        case 1:
          postData = _context.sent;
          console.info('Loading special posts', postData);
          loadedPostData = {
            featured_posts: [],
            promoted_posts: [],
            notices: []
          };
          _iterator = _createForOfIteratorHelper(postData.featured_posts);
          _context.prev = 2;
          _iterator.s();
        case 3:
          if ((_step = _iterator.n()).done) {
            _context.next = 6;
            break;
          }
          url = _step.value;
          _url$split$1$split = url.split('@')[1].split('/'), _url$split$1$split2 = (0, _slicedToArray2["default"])(_url$split$1$split, 2), username = _url$split$1$split2[0], postId = _url$split$1$split2[1];
          _context.next = 4;
          return blurtjs.api.getContentAsync(username, postId);
        case 4:
          post = _context.sent;
          post.special = true;
          loadedPostData.featured_posts.push(post);
        case 5:
          _context.next = 3;
          break;
        case 6:
          _context.next = 8;
          break;
        case 7:
          _context.prev = 7;
          _t = _context["catch"](2);
          _iterator.e(_t);
        case 8:
          _context.prev = 8;
          _iterator.f();
          return _context.finish(8);
        case 9:
          _iterator2 = _createForOfIteratorHelper(postData.promoted_posts);
          _context.prev = 10;
          _iterator2.s();
        case 11:
          if ((_step2 = _iterator2.n()).done) {
            _context.next = 14;
            break;
          }
          _url = _step2.value;
          _url$split$1$split3 = _url.split('@')[1].split('/'), _url$split$1$split4 = (0, _slicedToArray2["default"])(_url$split$1$split3, 2), _username = _url$split$1$split4[0], _postId = _url$split$1$split4[1];
          _context.next = 12;
          return blurtjs.api.getContentAsync(_username, _postId);
        case 12:
          _post = _context.sent;
          _post.special = true;
          loadedPostData.promoted_posts.push(_post);
        case 13:
          _context.next = 11;
          break;
        case 14:
          _context.next = 16;
          break;
        case 15:
          _context.prev = 15;
          _t2 = _context["catch"](10);
          _iterator2.e(_t2);
        case 16:
          _context.prev = 16;
          _iterator2.f();
          return _context.finish(16);
        case 17:
          _iterator3 = _createForOfIteratorHelper(postData.notices);
          _context.prev = 18;
          _iterator3.s();
        case 19:
          if ((_step3 = _iterator3.n()).done) {
            _context.next = 23;
            break;
          }
          notice = _step3.value;
          if (!notice.permalink) {
            _context.next = 21;
            break;
          }
          _notice$permalink$spl = notice.permalink.split('@')[1].split('/'), _notice$permalink$spl2 = (0, _slicedToArray2["default"])(_notice$permalink$spl, 2), _username2 = _notice$permalink$spl2[0], _postId2 = _notice$permalink$spl2[1];
          _context.next = 20;
          return blurtjs.api.getContentAsync(_username2, _postId2);
        case 20:
          _post2 = _context.sent;
          loadedPostData.notices.push(Object.assign({}, notice, _post2));
          _context.next = 22;
          break;
        case 21:
          loadedPostData.notices.push(notice);
        case 22:
          _context.next = 19;
          break;
        case 23:
          _context.next = 25;
          break;
        case 24:
          _context.prev = 24;
          _t3 = _context["catch"](18);
          _iterator3.e(_t3);
        case 25:
          _context.prev = 25;
          _iterator3.f();
          return _context.finish(25);
        case 26:
          console.info("Loaded special posts: featured: ".concat(loadedPostData.featured_posts.length, ", promoted: ").concat(loadedPostData.promoted_posts.length, ", notices: ").concat(loadedPostData.notices.length));
          return _context.abrupt("return", loadedPostData);
        case 27:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 7, 8, 9], [10, 15, 16, 17], [18, 24, 25, 26]]);
  }));
  return _specialPosts.apply(this, arguments);
}
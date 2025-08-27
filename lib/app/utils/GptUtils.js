"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GptUtils = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _DomUtils = require("./DomUtils");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var GptUtils = exports.GptUtils = /*#__PURE__*/function () {
  function GptUtils() {
    (0, _classCallCheck2["default"])(this, GptUtils);
  }
  return (0, _createClass2["default"])(GptUtils, null, [{
    key: "ShowGptMobileSize",
    value:
    /**
     * Should we show the mobile version of an ad?
     *
     * @returns {boolean}
     */
    function ShowGptMobileSize() {
      return (0, _DomUtils.getViewportDimensions)().w <= 768;
    }

    /**
     * Naively append-mobile to a given string representing an ad slot name.
     *
     * @param {string} slotName
     * @returns {string}
     */
  }, {
    key: "MobilizeSlotName",
    value: function MobilizeSlotName(slotName) {
      var mobileSlotAddendum = '';
      if (this.ShowGptMobileSize()) mobileSlotAddendum = '-mobile';
      return "".concat(slotName).concat(mobileSlotAddendum);
    }

    /**
     * Takes an array of tags and determines whether one or more tags are banned from showing ads.
     *
     * @param {array[strings]} tags
     * @param {array[strings]} bannedTags
     * @returns {boolean}
     */
  }, {
    key: "HasBannedTags",
    value: function HasBannedTags() {
      var tags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var bannedTags = arguments.length > 1 ? arguments[1] : undefined;
      var _iterator = _createForOfIteratorHelper(tags),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var tag = _step.value;
          if (bannedTags.indexOf(tag) != -1) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return false;
    }
  }]);
}();
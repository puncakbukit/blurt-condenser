"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function getRemoteIp(req) {
  var remote_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var ip_match = remote_address ? remote_address.match(/(\d+\.\d+\.\d+\.\d+)/) : null;
  return ip_match ? ip_match[1] : remote_address;
}
var ip_last_hit = new Map();
function rateLimitReq(ctx, req) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var now = Date.now();

  // purge hits older than minutes_max
  ip_last_hit.forEach(function (v, k) {
    var seconds = (now - v) / 1000;
    if (seconds > 1) {
      ip_last_hit["delete"](ip);
    }
  });
  var result = false;
  // if ip is still in the map, abort
  if (ip_last_hit.has(ip)) {
    // console.log(`api rate limited for ${ip}: ${req}`);
    // throw new Error(`Rate limit reached: one call per ${minutes_max} minutes allowed.`);
    console.error('Rate limit reached: one call per 1 second allowed.');
    ctx.status = 429;
    ctx.body = 'Too Many Requests';
    result = true;
  }

  // record api hit
  ip_last_hit.set(ip, now);
  return result;
}
function checkCSRF(ctx, csrf) {
  try {
    ctx.assertCSRF(csrf);
  } catch (e) {
    ctx.status = 403;
    ctx.body = 'invalid csrf token';
    console.log('-- invalid csrf token -->', ctx.request.method, ctx.request.url, ctx.session.uid);
    return false;
  }
  return true;
}
function getSupportedLocales() {
  var locales = [];
  var files = _fs["default"].readdirSync(_path["default"].join(__dirname, '../../..', 'src/app/locales'));
  var _iterator = _createForOfIteratorHelper(files),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var filename = _step.value;
      var match_res = filename.match(/(\w+)\.json?$/);
      if (match_res) locales.push(match_res[1]);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return locales;
}
module.exports = {
  getRemoteIp: getRemoteIp,
  rateLimitReq: rateLimitReq,
  checkCSRF: checkCSRF,
  getSupportedLocales: getSupportedLocales
};
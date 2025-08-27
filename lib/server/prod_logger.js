"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var humanize = require('humanize-number');
var bytes = require('bytes');
module.exports = prod_logger;
function prod_logger() {
  return /*#__PURE__*/_regenerator["default"].mark(function logger(next) {
    var start, asset, length, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // request
          start = new Date();
          asset = this.originalUrl.indexOf('/assets/') === 0 || this.originalUrl.indexOf('/images/') === 0 || this.originalUrl.indexOf('/favicon.ico') === 0;
          if (!asset) {
            console.log("  <-- ".concat(this.method, " ").concat(this.originalUrl, " ").concat(this.session.uid || ''));
          }
          _context.prev = 1;
          _context.next = 2;
          return next;
        case 2:
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          log(this, start, null, _t, false);
          throw _t;
        case 4:
          length = this.response.length;
          log(this, start, length, null, asset);
        case 5:
        case "end":
          return _context.stop();
      }
    }, logger, this, [[1, 3]]);
  });
}
function log(ctx, start, len, err, asset) {
  var status = err ? err.status || 500 : ctx.status || 404;
  var length;
  if (~[204, 205, 304].indexOf(status)) {
    length = '';
  } else if (len == null) {
    length = '-';
  } else {
    length = bytes(len);
  }
  var upstream = err ? 'xxx' : '-->';
  if (!asset || err || ctx.status > 400) {
    console.log("  ".concat(upstream, " %s %s %s %s %s %s"), ctx.method, ctx.originalUrl, status, time(start), length, ctx.session.uid || '');
  }
}
function time(start) {
  var delta = new Date() - start;
  delta = delta < 10000 ? "".concat(delta, "ms") : "".concat(Math.round(delta / 1000), "s");
  return humanize(delta);
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.embedNode = embedNode;
exports.genIframeMd = genIframeMd;
exports.normalizeEmbedUrl = normalizeEmbedUrl;
exports.sandboxConfig = void 0;
exports.validateIframeUrl = validateIframeUrl;
var _react = _interopRequireDefault(require("react"));
var regex = {
  sanitize: /^(https?:)?\/\/player.twitch.tv\/.*/i,
  main: /https?:\/\/(?:www.)?twitch.tv\/(?:(videos)\/)?([a-zA-Z0-9][\w]{3,24})/i
};
var _default = exports["default"] = regex;
var sandboxConfig = exports.sandboxConfig = {
  useSandbox: false,
  sandboxAttributes: []
};

// <iframe src="https://player.twitch.tv/?channel=tfue" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
function validateIframeUrl(url) {
  var match = url.match(regex.sanitize);
  if (match) {
    return url;
  }
  return false;
}
function normalizeEmbedUrl(url) {
  var match = url.match(regex.main);
  if (match && match.length >= 3) {
    if (match[1] === undefined) {
      return "https://player.twitch.tv/?autoplay=false&channel=".concat(match[2]);
    }
    return "https://player.twitch.tv/?autoplay=false&video=".concat(match[1]);
  }
  return false;
}
function extractMetadata(data) {
  if (!data) return null;
  var m = data.match(regex.main);
  if (!m || m.length < 3) return null;
  return {
    id: m[1] === 'videos' ? "?video=".concat(m[2]) : "?channel=".concat(m[2]),
    url: m[0],
    canonical: m[1] === 'videos' ? "https://player.twitch.tv/?video=".concat(m[2]) : "https://player.twitch.tv/?channel=".concat(m[2])
  };
}
function embedNode(child, links /* images */) {
  try {
    var data = child.data;
    var twitch = extractMetadata(data);
    if (!twitch) return child;
    child.data = data.replace(twitch.url, "~~~ embed:".concat(twitch.id, " twitch ~~~"));
    if (links) links.add(twitch.canonical);
  } catch (error) {
    console.error(error);
  }
  return child;
}
function genIframeMd(idx, id, w, h) {
  var url = "https://player.twitch.tv/".concat(id);
  return /*#__PURE__*/_react["default"].createElement("div", {
    key: "twitch-".concat(id, "-").concat(idx),
    className: "videoWrapper"
  }, /*#__PURE__*/_react["default"].createElement("iframe", {
    title: "Twitch embedded player",
    src: url,
    width: w,
    height: h,
    frameBorder: "0",
    allowFullScreen: true,
    sandbox: sandboxConfig.useSandbox ? sandboxConfig.sandboxAttributes ? sandboxConfig.sandboxAttributes.join(' ') : true : ''
  }));
}
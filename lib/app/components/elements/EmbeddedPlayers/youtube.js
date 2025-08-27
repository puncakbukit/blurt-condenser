"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.embedNode = embedNode;
exports.extractMetadata = extractMetadata;
exports.genIframeMd = genIframeMd;
exports.normalizeEmbedUrl = normalizeEmbedUrl;
exports.sandboxConfig = void 0;
exports.validateIframeUrl = validateIframeUrl;
var _react = _interopRequireDefault(require("react"));
var _YoutubePreview = _interopRequireDefault(require("app/components/elements/YoutubePreview"));
var regex = {
  sanitize: /^(https?:)?\/\/www.youtube.com\/embed\/.*/i,
  main: /(?:https?:\/\/)(?:www\.)?(?:(?:youtube\.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube\.com\/embed\/))([A-Za-z0-9_\-]+)[^ ]*/i,
  contentId: /(?:(?:youtube\.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube\.com\/embed\/))([A-Za-z0-9_\-]+)/i
};
var _default = exports["default"] = regex;
var sandboxConfig = exports.sandboxConfig = {
  useSandbox: false,
  sandboxAttributes: []
};

// <iframe width="560" height="315" src="https://www.youtube.com/embed/KOnk7Nbqkhs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
function validateIframeUrl(url) {
  var match = url.match(regex.sanitize);
  if (match) {
    // strip query string (yt: autoplay=1,controls=0,showinfo=0, etc)
    return url.replace(/\?.+$/, '');
  }
  return false;
}
function normalizeEmbedUrl(url) {
  var match = url.match(regex.contentId);
  if (match && match.length >= 2) {
    return "https://youtube.com/embed/".concat(match[1]);
  }
  return false;
}
function extractMetadata(data) {
  if (!data) return null;
  var m1 = data.match(regex.main);
  var url = m1 ? m1[0] : null;
  if (!url) return null;
  var m2 = url.match(regex.contentId);
  var id = m2 && m2.length >= 2 ? m2[1] : null;
  if (!id) return null;
  var startTime = url.match(/t=(\d+)s?/);
  return {
    id: id,
    url: url,
    canonical: url,
    startTime: startTime ? startTime[1] : 0,
    thumbnail: 'https://img.youtube.com/vi/' + id + '/0.jpg'
  };
}
function embedNode(child, links, images) {
  try {
    var yt = extractMetadata(child.data);
    if (!yt) return child;
    if (yt.startTime) {
      child.data = child.data.replace(yt.url, "~~~ embed:".concat(yt.id, " youtube ").concat(yt.startTime, " ~~~"));
    } else {
      child.data = child.data.replace(yt.url, "~~~ embed:".concat(yt.id, " youtube ~~~"));
    }
    if (links) links.add(yt.url);
    if (images) images.add(yt.thumbnail);
  } catch (error) {
    console.log(error);
  }
  return child;
}
function genIframeMd(idx, id, w, h, startTime) {
  return /*#__PURE__*/_react["default"].createElement(_YoutubePreview["default"], {
    key: "youtube-".concat(id, "-").concat(idx),
    width: w,
    height: h,
    youTubeId: id,
    startTime: startTime,
    frameBorder: "0",
    allowFullScreen: "true"
  });
}
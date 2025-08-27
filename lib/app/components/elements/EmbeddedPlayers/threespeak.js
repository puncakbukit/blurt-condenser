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
exports.preprocessHtml = preprocessHtml;
exports.sandboxConfig = void 0;
exports.validateIframeUrl = validateIframeUrl;
var _react = _interopRequireDefault(require("react"));
var regex = {
  sanitize: /^https:\/\/3speak\.online\/embed\?v=([A-Za-z0-9_\-\/]+)(&.*)?$/,
  main: /(?:https?:\/\/(?:(?:3speak\.online\/watch\?v=)|(?:3speak\.online\/embed\?v=)))([A-Za-z0-9_\-\/]+)(&.*)?/i,
  htmlReplacement: /<a href="(https?:\/\/3speak\.online\/watch\?v=([A-Za-z0-9_\-\/]+))".*<img.*?><\/a>/i,
  embedShorthand: /~~~ embed:(.*?)\/(.*?) threespeak ~~~/
};
var _default = exports["default"] = regex;
var sandboxConfig = exports.sandboxConfig = {
  useSandbox: true,
  sandboxAttributes: ['allow-scripts', 'allow-same-origin', 'allow-popups']
};
function genIframeMd(idx, threespeakId, w, h) {
  var url = "https://3speak.online/embed?v=".concat(threespeakId);
  return /*#__PURE__*/_react["default"].createElement("div", {
    key: "threespeak-".concat(threespeakId, "-").concat(idx),
    className: "videoWrapper"
  }, /*#__PURE__*/_react["default"].createElement("iframe", {
    title: "3Speak embedded player",
    key: idx,
    src: url,
    width: w,
    height: h,
    frameBorder: "0",
    allowFullScreen: true,
    sandbox: sandboxConfig.useSandbox ? sandboxConfig.sandboxAttributes ? sandboxConfig.sandboxAttributes.join(' ') : true : ''
  }));
}
function validateIframeUrl(url) {
  var match = url.match(regex.sanitize);
  if (match) {
    return url;
  }
  return false;
}
function normalizeEmbedUrl(url) {
  var match = url.match(regex.contentId);
  if (match && match.length >= 2) {
    return "https://3speak.online/embed?v=".concat(match[1]);
  }
  return false;
}
function extractMetadata(data) {
  if (!data) return null;
  var match = data.match(regex.main);
  var url = match ? match[0] : null;
  if (!url) return null;
  var fullId = match[1];
  var id = fullId.split('/').pop();
  return {
    id: id,
    fullId: fullId,
    url: url,
    thumbnail: "https://img.3speakcontent.online/".concat(id, "/post.png")
  };
}
function embedNode(child, links, images) {
  try {
    var data = child.data;
    var threespeak = extractMetadata(data);
    if (threespeak) {
      child.data = data.replace(threespeak.url, "~~~ embed:".concat(threespeak.id, " threespeak ~~~"));
      if (links) {
        links.add(threespeak.canonical);
      }
      if (images) {
        images.add(threespeak.thumbnail);
      }
    } else {
      // Because we are processing 3speak embed player with the preprocessHtml() method below
      // extractMetadata won't be able to extract the thumbnail from the shorthand.
      // So we are handling thumbnail URL extraction differently.
      var match = data.match(regex.embedShorthand);
      if (match && images) {
        var imageUrl = "https://img.3speakcontent.online/".concat(match[2], "/post.png");
        images.add(imageUrl);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return child;
}
function preprocessHtml(child) {
  try {
    if (typeof child === 'string') {
      // If typeof child is a string, this means we are trying to process the HTML
      // to replace the image/anchor tag created by 3Speak dApp
      var threespeak = extractMetadata(child);
      if (threespeak) {
        child = child.replace(regex.htmlReplacement, "~~~ embed:".concat(threespeak.fullId, " threespeak ~~~"));
      }
    }
  } catch (error) {
    console.log(error);
  }
  return child;
}
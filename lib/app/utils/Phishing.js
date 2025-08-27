"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.looksPhishy = void 0;
var domains = [];

/**
 * Does this URL look like a phishing attempt?
 *
 * @param {string} questionableUrl
 * @returns {boolean}
 */
var looksPhishy = exports.looksPhishy = function looksPhishy(questionableUrl) {
  for (var _i = 0, _domains = domains; _i < _domains.length; _i++) {
    var domain = _domains[_i];
    if (questionableUrl.toLocaleLowerCase().indexOf(domain) > -1) {
      return true;
    }
  }
  return false;
};
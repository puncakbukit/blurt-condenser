"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var _ResolveRoute = _interopRequireWildcard(require("./ResolveRoute"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
jest.mock('./utils/GDPRUserList');
describe('routeRegex', function () {
  it('should produce the desired regex patterns', function () {
    var test_cases = [['PostsIndex', /^\/(@[\w\.\d-]+)\/feed\/?$/], ['UserProfile1', /^\/(@[\w\.\d-]+)\/?$/], ['UserProfile2', /^\/(@[\w\.\d-]+)\/(blog|posts|comments|transfers|curation-rewards|author-rewards|permissions|created|recent-replies|notifications|feed|password|followed|followers|settings)\/?$/], ['UserProfile3', /^\/(@[\w\.\d-]+)\/[\w\.\d-]+/], ['CategoryFilters', /^\/(hot|trending|promoted|payout|payout_comments|created)\/?$/gi], ['PostNoCategory', /^\/(@[\w\.\d-]+)\/([\w\d-]+)/], ['Post', /^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?($|\?)/], ['PostJson', /^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)(\.json)$/], ['UserJson', /^\/(@[\w\.\d-]+)(\.json)$/], ['UserNameJson', /^.*(?=(\.json))/]];
    test_cases.forEach(function (r) {
      expect(_ResolveRoute.routeRegex[r[0]]).toEqual(r[1]);
    });
  });
});
describe('resolveRoute', function () {
  var test_cases = [['/', {
    page: 'PostsIndex',
    params: ['hot']
  }], ['/about.html', {
    page: 'About'
  }], ['/faq.html', {
    page: 'Faq'
  }], ['/login.html', {
    page: 'Login'
  }], ['/privacy.html', {
    page: 'Privacy'
  }], ['/support.html', {
    page: 'Support'
  }], ['/tos.html', {
    page: 'Tos'
  }], ['/submit.html', {
    page: 'SubmitPost'
  }], ['/@maitland/feed', {
    page: 'PostsIndex',
    params: ['home', '@maitland']
  }], ['/@gdpr/feed', {
    page: 'NotFound'
  }], ['/@maitland/blog', {
    page: 'UserProfile',
    params: ['@maitland', 'blog']
  }], ['/@gdpr/blog', {
    page: 'NotFound'
  }], ['/@cool/nice345', {
    page: 'PostNoCategory',
    params: ['@cool', 'nice345']
  }], ['/@gdpr/nice345', {
    page: 'NotFound'
  }], ['/ceasar/@salad/circa90', {
    page: 'Post',
    params: ['ceasar', '@salad', 'circa90', '']
  }], ['/taggy/@gdpr/nice345', {
    page: 'NotFound'
  }]];
  test_cases.forEach(function (r) {
    it("should resolve the route for the ".concat(r[1].page, " page"), function () {
      expect((0, _ResolveRoute["default"])(r[0])).toEqual(r[1]);
    });
  });
  it('should resolve xss test route in development environment', function () {
    expect((0, _ResolveRoute["default"])('/xss/test')).toEqual({
      page: 'NotFound'
    });
    process.env.NODE_ENV = 'development';
    expect((0, _ResolveRoute["default"])('/xss/test')).toEqual({
      page: 'XSSTest'
    });
    delete process.env.NODE_ENV;
  });
  it('should resolve benchmark route in development environment', function () {
    expect((0, _ResolveRoute["default"])('/benchmark')).toEqual({
      page: 'NotFound'
    });
    process.env.OFFLINE_SSR_TEST = true;
    expect((0, _ResolveRoute["default"])('/benchmark')).toEqual({
      page: 'Benchmark'
    });
    delete process.env.OFFLINE_SSR_TEST;
  });
  it('should resolve an unknown route to NotFound', function () {
    expect((0, _ResolveRoute["default"])('/randomness')).toEqual({
      page: 'NotFound'
    });
  });
});
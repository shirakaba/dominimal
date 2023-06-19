/* eslint-disable no-unused-vars */
// URL and URLSearchParams are available globally, so just no-op on install.

exports.URL = {
  install() {},
};
exports.URLSearchParams = {
  install() {},
};
exports.parseURL = (input, options = {}) => {
  try {
    return new URL(input, options?.baseURL);
  } catch (error) {
    return null;
  }
};
exports.basicURLParse = exports.parseURL;
exports.serializeURL = (url, excludeFragment) => url.href;
exports.serializeURLOrigin = (url) => url.origin;

// Yes, I know this isn't 1:1 with whatwg-url, but hopefully it's enough.

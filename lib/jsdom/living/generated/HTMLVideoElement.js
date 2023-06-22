const utils = require('jsdom/lib/jsdom/living/generated/utils.js');
const HTMLConstructor_helpers_html_constructor =
  require('jsdom/lib/jsdom/living/helpers/html-constructor.js').HTMLConstructor;

const interfaceName = 'HTMLVideoElement';
const exposed = new Set(['Window']);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some((globalName) => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class HTMLVideoElement extends globalObject.HTMLMediaElement {
    constructor() {
      return HTMLConstructor_helpers_html_constructor(
        globalObject,
        interfaceName,
        new.target
      );
    }
  }
  ctorRegistry[interfaceName] = HTMLVideoElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLVideoElement,
  });
};

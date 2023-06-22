const utils = require('jsdom/lib/jsdom/living/generated/utils.js');

const interfaceName = 'HTMLImageElement';
const exposed = new Set(['Window']);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some((globalName) => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class HTMLImageElement extends globalObject.HTMLElement {
    constructor() {
      throw new globalObject.TypeError('Illegal constructor');
    }
  }
  ctorRegistry[interfaceName] = HTMLImageElement;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: HTMLImageElement,
  });
};

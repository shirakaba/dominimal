const utils = require('jsdom/lib/jsdom/living/generated/utils.js');
const implSymbol = utils.implSymbol;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = 'EventTarget';
const exposed = new Set(['Window', 'Worker', 'AudioWorklet']);

exports.is = (value) => {
  return (
    utils.isObject(value) &&
    utils.hasOwn(value, implSymbol) &&
    value[implSymbol] instanceof Impl.implementation
  );
};
exports.isImpl = (value) => {
  return utils.isObject(value) && value instanceof Impl.implementation;
};
exports.convert = (
  globalObject,
  value,
  { context = 'The provided value' } = {}
) => {
  if (exports.is(value)) {
    return utils.implForWrapper(value);
  }
  throw new globalObject.TypeError(`${context} is not of type 'EventTarget'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]['EventTarget'].prototype;
  }

  return Object.create(proto);
}

exports.create = (globalObject, constructorArgs, privateData) => {
  const wrapper = makeWrapper(globalObject);
  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
};

exports.createImpl = (globalObject, constructorArgs, privateData) => {
  const wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(wrapper);
};

exports._internalSetup = (wrapper, globalObject) => {};

exports.setup = (
  wrapper,
  globalObject,
  constructorArgs = [],
  privateData = {}
) => {
  privateData.wrapper = wrapper;

  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: new Impl.implementation(globalObject, constructorArgs, privateData),
    configurable: true,
  });

  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper;
};

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some((globalName) => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  ctorRegistry[interfaceName] = Impl;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: EventTarget,
  });
};

const Impl = require('../events/EventTarget-impl.js');
console.log('EventTarget.impl', Impl);
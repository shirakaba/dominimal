module.exports = {
  implementation: class EventTargetImpl extends globalThis.EventTarget {
    constructor(globalObject, args, privateData) {
      super();
      this._globalObject = globalObject;
    }
  },
};

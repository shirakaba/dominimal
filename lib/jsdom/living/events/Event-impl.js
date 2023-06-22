const idlUtils = require('jsdom/lib/jsdom/living/generated/utils');

// This is a chimæra of JSDOM's Event and the native Node.js one.
class EventImpl extends globalThis.Event {
  // eslint-disable-next-line no-unused-vars
  constructor(globalObject, args, privateData) {
    super(args.type, args.eventInitDict);

    this._globalObject = globalObject;

    this._target = null;
    this._currentTarget = null;
    this._eventPhase = 0;

    this._initializedFlag = true;
    this._stopImmediatePropagationFlag = false;
    this._stopPropagationFlag = false;
    this._canceledFlag = false;
    this._inPassiveListenerFlag = false;
    this._dispatchFlag = false;
    this._path = [];
    this._returnValue = false;

    this._isTrusted = privateData.isTrusted || false;
  }

  get currentTarget() {
    return this._currentTarget;
  }

  set currentTarget(v) {
    this._currentTarget = v;
  }

  get target() {
    return this._target;
  }

  set target(v) {
    this._target = v;
  }

  get eventPhase() {
    return this._eventPhase;
  }

  set eventPhase(v) {
    this._eventPhase = v;
  }

  get isTrusted() {
    return this._isTrusted;
  }

  // https://dom.spec.whatwg.org/#set-the-canceled-flag
  _setTheCanceledFlag() {
    if (this.cancelable && !this._inPassiveListenerFlag) {
      this._canceledFlag = true;
    }
  }

  get returnValue() {
    return !this._canceledFlag;
  }

  set returnValue(v) {
    if (v === false) {
      this._setTheCanceledFlag();
    }
  }

  get defaultPrevented() {
    return this._canceledFlag;
  }

  stopPropagation() {
    this._stopPropagationFlag = true;
  }

  get cancelBubble() {
    return this._stopPropagationFlag;
  }

  set cancelBubble(v) {
    if (v) {
      this._stopPropagationFlag = true;
    }
  }

  stopImmediatePropagation() {
    this._stopPropagationFlag = true;
    this._stopImmediatePropagationFlag = true;
    super.stopImmediatePropagation();
  }

  preventDefault() {
    this._setTheCanceledFlag();
    super.preventDefault();
  }

  // https://dom.spec.whatwg.org/#dom-event-composedpath
  // Current implementation is based of https://whatpr.org/dom/699.html#dom-event-composedpath
  // due to a bug in composed path implementation https://github.com/whatwg/dom/issues/684
  composedPath() {
    const composedPath = [];

    const { currentTarget, _path: path } = this;

    if (path.length === 0) {
      return composedPath;
    }

    composedPath.push(currentTarget);

    let currentTargetIndex = 0;
    let currentTargetHiddenSubtreeLevel = 0;

    for (let index = path.length - 1; index >= 0; index--) {
      const { item, rootOfClosedTree, slotInClosedTree } = path[index];

      if (rootOfClosedTree) {
        currentTargetHiddenSubtreeLevel++;
      }

      if (item === idlUtils.implForWrapper(currentTarget)) {
        currentTargetIndex = index;
        break;
      }

      if (slotInClosedTree) {
        currentTargetHiddenSubtreeLevel--;
      }
    }

    let currentHiddenLevel = currentTargetHiddenSubtreeLevel;
    let maxHiddenLevel = currentTargetHiddenSubtreeLevel;

    for (let i = currentTargetIndex - 1; i >= 0; i--) {
      const { item, rootOfClosedTree, slotInClosedTree } = path[i];

      if (rootOfClosedTree) {
        currentHiddenLevel++;
      }

      if (currentHiddenLevel <= maxHiddenLevel) {
        composedPath.unshift(idlUtils.wrapperForImpl(item));
      }

      if (slotInClosedTree) {
        currentHiddenLevel--;
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel;
        }
      }
    }

    currentHiddenLevel = currentTargetHiddenSubtreeLevel;
    maxHiddenLevel = currentTargetHiddenSubtreeLevel;

    for (let index = currentTargetIndex + 1; index < path.length; index++) {
      const { item, rootOfClosedTree, slotInClosedTree } = path[index];

      if (slotInClosedTree) {
        currentHiddenLevel++;
      }

      if (currentHiddenLevel <= maxHiddenLevel) {
        composedPath.push(idlUtils.wrapperForImpl(item));
      }

      if (rootOfClosedTree) {
        currentHiddenLevel--;
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel;
        }
      }
    }

    return composedPath;
  }

  _initialize(type, bubbles, cancelable) {
    this.type = type;
    this._initializedFlag = true;

    this._stopPropagationFlag = false;
    this._stopImmediatePropagationFlag = false;
    this._canceledFlag = false;

    this.isTrusted = false;
    this.target = null;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
  }

  initEvent(type, bubbles, cancelable) {
    if (this._dispatchFlag) {
      return;
    }

    this._initialize(type, bubbles, cancelable);
    super.initEvent(type, bubbles, cancelable);
  }
}

module.exports = {
  implementation: EventImpl,
};

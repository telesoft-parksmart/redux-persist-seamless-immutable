'use strict';

var _require = require('./helpers'),
    isImmutable = _require.isImmutable;

var _require2 = require('redux-persist'),
    createTransform = _require2.createTransform;

var Immutable = require('seamless-immutable');

var convertToPojo = function convertToPojo(state) {
  return state.asMutable({ deep: true });
};
// optionally convert this object into a JS object if it is Immutable
var fromImmutable = function fromImmutable(a) {
  return isImmutable(a) ? convertToPojo(a) : a;
};
// convert this JS object into an Immutable object
var toImmutable = function toImmutable(raw) {
  return Immutable(raw);
};

var seamlessImmutableTransformCreator = function seamlessImmutableTransformCreator(_ref) {
  var _ref$whitelistPerRedu = _ref.whitelistPerReducer,
      whitelistPerReducer = _ref$whitelistPerRedu === undefined ? {} : _ref$whitelistPerRedu,
      _ref$blacklistPerRedu = _ref.blacklistPerReducer,
      blacklistPerReducer = _ref$blacklistPerRedu === undefined ? {} : _ref$blacklistPerRedu;

  return createTransform(
  // transform state coming from redux on its way to being serialized and stored
  function (state, key) {
    if (!state) {
      return
    }
    var reducedStateKeys = Object.keys(state);
    if (whitelistPerReducer[key]) {
      reducedStateKeys.forEach(function (item) {
        if (!whitelistPerReducer[key].includes(item)) {
          state = state.without(item);
        }
      });
    }
    if (blacklistPerReducer[key]) {
      reducedStateKeys.forEach(function (item) {
        if (blacklistPerReducer[key].includes(item)) {
          state = state.without(item);
        }
      });
    }
    return fromImmutable(state);
  },
  // transform state coming from storage, on its way to be rehydrated into redux
  function (state) {
    return toImmutable(state);
  });
};

module.exports = {
  seamlessImmutableTransformCreator: seamlessImmutableTransformCreator
};
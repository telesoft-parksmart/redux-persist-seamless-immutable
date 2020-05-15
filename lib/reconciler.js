'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('./helpers'),
    isImmutable = _require.isImmutable,
    toImmutable = _require.toImmutable;

var seamlessImmutableReconciler = function seamlessImmutableReconciler(inboundState, originalState, reducedState, _ref) {
  var debug = _ref.debug,
      _ref$mergeDeep = _ref.mergeDeep,
      mergeDeep = _ref$mergeDeep === undefined ? false : _ref$mergeDeep;

  var newState = Object.assign({}, reducedState);
  // only rehydrate if inboundState exists and is an object
  if (inboundState && (typeof inboundState === 'undefined' ? 'undefined' : _typeof(inboundState)) === 'object') {
    Object.keys(inboundState).forEach(function (key) {
      // ignore _persist data
      if (key === '_persist') return;
      // if reducer modifies substate, skip auto rehydration
      if (originalState[key] !== reducedState[key]) {
        if (process.env.NODE_ENV !== 'production' && debug) {
          // eslint-disable-next-line no-console
          console.log('redux-persist/stateReconciler: sub state for key `%s` modified, skipping.', key);
        }

        return;
      }
      if (isPlainEnoughObject(reducedState[key])) {
        // if object is plain enough shallow merge the new values (hence "Level2")
        newState[key] = Object.assign({}, newState[key], inboundState[key]);
        return;
      } else if (isImmutable(reducedState[key])) {
        // if this is a seamless-immutable state slice and object use its own merge function
        if (isObject(newState[key])) {
          newState[key] = newState[key].merge(inboundState[key], {
            deep: mergeDeep
          });
        } else {
          // otherwise use seamless-immutable
          newState[key] = toImmutable(inboundState[key]);
        }
        return;
      }
      // otherwise hard set
      newState[key] = inboundState[key];
    });
  }

  if (process.env.NODE_ENV !== 'production' && debug && inboundState && (typeof inboundState === 'undefined' ? 'undefined' : _typeof(inboundState)) === 'object') {
    console.log('redux-persist/stateReconciler: rehydrated keys \'' + Object.keys(inboundState).join(', ') + '\'');
  }

  return newState;
};

function isObject(o) {
  return o !== null && !Array.isArray(o) && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
}

function isPlainEnoughObject(o) {
  return o !== null && !Array.isArray(o) && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && !isImmutable(o);
}

module.exports = {
  seamlessImmutableReconciler: seamlessImmutableReconciler
};
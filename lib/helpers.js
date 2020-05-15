'use strict';

var Immutable = require('seamless-immutable');
var isImmutable = function isImmutable(a) {
    return Immutable.isImmutable(a);
};
var toImmutable = function toImmutable(a) {
    return Immutable(a);
};

module.exports = {
    isImmutable: isImmutable,
    toImmutable: toImmutable
};
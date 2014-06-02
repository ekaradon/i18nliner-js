"use strict";
var Errors = require("../errors")["default"] || require("../errors");

function TranslationHash() {
  this.translations = {};
}

TranslationHash.prototype.set = function(key, value) {
  var parts = key.split('.');
  var context = this.getScope(parts.slice(0, -1));
  var finalKey = parts[parts.length - 1];

  if (context[finalKey]) {
    if (typeof context[finalKey] === 'object') {
      throw new Errors.KeyAsScope(this.line, key);
    } else if (context[finalKey] !== value) {
      throw new Errors.KeyInUse(this.line, key);
    }
  }
  context[finalKey] = value;
};

TranslationHash.prototype.getScope = function(parts) {
  var context = this.translations;
  var partsLen = parts.length;
  var key;
  var i;

  for (i = 0; i < partsLen; i++) {
    key = parts[i];
    if (typeof context[key] === 'string') {
      throw new Errors.KeyAsScope(this.line, parts.slice(0, i + 1).join("."));
    }
    context = context[key] || (context[key] = {});
  }
  return context;
};

exports["default"] = TranslationHash;
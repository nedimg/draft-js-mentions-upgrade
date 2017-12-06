/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Get the first 5 suggestions that match
var size = function size(list) {
  return list.constructor.name === 'List' ? list.size : list.length;
};

var get = function get(obj, attr) {
  return obj.get ? obj.get(attr) : obj[attr];
};

var suggestionsFilter = function suggestionsFilter(searchValue, suggestions) {
  var value = searchValue.toLowerCase();
  var filteredSuggestions = suggestions.filter(function (suggestion) {
    return !value || get(suggestion, 'name').toLowerCase().indexOf(value) > -1;
  });
  return filteredSuggestions;
  // var length = size(filteredSuggestions) < 5 ? size(filteredSuggestions) : 5;
  // return filteredSuggestions.slice(0, length);
};

exports.default = suggestionsFilter;
/* eslint-enable */

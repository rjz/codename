var _ = require('underscore');

module.exports = Words;

function Words (words) {
  this.words = words;
  this.length = words.length;
}

Words.prototype.filterRand = function (filter) {
  return this.filter(filter).rand();
};

Words.prototype.rand = function () {
  var index;
  index = Math.floor(Math.random(0, 1) * this.length);
  return this.words[index];
};

['filter', 'invoke'].forEach(function (func) {
  Words.prototype[func] = function () {
    var args = [].slice.call(arguments, 0);
    return new Words(_[func].apply(this.words, [this.words].concat(args)));
  }
});


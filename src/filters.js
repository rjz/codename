var _ = require('lodash');

var exports = module.exports = {

  // A filter for ensuring that the first `letter` of the word
  first: function (letter, memo, words) {
    if (_.isString(letter) && letter.length == 1) {
      return exports.alliterative([letter.toUpperCase()], words);
    }

    throw new Error('`first` must be called with a single letter');
  },

  // A filter for ensuring that all `words` share their first letter
  alliterative: function (memo, words) {
    if (!memo.length) return words;
    return words.filter(function (b) {
      return b[0] == memo[0][0];
    });
  },

  // A filter for returning a random item from `words`
  random: function (memo, words) {
    return _.sample(words);
  }
};


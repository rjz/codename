var _ = require('lodash');

var exports = module.exports = {

  // A filter for ensuring that all `words` share their first letter
  alliterative: function (memo, words) {
    if (!memo.length) return words;
    return words.filter(function (b) {
      return b[0] == memo[0][0];
    });
  },

  // An output filter for returning a random item from `words`
  random: function (memo, words) {
    return _.sample(words);
  }
};


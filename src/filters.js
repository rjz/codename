var _ = require('lodash');

var exports = module.exports = {

  // A filter for ensuring that all `words` share their first letter
  alliterative: function (memo, words) {
    if (!memo.length) return words;
    return words.filter(function (b) {
      return b[0] == memo[0][0];
    });
  },

  // A filter to exclude `words` that already appear in `memo`
  unique: function (memo, words) {
    if (!memo.length) return words;
    return _.difference(words, _.flatten(memo));
  },

  // An output filter for returning a random item from `words`
  random: function (memo, words) {
    return _.sample(words);
  }
};


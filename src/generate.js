var _ = require('lodash');

// Comparator for sorting `[[key, val]]` pairs by the shortest `val`
function pairsByShortest (a, b) {
  return a[1].length > b[1].length;
}

// Returns `[[keys], [lists]]` sorted in order of grouping constraints;
function byPlausibility (lists) {
  var pairs = _.pairs(lists).sort(pairsByShortest);

  return pairs.reduce(function (memo, pair) {
    memo[0].push(pair[0]);
    memo[1].push(pair[1]);
    return memo;
  }, [[], []]);
}

/**
 *  Generate a name by applying `filters` to each of `lists`
 *
 *  params:
 *
 *   - `lists` (`Array[String]`) - an array of word lists
 *   - `filters` (`Array[Function]`) - an array of filter functions to be
 *     applied to each list
 *
 *  return:
 *
 *    `Array[String]` containing the generated name or `null` if filters
 *    eliminated all possible matches
 */
module.exports = function generate (lists, filters) {

  var getWordById, results, words,
      kvs = byPlausibility(lists);

  words = _.compact(kvs[1].reduce(function (memo, list) {
    return memo.concat(filters.reduce(function (m, f) {
      return f(memo, m);
    }, list));
  }, []));

  if (words.length < lists.length - 1) {
    return null;
  }

  results = _.object(kvs[0], words);
  getWordById = _.partial(_.result, results);

  return _.keys(results).sort().map(getWordById);
};


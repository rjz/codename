var _ = require('underscore');

module.exports = Lists;

var pairsByShortest = function (a, b) {
  return a[1].length > b[1].length;
};

var toPair = function (key) {
  var list = this.get(key);
  return [key, list];
};

// Returns `[[keys], [lists]]` ordered by the shortest list first. This
// prefers selection from (hopefully) the most constrained grouping.
var byPlausibility = function (lists, args) {
  var pairs = _.map(args, toPair, lists).sort(pairsByShortest);
  return _.zip.apply(_, pairs);
};

function Lists (lists) {
  this.lists = lists;
}

Lists.prototype.get = function (key) {
  return this.lists[key];
};

Lists.prototype.generate = function (filters) {

  var args = [].slice.call(arguments, 1),
      kvs = byPlausibility(this, args);

  //var composedFilter = _.compose.apply(_, filters.reverse());

  var first = kvs[1].shift().rand(),
      rest = _.compact(_.invoke(kvs[1], 'filterRand', _.partial(filters[0], first)));

  if (rest.length < args.length - 1) {
    return null;
  }

  var words = _.object(kvs[0], [first].concat(rest));

  return _.map(args, _.partial(_.result, words));
};

Lists.prototype.filters = {

  first: function (letter, a, b) {
    return b[0] == letter;
  },

  // Pick a set of alliterative words
  alliterative: function (a, b) {
    return a[0] == b[0];
  }
};


var _ = require('underscore');

module.exports = Lists;

var byShortest = function (a, b) {
  return a.length > b.length;
};

var matchFirst = function (a, b) {
  return a[0] == b[0];
};

function Lists (lists) {
  this.lists = lists;
}

Lists.prototype.alliterative = function () {

  var args = [].slice.call(arguments),
      lists = args.map(this.get, this).sort(byShortest);

  var first = lists[0].rand(),
      rest = _.invoke(lists.slice(1), 'filterRand', _.partial(matchFirst, first));

  if (_.compact(rest).length < args.length - 1) {
    return null;
  }

  return [first].concat(rest);
};

Lists.prototype.get = function (key) {
  return this.lists[key];
};


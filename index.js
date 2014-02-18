var _ = require('lodash'),
    path = require('path');

var filters = require(path.resolve(__dirname, 'src', 'filters')),
    generate = require(path.resolve(__dirname, 'src', 'generate')),
    loadLists = require(path.resolve(__dirname, 'src', 'load'));

function getFunction (obj, key) {
  if (_.isFunction(key)) return key;
  return obj[key];
}

module.exports = function (opts) {

  var defaults = {
    dir: path.resolve(__dirname, 'resources')
  };

  var options = _.extend({}, defaults, opts);

  var lists = loadLists(options.dir);

  var getList = _.partial(getFunction, lists),
      getFilter = _.partial(getFunction, filters);

  return {
    filters: _.partial(_.keys, filters),
    generate: function (filterNames, listNames) {
      var unknownFilters = _.difference(filterNames, this.filters()),
          unknownLists = _.difference(listNames, this.lists());

      if (unknownFilters.length) {
        return new ReferenceError('Unknown filter(s): ' + unknownFilters.join(', '));
      }
      else if (unknownLists.length) {
        return new ReferenceError('Unknown lists(s): ' + unknownLists.join(', '));
      }

      return generate(listNames.map(getList), filterNames.map(getFilter));
    },
    lists: _.partial(_.keys, lists)
  };
};


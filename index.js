var _ = require('lodash'),
    path = require('path');

var filters = require(path.resolve('./src', 'filters')),
    generate = require(path.resolve('./src', 'generate')),
    loadLists = require(path.resolve('./src', 'load'));

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
    generate: function (filters, listNames) {
      return generate(listNames.map(getList), filters.map(getFilter));
    }
  };
};


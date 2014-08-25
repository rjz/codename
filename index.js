var _ = require('lodash'),
    path = require('path');

var filters = require(path.resolve(__dirname, 'src', 'filters')),
    generate = require(path.resolve(__dirname, 'src', 'generate')),
    loadLists = require(path.resolve(__dirname, 'src', 'load'));

function getFunction (obj, key) {
  if (_.isFunction(key)) return key;
  return obj[key];
}

function referenceError (type, arg) {
  return new ReferenceError('Unknown ' + type + '(s): ' + arg);
}

/**
 * Build a codename generator
 *
 * @id codename
 * @param {Object} opts - An object containing one param (`dir`) describing
 *   where to find word lists
 * @type Function
 * @return {Object}
 */
module.exports = function (opts) {

  var defaults = {
    dir: path.resolve(__dirname, 'resources')
  };

  var options = _.extend({}, defaults, opts);

  var lists = loadLists(options.dir);

  var getList = _.partial(getFunction, lists),
      getFilter = _.partial(getFunction, filters);

  var exports = {};

  /**
   * A list of available filters
   *
   * @id filters
   * @group exports
   * @return {Array}
   */
  exports.filters = _.partial(_.keys, filters);

  /**
   * A codename gneerator.
   *
   *     var codename = require('codename')();
   *     console.log(codename.generate(
   *       ['adjectives', 'crayons'],
   *       ['alliterative','random']
   *     ));
   *
   * @id generate
   * @param {Array} filterNames - a list of filters (by name) to limit the words
   *   selected for the codename
   * @param {Array} listNames - a list of the wordlists to use when generating
   *   the codename
   * @group exports
   * @return {String}
   */
  exports.generate = function (filterNames, listNames) {
    var unknownFilters = _.difference(filterNames, this.filters()),
        unknownLists = _.difference(listNames, this.lists());

    if (unknownFilters.length) {
      return referenceError('filter', unknownFilters.join(', '));
    }
    else if (unknownLists.length) {
      return referenceError('list', unknownLists.join(', '));
    }

    return generate(listNames.map(getList), filterNames.map(getFilter));
  };

  /**
   * A list of available wordlists
   *
   * @id lists
   * @group exports
   * @return {Array}
   */
  exports.lists = _.partial(_.keys, lists);

  return exports;
};


var _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

var Lists = require(path.resolve(__dirname, 'src/lists')),
    Words = require(path.resolve(__dirname, 'src/words'));

function pickFilename (stat, file) {
  if (stat.isFile()) return file;
}

function toKey (file) {
  return path.basename(file, path.extname(file));
}

function toWords (buf) {
  return new Words(_.compact(buf.toString().split('\n')).map(capitalish).sort());
}

function readFile (f) {
  return fs.readFileSync(f);
}

function capitalish (str) {
  return str[0].toUpperCase() + str.slice(1);
}

// List all real files in the directory
function getDirectoryFilesSync (dir) {

  var fqpath = function (file) {
    return path.join(dir, file);
  };

  var files = fs.readdirSync(dir).map(fqpath),
      stats = files.map(fs.lstatSync);

  return _.compact(_.map(_.object(files, stats), pickFilename));
}

module.exports = function (opts) {;

  var defaults = {
    dir: path.resolve(__dirname, 'resources')
  };

  var options = _.extend({}, defaults, opts);

  var results = getDirectoryFilesSync(options.dir),
      lists = results.map(readFile);

  return new Lists(_.object(results.map(toKey), lists.map(toWords)));
};


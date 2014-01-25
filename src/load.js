var _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

function pickFilename (stat, file) {
  if (stat.isFile()) return file;
}

function toKey (file) {
  return path.basename(file, path.extname(file));
}

function toNormalizedWords (buf) {
  return _.compact(buf.toString().split('\n')).map(capitalish).sort();
}

function readFile (f) {
  return fs.readFileSync(f);
}

function capitalish (str) {
  return str[0].toUpperCase() + str.slice(1);
}

// List all "real" files in the directory
function getDirectoryFilesSync (dir) {

  var fqpath = function (file) {
    return path.join(dir, file);
  };

  var files = fs.readdirSync(dir).map(fqpath),
      stats = files.map(fs.lstatSync);

  return _.compact(_.map(_.object(files, stats), pickFilename));
}

/**
 *  Loads and normalizes wordlists from the given `dir`
 */
module.exports = function loadLists (dir) {
  var results = getDirectoryFilesSync(dir),
      listNames = results.map(toKey),
      listContents = results.map(readFile).map(toNormalizedWords);

  return _.object(listNames, listContents);
};


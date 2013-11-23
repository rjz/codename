var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    async = require('async');

function capitalish (str) {
  return str[0].toUpperCase() + str.slice(1);
}

function dirFiles (dir, callback) {

  var fqpath = function (file) {
    return path.join(dir, file);
  };

  var pickFilename = function (stat, file) {
    if (stat.isFile()) return file;
  };

  fs.readdir(dir, function (err, results) {
    var files;
    if (err) return callback(err);
    files = results.map(fqpath);
    async.map(files, fs.lstat, function (err, stats) {
      if (err) return callback(err);
      callback(null, _.compact(_.map(_.object(files, stats), pickFilename)));
    });
  });
}

function getLists (dir, callback) {

  var toKey = function (file) {
    return path.basename(file, path.extname(file));
  };

  var toWords = function (buf) {
    return _.compact(buf.toString().split('\n')).map(capitalish).sort();
  };

  dirFiles(dir, function (err, results) {
    if (err) return callback(err);
    async.map(results, fs.readFile, function (err, lists) {
      if (err) return callback(err);
      callback(null, _.object(results.map(toKey), lists.map(toWords)));
    });
  });
}

//////////////////////////////////////

getLists(path.resolve('./resources'), function (err, lists) {
  function getWord (list) {
    var index = Math.floor(Math.random(0, 1) * list.length);
    return list[index];
  }

  function getAssonant (l1, l2) {
    var first = getWord(l1),
        second = getWord(_.filter(l2, function (w) { return w[0] == first[0]; }));
    return [first, second];
  }

  console.log(getWord(lists.adjectives), getWord(lists.crayons));
  console.log(getAssonant(lists.adjectives, lists.cities));
});


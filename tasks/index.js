var path = require('path'),
    fs = require('fs');

function fatalOr (orElse) {
  return function (err, result) {
    if (err) {
      process.stderr.write(err.toString() + '\n');
      process.exit(1);
    }
    else {
      orElse.apply(this, [].slice.call(arguments, 1));
    }
  }
}

function indexBy (arr, key) {
  var indexed = {};

  arr.forEach(function (item) {
    var itemKey = item[key];
    indexed[itemKey] = indexed[itemKey] || [];
    indexed[itemKey].push(item);
  });

  return indexed;
}

// Generate documentation
//
//    $ npm run-script docs
//
module.exports.docs = function (patterns) {

  function transformComment (file, comment) {
    if (!comment.group) comment.group = packageJson.name;
    comment.file = path.relative(path.resolve(__dirname, '..'), file);
    return comment;
  }

  function transformFiles (files) {
    var indexedMethods = indexBy(files, 'group');
    return Object.keys(indexedMethods).map(function (group) {
      return {
        groupName: group,
        methods: indexedMethods[group]
      };
    })
  }

  var glob = require('glob'),
      hogan = require('hogan.js'),
      scrawl = require('scrawl');

  var packageJson = require(path.resolve(__dirname, '../package.json')),
      templateFiles = glob.sync(path.resolve(__dirname, './*.hogan'));

  var files = patterns.reduce(function (memo, pattern) {
    var srcFiles = glob.sync(path.resolve(__dirname, '..', pattern));
    srcFiles.forEach(function (path) {
      var scrawled = scrawl.parse(fs.readFileSync(path, 'utf8'));
      memo = memo.concat(scrawled.map(transformComment.bind(this, path)));
    });
    return memo;
  }, []);

  var templates = templateFiles.reduce(function (ts, f) {
    var name = path.basename(f, '.hogan');
    ts[name] = hogan.compile(fs.readFileSync(f, 'utf8'));
    return ts;
  }, {});

  var tmpl = templates['template'].render({
    groups      : transformFiles(files),
    repository  : packageJson.repository.url,
    name        : packageJson.name,
    license     : packageJson.license,
    description : packageJson.description
  }, templates);

  if (!fs.existsSync('./docs')) {
    fs.mkdirSync('./docs');
  }

  fs.createReadStream(__dirname + '/style.css')
    .pipe(fs.createWriteStream('./docs/style.css'));

  fs.writeFileSync('./docs/index.html', tmpl);
};


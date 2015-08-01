var path = require('path'),
    fs = require('fs');

var glob = require('glob'),
    hogan = require('hogan.js'),
    scrawlPackage = require('scrawl-package');

function indexBy (arr, key) {
  var indexed = {};

  arr.forEach(function (item) {
    var itemKey = item[key];
    indexed[itemKey] = indexed[itemKey] || [];
    indexed[itemKey].push(item);
  });

  return indexed;
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

// Generate documentation
//
//    $ npm run-script docs
//
module.exports.docs = function (patterns) {

  var templateFiles = glob.sync(path.resolve(__dirname, './*.hogan'));

  var templates = templateFiles.reduce(function (ts, f) {
    var name = path.basename(f, '.hogan');
    ts[name] = hogan.compile(fs.readFileSync(f, 'utf8'));
    return ts;
  }, {});

  var template = templates['template'];

  var content = scrawlPackage({
    match: patterns
  });

  content.groups = transformFiles(content.items);

  if (!fs.existsSync('./docs')) {
    fs.mkdirSync('./docs');
  }

  fs.createReadStream(__dirname + '/style.css')
    .pipe(fs.createWriteStream('./docs/style.css'));

  fs.writeFileSync('./docs/index.html', template.render(content, templates));
};


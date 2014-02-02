# Codename generator

Generates codenames. What for, you ask?

## Installation

    $ npm install -g codename

## Usage

From node,

    var codename = require('codename')();

    var filters = ['alliterative', 'random'],
        lists = ['crayons', 'adjectives', 'cities', 'animals'],
        myName = codename.generate(filters, lists);

#### Options

`codename.generate` takes two options: `filters` and `lists`.

  * `filters` (`Array[String|Function]`) - describes a set of filters
    that should be used to reduce each list to a single word

  * `lists` - (`Array[String|Array]`) - the names or contents of the lists
    to use for selecting names

#### From the CLI,

All arguments are forwarded from comma-delimited strings:

    $ codename \
      --lists=crayons,adjectives,cities,animals \
      --filters=alliterative,unique,random

### Writing Filters

Each filter takes a `memo` listing any other words selected followed by
the list of words the filter should be applied to. For instance, a filter
to limit results to words containing the letter `j`:

    var letterJFilter = function (memo, words) {
      return words.filter(function (w) {
        return w.toLowerCase().indexOf('j') > -1;
      });
    };

Alternatively, a filter may return a *single* word that should be added to
the name. These filters are `output` filters, and they should only be used
at the end of a filter list.

Filters may be contributed to `src/filters` or supplied as function arguments to `codename.generate`.

### Word Lists

  * Adjectives from http://www.keepandshare.com/doc/12894/adjective-list
  * Animals from http://en.wikipedia.org/wiki/Lists_of_animals
  * Cities from http://answers.google.com/answers/threadview?id=596822
  * Crayons from http://www.colourlovers.com/web/blog/2008/04/22/all-120-crayon-names-color-codes-and-fun-facts

### License

  * word lists (c) their respective authors
  * codename released under the WTFPL


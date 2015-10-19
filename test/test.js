'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var jsonCompare = require('../');
var out = process.stdout.write.bind(process.stdout);

it('should run jsonCompare and pass', function (cb) {
  var stream = jsonCompare();

  process.stdout.write = function (str) {
    out(str);

    if (/should pass/.test(str)) {
      assert(true);
      process.stdout.write = out;
      cb();
    }
  };

  stream.write(new gutil.File({
    path: 'fixture.js',
    contents: new Buffer('')
  }));

  stream.end();
});

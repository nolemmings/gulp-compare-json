'use strict';

var path = require('path');
var compareJson = require('compare-json');
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function(options) {
  options = options || {};

  var filePathCache = [];

  return through.obj(function (file, enc, cb) {

    console.log('File.path', file.path)
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    console.log('File.path', file.path)
    var resolvedPath = path.resolve(file.path);
    console.log('resolvedPath', resolvedPath)

    if (file.isStream()) {
      console.log('file is stream')
      cb(new gutil.PluginError('gulp-compare-json', 'Streaming not supported'));
      return;
    }
    filePathCache.push(resolvedPath);
    cb();
  }, function(cb) {
    try {
      console.log('filePathCache', filePathCache);
      compareJson(filePathCache, options);
    } catch (err) {
      cb(new gutil.PluginError('gulp-copmare-json', err, {showStack: true}));
    }
  });
}

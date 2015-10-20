'use strict';

var path = require('path');
var compareJson = require('compare-json');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

module.exports = function(options) {
  var failed = false;
  var opts = _.defaults({}, options, {
    failOnError: false
  });

  // We're using gulp so log output using `gutil.log`
  opts.output = gutil.log;
  opts.error = function(msg) {
    if (opts.failOnError ) {
      failed = true;
    }
    gutil.log(msg);
  };

  var filePathCache = [];

  /**
   * Cache all filenames.
   */
  function bufferContents(file, enc, cb) {
    // Do not support streams
    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-compare-json',  'Streaming not supported'));
      return;
    }

    var resolvedPath = path.resolve(file.path);
    filePathCache.push(resolvedPath);
    cb();
  }

  /**
   * When all filenames have been buffered, execute compare-json.
   */
  function endStream(cb) {
    try {
      compareJson(filePathCache, opts);
      if (failed) {
        cb(new gutil.PluginError('gulp-compare-json', 'Comparing json files failed', {showStack: false}));
      }
    } catch (err) {
      cb(new gutil.PluginError('gulp-compare-json', err, {showStack: true}));
    }
  }

  return through.obj(bufferContents, endStream);
}

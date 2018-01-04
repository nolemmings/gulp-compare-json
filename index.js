'use strict';

var path = require('path');
var compareJson = require('compare-json');
var PluginError = require('plugin-error');
var fancyLog = require('fancy-log');
var through = require('through2');
var _ = require('lodash');

module.exports = function(options) {
  var failed = false;
  var opts = _.defaults({}, options, {
    failOnError: false
  });

  // We're using gulp so log output using `fancy-log`
  opts.output = fancyLog.info;
  opts.error = function(msg) {
    if (opts.failOnError ) {
      failed = true;
    }
    fancyLog.info(msg);
  };

  var filePathCache = [];

  /**
   * Cache all filenames.
   */
  function bufferContents(file, enc, cb) {
    // Do not support streams
    if (file.isStream()) {
      cb(new PluginError('gulp-compare-json',  'Streaming not supported'));
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
        cb(new PluginError('gulp-compare-json', 'Comparing json files failed', {showStack: false}));
      } else {
        cb(null);
      }
    } catch (err) {
      cb(new PluginError('gulp-compare-json', err, {showStack: true}));
    }
  }

  return through.obj(bufferContents, endStream);
}

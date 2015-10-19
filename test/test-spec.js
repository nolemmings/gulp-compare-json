'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var through2 = require('through2');
var compareJson = require('../');

var originalLog = gutil.log;

describe('Test gulp-compare-json', function() {

  var out = '';

  beforeEach(function() {
    out = '';
    gutil.log = function(str) {
      out += str + '\n';
    }
  });

  it('should compare multiple json files', function (done) {
    gulp.src(__dirname + '/../fixture/*.json')
      .pipe(compareJson())
      .on('finish', function() {
        expect(out).toMatch(/test1\.json/);
        expect(out).toMatch(/test2\.json/);
        expect(out).toMatch(/is missing the following keys/);
        expect(out).toMatch(/test3\.json/);
        done();
      });
  });

  it('should throw error when no files were found', function (done) {
    gulp.src(__dirname + '/test.test')
      .pipe(compareJson({
        failOnError: true
      }))
      .on('error', function(err) {
        expect(out).toMatch(/Require at least two files, found none/);
        expect(err.message).toBe('Comparing json files failed');
        done();
      });
  });
});

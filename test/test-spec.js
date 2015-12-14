'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var through2 = require('through2');
var compareJson = require('../');

var originalLog = gutil.log;

function stripColors(string) {
  return string.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');
}

describe('Test gulp-compare-json', function() {

  var out = '';

  beforeEach(function() {
    out = '';
    gutil.log = function(str) {
      out += str + '\n';
    }
  });

  it('should compare multiple json files within the same group specified by `--groupBy`', function (done) {
    gulp.src(__dirname + '/../fixture/*.json')
      .pipe(compareJson({
        groupBy: 'group1',
        ignoreUngrouped: true
      }))
      .on('finish', function() {
        out = stripColors(out);
        expect(out).toMatch(/test1\.json/);
        expect(out).toMatch(/test2\.json is missing the following keys/);
        expect(out).toMatch(/test3\.json is complete/);
        expect(out).not.toMatch(/test4\.json/);
        done();
      });
  });

  it('should compare multiple json files within the same group specified by `--separator`', function (done) {
    gulp.src(__dirname + '/../fixture/*.json')
      .pipe(compareJson({
        separator: '-',
        ignoreUngrouped: true
      }))
      .on('finish', function() {
        out = stripColors(out);
        expect(out).toMatch(/test1\.json is missing the following keys/);
        expect(out).toMatch(/test2\.json is missing the following keys/);
        expect(out).toMatch(/test3\.json is complete/);
        expect(out).toMatch(/test4\.json is missing the following keys/);
        expect(out).toMatch(/test5\.json is complete/);
        done();
      });
  });

  it('should throw error when no files were found', function (done) {
    gulp.src(__dirname + '/test.test')
      .pipe(compareJson({
        failOnError: true
      }))
      .on('error', function(err) {
        expect(err.message).toBe('Require at least one file');
        done();
      });
  });
});

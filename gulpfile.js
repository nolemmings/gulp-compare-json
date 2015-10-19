'use strict';

var gulp = require('gulp');
var jsonCompare = require('./');
var jasmine = require('gulp-jasmine');

gulp.task('test', function() {
  return gulp
    .src('test/**/*-spec.js')
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: true
    }));
});

gulp.task('default', function () {
  return gulp.src('fixture/*.json', { read: false }).pipe(jsonCompare({}));
});
